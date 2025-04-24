/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageDynamicLore.ts
 * Author: Aevarkan
 * Comments: Dynamic lore is stored in the item to ensure item commands still work. This doesn't work for stackable items as a result.
 */

import { ItemStack } from "@minecraft/server";
import { DYNAMIC_LORE_PREFIX, MAX_LORE_LINES } from "constants";

/**
 * Gets the original dynamic lore string of an item.
 * @param item The item.
 * @returns A string array, returns an empty array if there is no dynamic lore.
 */
export function getDynamicLore(item: ItemStack): string[] {
    const dynamicLore = [] as string[]
    for (let i = 0; i < MAX_LORE_LINES; i++) {
        // Stored as lore_line_0 -> lore_line_19
        const storedLoreLine = item.getDynamicProperty(`${DYNAMIC_LORE_PREFIX}${i}`) as string
        dynamicLore.push(storedLoreLine)
    }
    return dynamicLore
}

/**
 * Sets the dynamic lore string of an item.
 * @param item The item.
 * @param dynamicLore The dynamic lore array.
 */
export function setDynamicLore(item: ItemStack, dynamicLore: string[]) {

    // Clear old lore
    for (let i = 0; i < MAX_LORE_LINES; i++) {
        // Stored as lore_line_0 -> lore_line_19
        item.setDynamicProperty(`${DYNAMIC_LORE_PREFIX}${i}`, undefined)
    }


    dynamicLore.forEach((line, lineIndex) => {
        item.setDynamicProperty(`${DYNAMIC_LORE_PREFIX}${lineIndex}`, line)
    })
}