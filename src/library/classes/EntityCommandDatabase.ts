/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: EntityCommandDatabase.ts
 * Author: Aevarkan
 */

import { Entity } from "@minecraft/server"
import { DEATH_COMMAND_PREFIX, EMOTE_COMMAND_PREFIX, INTERACT_COMMAND_PREFIX, JUMP_COMMAND_PREFIX, PUNCH_COMMAND_PREFIX } from "constants"

/**
 * Describes the types of commands an entity can store.
 */
export enum EntityCommandTypes {
    /**
     * Runs a command when an entity dies.
     */
    DeathCommand = "deathcommand",
    /**
     * Runs a command when a player emotes.
     */
    EmoteCommand = "emotecommand",
    /**
     * Runs a command when a player jumps.
     */
    JumpCommand = "jumpcommand",
    /**
     * The entity that hits this entity will run a command.
     */
    PunchCommand = "punchcommand",
    /**
     * The player that interacts with this entity will run a command.
     */
    InteractCommand = "interactcommand",
}

/**
 * Stores commands for an entity.
 */
export class EntityCommandDatabase {

    entity: Entity

    /**
     * Creates a new database viewer for an entity.
     * @param entity
     */
    constructor(entity: Entity) {
        this.entity = entity
    }

    /**
     * Adds a command entry to an entity.
     * @param commandType The type of command, see {@link EntityCommandTypes}.
     * @param command The command the entity will run once killed.
     * @param commandId The identifier for the command.
     */
    addEntry(commandType: EntityCommandTypes, command: string, commandId: string) {

        let fullCommandId: string

        switch (commandType) {
            case EntityCommandTypes.DeathCommand:
                fullCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
                break
                
            case EntityCommandTypes.EmoteCommand:
                fullCommandId = `${EMOTE_COMMAND_PREFIX}${commandId}`
                break
                
            case EntityCommandTypes.JumpCommand:
                fullCommandId = `${JUMP_COMMAND_PREFIX}${commandId}`
                break
                
            case EntityCommandTypes.PunchCommand:
                fullCommandId = `${PUNCH_COMMAND_PREFIX}${commandId}` 
                break

            case EntityCommandTypes.InteractCommand:
                fullCommandId = `${INTERACT_COMMAND_PREFIX}${commandId}`
                break
        
            default:
                // We cannot proceed if we don't have a correct id
                throw Error
        }

        const correctCommand = command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)
        this.entity.setDynamicProperty(fullCommandId, correctCommand)

    }

    /**
     * Removes an entity's command.
     * @param commandType The type of command, see {@link EntityCommandTypes}.
     * @param commandId The identifier for the command.
     */
    removeEntry(commandType: EntityCommandTypes, commandId: string) {
        let fullcommandId: string

        switch (commandType) {
            case EntityCommandTypes.DeathCommand:
                fullcommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
                break

            case EntityCommandTypes.EmoteCommand:
                fullcommandId = `${EMOTE_COMMAND_PREFIX}${commandId}`
                break

            case EntityCommandTypes.JumpCommand:
                fullcommandId = `${JUMP_COMMAND_PREFIX}${commandId}`
                break

            case EntityCommandTypes.PunchCommand:
                fullcommandId = `${PUNCH_COMMAND_PREFIX}${commandId}`
                break

            case EntityCommandTypes.InteractCommand:
                fullcommandId = `${INTERACT_COMMAND_PREFIX}${commandId}`
                break

            default:

                // We cannot proceed if we don't have a correct id
                throw Error
        }
    
        this.entity.setDynamicProperty(fullcommandId, undefined)
    }

    /**
     * Removes all commands off an entity.
     * @param commandType The type of command, see {@link EntityCommandTypes}.
     */
    removeAllEntries(commandType: EntityCommandTypes) {
        const allCommandIds = this.getAllEntryIds(commandType)
    
        allCommandIds.forEach(id => {
            this.removeEntry(commandType, id)
        })
    }

    /**
     * Gets all command ids on an entity.
     * @returns A string array of ids, including the prefix.
     */
    getAllEntryIds(commandType: EntityCommandTypes) {
        const allKeys = this.entity.getDynamicPropertyIds()
        let filteredKeys = [] as string[]
        
        switch (commandType) {
            case EntityCommandTypes.DeathCommand:
                filteredKeys = allKeys.filter(item => item.startsWith(DEATH_COMMAND_PREFIX))
                break 

            case EntityCommandTypes.EmoteCommand:
                filteredKeys = allKeys.filter(item => item.startsWith(EMOTE_COMMAND_PREFIX))
                break 

            case EntityCommandTypes.JumpCommand:
                filteredKeys = allKeys.filter(item => item.startsWith(JUMP_COMMAND_PREFIX))
                break 

            case EntityCommandTypes.PunchCommand:
                filteredKeys = allKeys.filter(item => item.startsWith(PUNCH_COMMAND_PREFIX))
                break 

            case EntityCommandTypes.InteractCommand:
                filteredKeys = allKeys.filter(item => item.startsWith(INTERACT_COMMAND_PREFIX))
                break 

            default:
                // We cannot proceed if we haven't filtered the keys correctly
                throw Error
        }

        return filteredKeys
    }
    
    /**
     * Gets a command for an entity.
     * @param commandKey The identifier of the command, including the prefix.
     * @returns The command string.
     */
    getEntry(commandKey: string) {
        // Example input:
        // const fullId = `${DEATH_COMMAND_PREFIX}${deathCommandKey}`
        // This doesn't need separate functionality for each type

        const command = this.entity.getDynamicProperty(commandKey) as string
        return command
    }
}
