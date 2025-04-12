/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: manageRightClickDetectorv2.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { addEntry, removeAllEntries, removeEntry } from "./utility";

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
        removeRightClickDetectorAction(player, slot, {removeAll: false, commandId: commandId})
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
    const inventory = player.getComponent(EntityComponentTypes.Inventory).container
    const selectedItem = inventory.getItem(slot)

    // You need to put lore on your item, it's too dangerous otherwise
    const lore = selectedItem.getLore()
    if (lore.length === 0) {
        player.sendMessage("You must put lore on your item first!")
        return
    }

    addEntry(selectedItem, command, commandId, farMode)
}

/**
 * 
 * @param player The player who is removing the detector.
 * @param slot The inventory slot the item is in.
 * @param removeOptions Additional information about removal.
 */
function removeRightClickDetectorAction(player: Player, slot: number, removeOptions: RemoveOptions) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory).container
    const item = inventory.getItem(slot)
    
    if (removeOptions.removeAll === true) {
        removeAllEntries(item)
    } else {
        removeEntry(item, removeOptions.commandId)
    }
}

/**
 * Whether to remove all entries or just one.
 * If removing just one, the Id is required.
 */
type RemoveOptions =
  | { removeAll: true }
  | { removeAll: false; commandId: string }
