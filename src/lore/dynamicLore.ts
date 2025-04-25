/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: dynamicLore.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, EntityEquippableComponent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EquipmentSlot, ItemComponentTypes, ItemStack, Player, world } from "@minecraft/server";
import { getDynamicLore, hasDynamicLore } from "./manageDynamicLore";
import { DynamicLoreVariables, ReplacementLore } from "definitions";
import { setItemInSelectedSlot } from "./setLore";
import { DYNAMIC_LORE_ITEM_BLOCKS_BROKEN, DYNAMIC_LORE_ITEM_PVE_KILLS, DYNAMIC_LORE_ITEM_PVP_KILLS, DYNAMIC_LORE_ITEM_TOTAL_KILLS } from "constants";

// The lore is updated everytime the item is used
// Since we only have durability for now, we only need to check damage and block breaks
world.afterEvents.playerBreakBlock.subscribe((event) => {

    const originalItemStack = event.itemStackAfterBreak

    // Because sometimes you break things with your fist
    if (!originalItemStack) return
    
    // Don't update non-dynamic lore (It deletes it otherwise!)
    const isDynamic = hasDynamicLore(originalItemStack)
    if (!isDynamic) return

    const updatedItemStack = updateDynamicLore(originalItemStack)

    setItemInSelectedSlot(event.player, updatedItemStack)
})

world.afterEvents.entityHurt.subscribe((event: EntityHurtAfterEvent) => {
    const entity = event.hurtEntity

    if (!(entity instanceof Player)) return

    const equipmentComponent = entity.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent
    const headSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Head)
    const chestSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Chest)
    const legsSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Legs)
    const feetSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Feet)
    const offhandSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Offhand)
    const slots = [headSlot, chestSlot, legsSlot, feetSlot, offhandSlot]

    slots.forEach(slot => {

        if (!slot.hasItem()) return

        const updatedItem = updateDynamicLore(slot.getItem())
        slot.setItem(updatedItem)
    })
})

world.afterEvents.entityHitEntity.subscribe((event: EntityHitEntityAfterEvent) => {
    const sourceEntity = event.damagingEntity
    const hitEntity = event.hitEntity

    const entities = [sourceEntity, hitEntity]

    entities.forEach(entity => {
        
        if (!(entity instanceof Player)) return

        const equipmentComponent = entity.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent
        const mainhandSlot = equipmentComponent.getEquipmentSlot(EquipmentSlot.Mainhand)
        const slots = [mainhandSlot]

        slots.forEach(slot => {

            if (!slot.hasItem()) return

            const updatedItem = updateDynamicLore(slot.getItem())
            slot.setItem(updatedItem)
        })
    })
})

/**
 * Updates an item's dynamic lore.
 * @param item The itemstack.
 * @returns The itemstack with updated lore.
 */
export function updateDynamicLore(item: ItemStack): ItemStack {
    const dynamicLoreArray = getDynamicLore(item)

    // Item Durability Counters
    let itemDurability: number
    let itemMaxDurability: number
    const hasDurability = item.hasComponent(ItemComponentTypes.Durability)
    if (hasDurability) {
        const durabilityComponent = item.getComponent(ItemComponentTypes.Durability)
        itemDurability = durabilityComponent.maxDurability - durabilityComponent.damage
        itemMaxDurability = durabilityComponent.maxDurability
    }

    // Item Kill Counters
    const totalKills = item.getDynamicProperty(DYNAMIC_LORE_ITEM_TOTAL_KILLS) == undefined ? 0 : item.getDynamicProperty(DYNAMIC_LORE_ITEM_TOTAL_KILLS) as number
    const pvpKills = item.getDynamicProperty(DYNAMIC_LORE_ITEM_PVP_KILLS) == undefined ? 0 : item.getDynamicProperty(DYNAMIC_LORE_ITEM_PVP_KILLS) as number
    const pveKills = item.getDynamicProperty(DYNAMIC_LORE_ITEM_PVE_KILLS) == undefined ? 0 : item.getDynamicProperty(DYNAMIC_LORE_ITEM_PVE_KILLS) as number

    // Blocks broken
    const blocksBroken = item.getDynamicProperty(DYNAMIC_LORE_ITEM_BLOCKS_BROKEN) == undefined ? 0 : item.getDynamicProperty(DYNAMIC_LORE_ITEM_BLOCKS_BROKEN) as number

    // Replacing the lore
    const replacementLore: ReplacementLore = {
        [DynamicLoreVariables.Durability]: hasDurability ? itemDurability.toString() : "0",
        [DynamicLoreVariables.MaxDurability]: hasDurability ? itemMaxDurability.toString() : "0",
        [DynamicLoreVariables.TotalKills]: totalKills.toString(),
        [DynamicLoreVariables.PlayerKills]: pvpKills.toString(),
        [DynamicLoreVariables.EntityKills]: pveKills.toString(),
        [DynamicLoreVariables.BlocksBroken]: blocksBroken.toString(),
    }

    const updatedLore = replace(dynamicLoreArray, replacementLore)
    // const updatedLore = ["AA", "THIS IS A STRING!!!"]
    let updatedItem = item.clone()
    updatedItem.setLore(updatedLore)
    return updatedItem
}

/**
 * Replaces placeholder lore variables.
 * @param placeholderLore The original lore array containing placeholders.
 * @param replacementLore Key value pairs of the placeholder lore and the replacement lore.
 * @returns The updated lore array.
 */
function replace(placeholderLore: string[], replacementLore: ReplacementLore): string[] {

    const newLore = [] as string[]
    placeholderLore.forEach(loreLine => {
        let newLoreLine = loreLine

        // It passes empty lines sometimes
        if (!loreLine) return

        // Substitues all the variables for their real values
        const dynamicLoreVariables = Object.values(DynamicLoreVariables)

        dynamicLoreVariables.forEach(dynamicLoreVariable => {
            newLoreLine = newLoreLine.split(dynamicLoreVariable).join(replacementLore[dynamicLoreVariable])
        })

        newLore.push(newLoreLine)
    })


    return newLore
}