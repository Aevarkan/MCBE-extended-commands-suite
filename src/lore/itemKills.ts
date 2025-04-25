/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: index.ts
 * Author: Aevarkan
 */

import { ContainerSlot, EntityComponentTypes, EquipmentSlot, ItemStack, Player, world } from "@minecraft/server";
import { DYNAMIC_LORE_ITEM_PVE_KILLS, DYNAMIC_LORE_ITEM_PVP_KILLS, DYNAMIC_LORE_ITEM_TOTAL_KILLS } from "constants";
import { hasDynamicLore } from "./manageDynamicLore";
import { updateDynamicLore } from "./dynamicLore";

world.afterEvents.entityDie.subscribe((event) => {
    const killer = event.damageSource.damagingEntity
    const victim = event.deadEntity

    // Only players have kill counters updated
    if (!(killer instanceof Player)) return

    const equipmentComponent = killer.getComponent(EntityComponentTypes.Equippable)
    const killingItemSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Mainhand)
    
    const killingItem = killingItemSlot.getItem()
    const isKillingItemDynamic = hasDynamicLore(killingItem)
    
    // We only add to the kill counter if the item has dynamic lore
    if (!isKillingItemDynamic) return

    if (victim instanceof Player) {
        addItemSlotKill(killingItemSlot, 1, true)
    } else {
        addItemSlotKill(killingItemSlot, 1, false)
    }
    
})

/**
 * Adds to an item's kill counter.
 * @param slot The container slot the item is in.
 * @param increment The number of kills to add.
 * @param pvpKill Was the kill a PvP kill?
 */
function addItemSlotKill(slot: ContainerSlot, increment: number, pvpKill: boolean) {
    const originalItem = slot.getItem()
    const updatedItem = addItemKills(originalItem, increment, pvpKill)

    slot.setItem(updatedItem)
}

/**
 * Adds to an item's kill counter.
 * @param item The item.
 * @param increment The number of kills to add.
 * @param pvpKill Was the kill a PvP kill?
 * @returns The updated item.
 */
function addItemKills(item: ItemStack, increment: number, pvpKill: boolean): ItemStack {
    const updatedItem = item.clone()
    const totalKills = updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_TOTAL_KILLS) == undefined ? 0 : updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_TOTAL_KILLS) as number
    const pvpKills = updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_PVP_KILLS) == undefined ? 0 : updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_PVP_KILLS) as number
    const pveKills = updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_PVE_KILLS) == undefined ? 0 : updatedItem.getDynamicProperty(DYNAMIC_LORE_ITEM_PVE_KILLS) as number

    updatedItem.setDynamicProperty(DYNAMIC_LORE_ITEM_TOTAL_KILLS, totalKills + increment)

    if (pvpKill) {
        updatedItem.setDynamicProperty(DYNAMIC_LORE_ITEM_PVP_KILLS, pvpKills + increment)
    } else {
        updatedItem.setDynamicProperty(DYNAMIC_LORE_ITEM_PVE_KILLS, pveKills + increment)
    }

    const updatedItemWithLore = updateDynamicLore(updatedItem)

    return updatedItemWithLore
}