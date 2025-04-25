/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: setLore.ts
 * Author: Aevarkan
 */

import { EntityInventoryComponent, ItemStack, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { COMMAND_ERROR_SOUND, COMMAND_SUCESS_SOUND, MAX_LORE_LINES } from "constants";
import { DynamicLoreVariables } from "definitions";
import { checkEnumMatchString } from "utility/functions";
import { getDynamicLore, hasDynamicLore, setDynamicLore } from "./manageDynamicLore";
import { updateDynamicLore } from "./dynamicLore";

export function setLore(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const loreString = event.message as string

    // Now we get the item the player has selected in their hotbar
    const selectedSlot = player.selectedSlotIndex

    // Split it into multiple lines
    const lore = loreString.split('\\n')

    setLoreAction(player, lore, selectedSlot)
}

/**
 * 
 * @param player The player who is holding the item.
 * @param loreArray A string array of the lore text.
 * @param slotIndex The slot which the item is in.
 */
function setLoreAction(player: Player, loreArray: string[], slotIndex: number) {
    const inventory = player.getComponent(EntityInventoryComponent.componentId).container
    const item = inventory.getItem(slotIndex)

    // Must replace the item, as we can't modify existing ones
    let updatedItem = item.clone()
    updatedItem.setLore(loreArray)
    
    // Dynamic lore check
    const containsDynamicLore = checkEnumMatchString(loreArray, DynamicLoreVariables)
    if (containsDynamicLore && !(item.isStackable)) {
        updatedItem = setDynamicLore(updatedItem, loreArray)
        updatedItem = updateDynamicLore(updatedItem)
        player.sendMessage({translate: "ecs.command.lore.dynamic_lore.success"})
        player.playSound(COMMAND_SUCESS_SOUND)
    } else if (containsDynamicLore && item.isStackable){
        player.sendMessage({translate: "ecs.command.lore.dynamic_lore.no_stackable_items"})
        player.playSound(COMMAND_ERROR_SOUND)
    } else {
        updatedItem = setDynamicLore(updatedItem, [])
        // player.sendMessage({translate: "ecs.command.lore.success"})
    }

    inventory.setItem(slotIndex, updatedItem)
}

/**
 * Retrieves the lore string from the item at the specified line.
 * @param item The item that contains the lore.
 * @param lineIndex The line of lore to get, starts from 0.
 */
function getLorePart(item: ItemStack, lineIndex: number, includeDynamicLore: boolean) {
    const loreArray = item.getLore()
    const dynamicLore = getDynamicLore(item)
    const isDynamic = hasDynamicLore(item)

    let lore = loreArray[lineIndex]
    // We only get the dynamic lore if there is any!
    if (includeDynamicLore && isDynamic) {
        lore = dynamicLore[lineIndex]
    }

    if (!lore) { lore = "" }

    return lore
}

/**
 * Trims an array of empty elements after the last real element.
 * @param array The array.
 * @returns The trimmed array.
 */
function trimArray(array: any[]): any[] {
    let lastValidIndex = array.length;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] !== undefined && array[i] !== "") {
        lastValidIndex = i + 1;
        break;
      }
    }
    return array.slice(0, lastValidIndex);
  }
/**
 * Shows a form to the player for editing item lore.
 * @param player The player to show the form to.
 * @param item The item to edit the lore of.
 */
function showLoreEditingForm(player: Player, item: ItemStack) {
    const loreForm = new ModalFormData().title({translate: "ecs.command.lore.editing", with: [item.typeId] })

    loreForm.submitButton({translate: "ecs.command.lore.submit"})

    // Just for you to copy
    loreForm.textField({translate: "ecs.command.lore.section_character"}, "§", "§")

    // All 20 lore lines
    for (let i = 0; i < MAX_LORE_LINES; i++) {
        const currentLine = i + 1
        const currentLineString = currentLine.toString()
        loreForm.textField({translate: "ecs.command.lore.line_number", with: [currentLineString] }, { translate: "ecs.command.lore.maximum_50_characters" }, getLorePart(item, i, true))
    }
    
    loreForm
        .show(player)
        .then(response => {

            // We don't want to update the lore if the player backs out
            if (response.canceled) return

            // We don't want the section character
            const lore = response.formValues.slice(1) as string[]

            // Trim the lore
            const trimmedLore = trimArray(lore) as string[]
            
            setLoreAction(player, trimmedLore, player.selectedSlotIndex)
        })
        .catch((error) => {
            console.error("Error showing lore edit form: ", error)
        })
}

/**
 * Sets the item in the player's selected slot.
 * @param player The player.
 * @param item The new item.
 */
export function setItemInSelectedSlot(player: Player, item: ItemStack) {
    const selectedSlot = player.selectedSlotIndex
    const inventory = player.getComponent(EntityInventoryComponent.componentId).container

    inventory.setItem(selectedSlot, item)
}

export function editLore(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const selectedSlot = player.selectedSlotIndex
    const inventory = player.getComponent(EntityInventoryComponent.componentId).container
    const item = inventory.getItem(selectedSlot)

    showLoreEditingForm(player, item)
}