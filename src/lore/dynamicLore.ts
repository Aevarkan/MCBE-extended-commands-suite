/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: dynamicLore.ts
 * Author: Aevarkan
 */

import { ItemComponentTypes, ItemStack, Player, world } from "@minecraft/server";
import { getDynamicLore } from "./manageDynamicLore";
import { DynamicLoreVariables, ReplacementLore } from "definitions";
import { setItemInSelectedSlot } from "./setLore";

// The lore is updated everytime the item is used
// Since we only have durability for now, we only need to check on attacks and block breaks
world.afterEvents.playerBreakBlock.subscribe((event) => {
    
    const originalItemStack = event.itemStackAfterBreak
    const updatedItemStack = updateDynamicLore(originalItemStack)

    setItemInSelectedSlot(event.player, updatedItemStack)
})

// world.afterEvents.entityHitEntity.subscribe((event) => {
//     const sourceEntity = event.damagingEntity
//     const hitEntity = event.hitEntity

//     const entities = [sourceEntity, hitEntity]

//     entities.forEach(entity => {
        
//         if (entity !instanceof Player) return



//     })
// })

/**
 * Updates an item's dynamic lore.
 * @param item The itemstack.
 * @returns The itemstack with updated lore.
 */
function updateDynamicLore(item: ItemStack): ItemStack {
    const dynamicLoreArray = getDynamicLore(item)

    let itemDurability: number
    let itemMaxDurability: number
    const hasDurability = item.hasComponent(ItemComponentTypes.Durability)
    if (hasDurability) {
        const durabilityComponent = item.getComponent(ItemComponentTypes.Durability)
        itemDurability = durabilityComponent.maxDurability - durabilityComponent.damage
        itemMaxDurability = durabilityComponent.maxDurability
    }

    const replacementLore: ReplacementLore = {
        [DynamicLoreVariables.Durability]: hasDurability ? itemDurability.toString() : "0",
        [DynamicLoreVariables.MaxDurability]: hasDurability ? itemMaxDurability.toString() : "0",
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
    // const newLore = placeholderLore.map(loreLine => {
    //     let newLoreLine = loreLine

    //     // It passes empty lines sometimes
    //     if (!loreLine) return
        
    //     newLoreLine = newLoreLine.split(DynamicLoreVariables.Durability).join(replacementLore[DynamicLoreVariables.Durability])
    //     newLoreLine = newLoreLine.split(DynamicLoreVariables.MaxDurability).join(replacementLore[DynamicLoreVariables.MaxDurability])
    //     return newLoreLine.toString()
    // })

    const newLore = [] as string[]
    placeholderLore.forEach(loreLine => {
        let newLoreLine = loreLine

        // It passes empty lines sometimes
        if (!loreLine) return
        
        newLoreLine = newLoreLine.split(DynamicLoreVariables.Durability).join(replacementLore[DynamicLoreVariables.Durability])
        newLoreLine = newLoreLine.split(DynamicLoreVariables.MaxDurability).join(replacementLore[DynamicLoreVariables.MaxDurability])
        newLore.push(newLoreLine.toString())
        // newLore.push(newLoreLine)
    })


    return newLore
}