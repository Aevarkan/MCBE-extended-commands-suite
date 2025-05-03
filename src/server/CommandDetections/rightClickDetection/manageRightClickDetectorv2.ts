/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageRightClickDetectorv2.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, EntityInventoryComponent, ItemStack, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { hasDynamicLore } from "server/lore/manageDynamicLore";
import { COMMAND_ERROR_SOUND, COMMAND_SUCESS_SOUND } from "constants";
import { ItemCommandDatabase } from "classes/ItemCommandDatabase";
import { RemoveOptions } from "types/misc";

/**
 * This makes a right click detector in the player's selected hotbar slot
 */
export function createRightClickDetectorv2(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const parameters = event.message as string
    const slot = player.selectedSlotIndex as number

    // Parsing the command
    const parts = parameters.split(" ")

    const commandName = parts[0]
    const isFarMode = parts[1].toLowerCase() === "true" ? true : false
    const command = parts.slice(2).join(" ")

    createRightClickDetectorAction(player, commandName, command, slot, isFarMode)
}

/**
 * This removes the right click detector in the player's selected hotbar slot.
 */
export function removeRightClickDetectorv2(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const slot = player.selectedSlotIndex as number
    const commandId = event.message

    if (commandId.length === 0) {
        removeRightClickDetectorAction(player, slot, {removeAll: true})
    } else {
        removeRightClickDetectorAction(player, slot, {removeAll: false, id: commandId})
    }
}

/**
 * Creates a right click detector.
 * @param player The player who is creating a detector.
 * @param commandId The identifier for the command.
 * @param command The command the item will run when used.
 * @param slot The inventory slot the item is in.
 * @param farMode Whether or not to do a raycast and cast the command there.
 */
function createRightClickDetectorAction(player: Player, commandId: string, command: string, slot: number, farMode: boolean) {
    const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent
    const inventory = inventoryComponent.container
    const selectedItem = inventory.getItem(slot)

    // You need to put lore on your item, it's too dangerous otherwise
    const lore = selectedItem.getLore()
    if (lore.length === 0) {
        player.sendMessage({translate: "ecs.command.item_command.error.no_lore"})
        player.playSound(COMMAND_ERROR_SOUND)
        return
    }

    // Just for command feedback
    const isDynamic = hasDynamicLore(selectedItem)

    player.sendMessage({translate: "ecs.command.item_command.applied_command", with: [command, commandId, selectedItem.typeId]})
    player.playSound(COMMAND_SUCESS_SOUND)

    // Putting it here so it goes below the success message for players
    if (isDynamic) {
        player.sendMessage({translate: "ecs.command.item_command.detected_dynamic_lore"})
    }

    const itemCommandDatabase = new ItemCommandDatabase(selectedItem)

    itemCommandDatabase.addItemCommandEntry(command, commandId, farMode)
}

/**
 * Removes right click detector(s) from an item.
 * @param player The player who is removing the detector.
 * @param slot The inventory slot the item is in.
 * @param removeOptions Additional information about removal.
 */
function removeRightClickDetectorAction(player: Player, slot: number, removeOptions: RemoveOptions) {
    const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent
    const inventory = inventoryComponent.container
    const item = inventory.getItem(slot)
    const itemCommandDatabase = new ItemCommandDatabase(item)
    
    // This is used just for command feedback
    const itemTypeId = inventoryComponent.container.getItem(slot).typeId
    const commandMatches = itemCommandDatabase.getItemCommandMatches()

    if (removeOptions.removeAll === true) {
        itemCommandDatabase.removeAllItemCommandEntries()
        player.sendMessage({translate: "ecs.command.item_command.removed_all", with: [itemTypeId]})
        player.playSound(COMMAND_SUCESS_SOUND)

        commandMatches.forEach(commandMatch => {
            player.sendMessage({translate: "ecs.command.item_command.removed_command", with: [commandMatch, itemTypeId]})
        })

    } else {
        const commandId = removeOptions.id

        itemCommandDatabase.removeItemCommandEntry(commandId)

        if (commandMatches.includes(commandId)) {
            player.sendMessage({translate: "ecs.command.item_command.removed_command", with: [commandId, itemTypeId]})
            player.playSound(COMMAND_SUCESS_SOUND)
        } else {
            player.sendMessage({translate: "ecs.command.item_command.removed_command_no_exist", with: [commandId, itemTypeId]})
            player.playSound(COMMAND_ERROR_SOUND)
        }
    }
}

export function queryItemCommandsScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const inventory = player.getComponent(EntityComponentTypes.Inventory)
    const item = inventory.container.getItem(player.selectedSlotIndex)

    if (!item) {
        player.sendMessage({translate: "ecs.command.item_command.query.no_item"})
        player.playSound(COMMAND_ERROR_SOUND)
        return
    }

    queryItemCommands(player, item)
}

/**
 * @param player The player to send the message to.
 * @param item The {@link ItemStack} to check.
 */
function queryItemCommands(player: Player, item: ItemStack) {
    const itemCommandDatabase = new ItemCommandDatabase(item)

    const itemTypeId = item.typeId
    const commandMatches = itemCommandDatabase.getItemCommandMatches()

    if (commandMatches.length === 0) {
        player.sendMessage({translate: "ecs.command.item_command.query.no_commands", with: [itemTypeId]})
        player.playSound(COMMAND_ERROR_SOUND)
    } else {

        commandMatches.forEach(commandId => {
            
            const commandInfo = itemCommandDatabase.getItemCommandEntry(commandId)
            const command = commandInfo.command

            player.sendMessage({translate: "ecs.command.item_command.query.found_command", with: [command, commandId, itemTypeId]})

        })

        player.playSound(COMMAND_SUCESS_SOUND)

    }
}