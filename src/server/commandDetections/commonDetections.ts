/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: commonDetections.ts
 * Author: Aevarkan
 */

import { CustomCommandOrigin, CustomCommandParamType, Entity, EntityComponentTypes, Player, system } from "@minecraft/server"
import { defineCommand, defineParameter } from "command-wrapper"
import { COMMAND_ERROR_SOUND, COMMAND_SUCESS_SOUND, commandRegister, PLAYER_CLIMBING_TAG } from "constants"
import { EntityCommandDatabase, EntityCommandTypes } from "library/classes/EntityCommandDatabase"
import { ItemCommandDatabase } from "library/classes/ItemCommandDatabase"
import { RemoveOptions } from "types/misc"
import { createRightClickDetectorAction, queryItemCommands } from "./rightClickDetection/manageRightClickDetectorv2"

/**
 * Creates a command detector for an entity.
 * @param detectorType The type of detection.
 * @param entity The entity that stores the command.
 * @param entryId The identifier for the command.
 * @param command The command to be run.
 */
export function createEntityDetector(detectorType: EntityCommandTypes, entity: Entity, entryId: string, command: string) {
    const entityDatabase = new EntityCommandDatabase(entity)

    entityDatabase.addEntry(detectorType, command, entryId)
}

/**
 * Removes a command detector from an entity.
 * @param detectorType The type of detection.
 * @param entity The player to remove the jump detector from.
 * @param removeOptions Arguments on how to remove the detector(s).
 */
export function removeEntityDetector(detectorType: EntityCommandTypes, entity: Entity, removeOptions: RemoveOptions) {

    const entityDatabase = new EntityCommandDatabase(entity)

    if (removeOptions.removeAll === true) {
        entityDatabase.removeAllEntries(detectorType)
    } else {
        entityDatabase.removeEntry(detectorType, removeOptions.id)
    }
}

// custom command

const targetParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})

const commandModeParam = defineParameter({
    name: "detectionMode",
    type: CustomCommandParamType.Enum,
    mandatory: true,
    values: ["add", "view", "remove"] as const
})

// "on" means an external entity does the event
// ext means the external entity runs the command
// itemUseFar

const detectionTypeParam = defineParameter({
    name: "detectorType",
    type: CustomCommandParamType.Enum,
    mandatory: true,
    values: ["entity", "death", "emote", "onInteractExt", "jump", "itemUse", "itemUseFar", "onPunchExt"] as const
})

const commandNameParam = defineParameter({
    name: "commandName",
    type: CustomCommandParamType.String,
    mandatory: false,
})

const commandParam = defineParameter({
    name: "command",
    type: CustomCommandParamType.String,
    mandatory: false
})

// actioncommand

