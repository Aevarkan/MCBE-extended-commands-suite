/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: blocksMined.ts
 * Author: Aevarkan
 */

import { ContainerSlot, EntityComponentTypes, EquipmentSlot, ItemStack, Player, world } from "@minecraft/server";
import { DYNAMIC_LORE_ITEM_BLOCKS_BROKEN } from "constants";
import { hasDynamicLore } from "./manageDynamicLore";
import { updateDynamicLore } from "./dynamicLore";

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const player = event.player
    const breakingItem = event.itemStackAfterBreak

    const equipmentComponent = player.getComponent(EntityComponentTypes.Equippable)
    const breakingItemSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Mainhand)
    const isBreakingItemDynamic = hasDynamicLore(breakingItem)
    
    // The tool used to break the block must be in the mainhand (If the offhand can break blocks, this will have to be changed!)
    // const breakingItemInSlot = breakingItemSlot.getItem()
    // if (!(breakingItem === breakingItemInSlot)) return

    // We only add to the break counter if the item has dynamic lore
    if (!isBreakingItemDynamic) return

    addItemSlotBreaks(breakingItemSlot, 1)
})

/**
 * Adds to an item's blocks broken counter.
 * @param slot The container slot the item is in.
 * @param increment The number of blocks broken to add.
 */
function addItemSlotBreaks(slot: ContainerSlot, increment: number) {
    const originalItem = slot.getItem()
    const updatedItem = addItemBreaks(originalItem, increment)

    slot.setItem(updatedItem)
}

/**
 * Adds to an item's blocks broken counter.
 * @param item The item.
 * @param increment The number of blocks broken to add.
 * @returns The updated item.
 */
function addItemBreaks(item: ItemStack, increment: number): ItemStack {
    const updatedItem = item.clone()
    const blocksBroken = updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_BLOCKS_BROKEN) == undefined ? 0 : updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_BLOCKS_BROKEN) as number

    updatedItem.setDynamicProperty(DYNAMIC_LORE_ITEM_BLOCKS_BROKEN, blocksBroken + increment)

    const updatedItemWithLore = updateDynamicLore(updatedItem)

    return updatedItemWithLore
}