/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageRightClickDetector.ts
 * Author: Aevarkan
 */

import { Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";

/**
 * This makes a right click detector in the player's selected hotbar slot
 */
export function createRightClickDetector(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const command = event.message as string
    const slot = player.selectedSlotIndex as number

    createRightClickDetectorAction(player, command, slot, false)
}

/**
 * This removes the right click detector in the player's selected hotbar slot.
 */
export function removeRightClickDetector(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const slot = player.selectedSlotIndex as number

    removeRightClickDetectorAction(player, slot)
}

/**
 * 
 * @param player The player who is creating a detector.
 * @param command The command the item will run when used.
 * @param slot The inventory slot the item is in.
 */
function createRightClickDetectorAction(player: Player, command: string, slot: number, farMode: boolean) {
    const inventory = player.getComponent("minecraft:inventory").container
    const selectedItem = inventory.getItem(slot)
    
    if (selectedItem.isStackable){
        
        player.sendMessage("Stackable items are not supported with this command.")
        // QIDB has problems when reloading script / reloading the world
        // Cannot use it for now
        // // Increase counter by 1. This is very primitive, but I don't expect any problems unless 
        // // Someone makes a huge number of stackable items, which shouldn't really happen
        // let count = world.getDynamicProperty('cmdlib:stackable_item_command_counter') as number || 0
        // count += 1;
        // world.setDynamicProperty('cmdlib:stackable_item_command_counter', count);

        // // Use the count as the key
        // const key = `item_${count}`;

        // const commandOptions: CommandOptions = {
        //     command: command,
        //     farMode: farMode
        // }

        // saveItemCommandPair(key, selectedItem, commandOptions)
        
    } else { // If unstackable item, then just set dynamic properties on it
        // Must replace the item, as we can't modify existing ones
        let updatedItem = selectedItem.clone()
        updatedItem.setDynamicProperty('isCommandItem', true)
        updatedItem.setDynamicProperty('farCommandMode', false)
        updatedItem.setDynamicProperty('command', command)

        inventory.setItem(slot, updatedItem)
    }
}

/**
 * 
 * @param player The player who is removing the detector.
 * @param slot The inventory slot the item is in.
 */
function removeRightClickDetectorAction(player: Player, slot: number) {
    const inventory = player.getComponent("minecraft:inventory").container
    const selectedItem = inventory.getItem(slot)
    
    if (selectedItem.isStackable){
        player.sendMessage("Stackable items are not supported with this command.")
        // const commandPairs = getAllItemCommandPairs()
        // for (const pair of commandPairs) {
        //     if (selectedItem.isStackableWith(pair.itemStack)) {
        //         removeItemCommandPair(pair.key)
        //     }
        // }
    } else { // Unstackable items are easier
        // Must replace the item, as we can't modify existing ones
        let updatedItem = selectedItem.clone()
        updatedItem.setDynamicProperty('isCommandItem', true)
        updatedItem.setDynamicProperty('farCommandMode', false)
        updatedItem.setDynamicProperty('command', undefined)

        inventory.setItem(slot, updatedItem)
    }
}