const detectionCommand = defineCommand({
    name: "actioncommand",
    description: "Edits command actions according to parameters.",
    parameters: [targetParam, commandModeParam, detectionTypeParam, commandNameParam, commandParam],
    callbackFunction(origin, targets, mode, commandType, commandName?, command?) {
        
        system.run(() => {
            targets.forEach(entity => {
    
                // for ITEM related functions
                if (commandType === "itemUse" || commandType === "itemUseFar") {
                    // this only works for players
                    const player = entity
                    if (!(player instanceof Player)) return
    
                    const selectedSlot = player.selectedSlotIndex
                    const heldItem = player.getComponent(EntityComponentTypes.Inventory)?.container.getItem(selectedSlot)
    
                    // give feedback if player is running command themselves
                    const playerIsOrigin = (player.id === origin.sourceEntity?.id)
                    const sourcePlayer = origin.sourceEntity
    
                    // give feedback for not having an item
                    if (!heldItem) {
                        if (playerIsOrigin) {
                            // view is query, others are just the item
                            if (mode === "view") {
                                player.sendMessage({translate: "ecs.command.item_command.query.no_item"})
                            } else {
                                player.sendMessage({translate: "ecs.command.item_command.error.no_item"})
                            }
                            player.playSound(COMMAND_ERROR_SOUND)
                        }
                        return
                    }
    
                    // now the three different options
                    const heldItemDatabase = new ItemCommandDatabase(heldItem)
                    const commandIds = heldItemDatabase.getItemCommandMatches()
    
                    // view the commands
                    if (mode === "view") {
                        // use the old function
                        queryItemCommands(player, heldItem)
                    
                    // removing commands
                    } else if (mode === "remove") {
                        // remove all if none specified
                        if (!commandName) {
                            heldItemDatabase.removeAllItemCommandEntries()
                            player.sendMessage({translate: "ecs.command.item_command.removed_all", with: [heldItem.typeId]})
                            player.playSound(COMMAND_SUCESS_SOUND)
                    
                            commandIds.forEach(commandMatch => {
                                player.sendMessage({translate: "ecs.command.item_command.removed_command", with: [commandMatch, heldItem.typeId]})
                            })
                        }
                        // otherwise just remove one commmand
                        else {
                            // always remove it in case it's corrupted somehow
                            heldItemDatabase.removeItemCommandEntry(commandName)
                            // if it exists, tell the playaer
                            if (commandIds.includes(commandName)) {
                                player.sendMessage({translate: "ecs.command.item_command.removed_command", with: [commandName, heldItem.typeId]})
                                player.playSound(COMMAND_SUCESS_SOUND)
                            // also tell the player if it couldn't find that command to remove
                            } else {
                                player.sendMessage({translate: "ecs.command.item_command.removed_command_no_exist", with: [commandName, heldItem.typeId]})
                                player.playSound(COMMAND_ERROR_SOUND)
                            }
                        }
                    // otherwise it must be 'add'
                    } else {
                        // not FAR mode
                        if (commandType === "itemUse") {
                            // TODO: add errors
                            // I sure hope you use it correctly, as I haven't yet been bothered to add error handling here
                            createRightClickDetectorAction(player, commandName!, command!, selectedSlot, false)
                        // farmode
                        } else {
                            createRightClickDetectorAction(player, commandName!, command!, selectedSlot, true)
                        }
                    }
    

                // not ITEM related commands
                } else {
                    // now we're doing entity commands
                    const entityDatabase = new EntityCommandDatabase(entity)
                    if (mode === "remove") {
                        switch (commandType) {
                            // if no commandName specified, then remove ALL
                            case "entity":
                                if (!commandName) {
                                    entityDatabase.clearDatabase()
                                }
                                // NOTE: this doesn't clear individual commands.
                                // TODO: give an error
                                break

                            case "death":
                                if (commandName) {
                                    entityDatabase.removeEntry(EntityCommandTypes.DeathCommand, commandName)
                                } else {
                                    entityDatabase.removeAllEntries(EntityCommandTypes.DeathCommand)
                                }
                                break

                            case "emote":
                                if (commandName) {
                                    entityDatabase.removeEntry(EntityCommandTypes.EmoteCommand, commandName)
                                } else {
                                    entityDatabase.removeAllEntries(EntityCommandTypes.EmoteCommand)
                                }
                                break

                            case "onInteractExt":
                                if (commandName) {
                                    entityDatabase.removeEntry(EntityCommandTypes.InteractCommand, commandName)
                                } else {
                                    entityDatabase.removeAllEntries(EntityCommandTypes.InteractCommand)
                                }
                                break

                            case "jump":
                                if (commandName) {
                                    entityDatabase.removeEntry(EntityCommandTypes.JumpCommand, commandName)
                                } else {
                                    entityDatabase.removeAllEntries(EntityCommandTypes.JumpCommand)
                                }
                                break

                            case "onPunchExt":
                                if (commandName) {
                                    entityDatabase.removeEntry(EntityCommandTypes.PunchCommand, commandName)
                                } else {
                                    entityDatabase.removeAllEntries(EntityCommandTypes.PunchCommand)
                                }
                                break

                        }
                    // add a command
                    } else if (mode === "add") {
                        if (!commandName || !command) {
                            // you need to supply a command
                            if (origin.sourceEntity instanceof Player) {
                                origin.sourceEntity.sendMessage({ translate: "ecs.command.entity_command.no_command"})
                            }
                            return
                        }
                        const sourcePlayer = origin.sourceEntity as Player | undefined

                        switch (commandType) {
                            case "death":
                                entityDatabase.addEntry(EntityCommandTypes.DeathCommand, command, commandName)
                                sourcePlayer?.sendMessage({translate: "ecs.command.entity_command.add.death", with: [command, commandName, entity.typeId]})
                                break

                            case "emote":
                                entityDatabase.addEntry(EntityCommandTypes.EmoteCommand, command, commandName)
                                sourcePlayer?.sendMessage({translate: "ecs.command.entity_command.add.emote", with: [command, commandName, entity.typeId]})
                                break

                            case "onInteractExt":
                                entityDatabase.addEntry(EntityCommandTypes.InteractCommand, command, commandName)
                                sourcePlayer?.sendMessage({translate: "ecs.command.entity_command.add.jump", with: [command, commandName, entity.typeId]})
                                break

                            case "jump":
                                entityDatabase.addEntry(EntityCommandTypes.JumpCommand, command, commandName)
                                sourcePlayer?.sendMessage({translate: "ecs.command.entity_command.add.onPunchExt", with: [command, commandName, entity.typeId]})
                                break

                            case "onPunchExt":
                                entityDatabase.addEntry(EntityCommandTypes.PunchCommand, command, commandName)
                                sourcePlayer?.sendMessage({translate: "ecs.command.entity_command.add.onInteractExt", with: [command, commandName, entity.typeId]})
                                break

                            // NO
                            case "entity":
                                break
                        }
                    // else, it is viewing them
                    } else {
                        // TODO
                        const sourcePlayer = origin.sourceEntity as Player | undefined
                        sourcePlayer?.sendMessage(entity.getDynamicPropertyIds())
                    }

                }
    
            })
            
        })

    },
})


commandRegister.registerCommand(detectionCommand)
