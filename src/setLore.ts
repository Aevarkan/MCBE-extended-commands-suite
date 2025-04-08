/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: setLore.ts
 * Author: Aevarkan
 */

import { Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";

export function setLore(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const loreString = event.message as string

    // Now we get the item the player has selected in their hotbar
    const selectedSlot = player.selectedSlotIndex

    // Split it into multiple lines
    const lore = loreString.split('\\n')

    setLoreAction(player, lore, selectedSlot)
}

// TODO: add an interactive lore command

/**
 * 
 * @param player The player who is holding the item.
 * @param loreArray A string array of the lore text.
 * @param slotIndex The slot which the item is in.
 */
function setLoreAction(player: Player, loreArray: string[], slotIndex: number) {
    const inventory = player.getComponent("minecraft:inventory").container
    const item = inventory.getItem(slotIndex)

    // Must replace the item, as we can't modify existing ones
    let updatedItem = item.clone()
    updatedItem.setLore(loreArray)

    inventory.setItem(slotIndex, updatedItem)
}