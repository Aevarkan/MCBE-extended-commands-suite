/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageRightClickDetectorv2.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, EntityInventoryComponent, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { RemoveOptions } from "server/definitions";
import { hasDynamicLore } from "server/lore/manageDynamicLore";
import { COMMAND_ERROR_SOUND, COMMAND_SUCESS_SOUND } from "constants";
import { ItemCommandDatabase } from "classes/ItemCommandDatabase";

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

    // This is used just for command feedback
    const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory)
    const itemTypeId = inventoryComponent.container.getItem(slot).typeId
    // const lore = inventoryComponent.container.getItem(slot).getLore()

    if (commandId.length === 0) {
        removeRightClickDetectorAction(player, slot, {removeAll: true})
        player.sendMessage({translate: "ecs.command.item_command.removed_all", with: [itemTypeId]})
        player.playSound(COMMAND_SUCESS_SOUND)
    } else {
        removeRightClickDetectorAction(player, slot, {removeAll: false, id: commandId})
        player.sendMessage({translate: "ecs.command.item_command.removed_command", with: [commandId, itemTypeId]})
        player.playSound(COMMAND_SUCESS_SOUND)
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
 * 
 * @param player The player who is removing the detector.
 * @param slot The inventory slot the item is in.
 * @param removeOptions Additional information about removal.
 */
function removeRightClickDetectorAction(player: Player, slot: number, removeOptions: RemoveOptions) {
    const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent
    const inventory = inventoryComponent.container
    const item = inventory.getItem(slot)
    const itemCommandDatabase = new ItemCommandDatabase(item)
    
    if (removeOptions.removeAll === true) {
        itemCommandDatabase.removeAllItemCommandEntries()
    } else {
        itemCommandDatabase.removeItemCommandEntry(removeOptions.id)
    }
}
