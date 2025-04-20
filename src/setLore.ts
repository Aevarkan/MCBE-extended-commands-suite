/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: setLore.ts
 * Author: Aevarkan
 */

import { EntityInventoryComponent, ItemStack, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

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

    inventory.setItem(slotIndex, updatedItem)
}

/**
 * Retrieves the lore string from the item at the specified line.
 * @param item The item that contains the lore.
 * @param lineIndex The line of lore to get, starts from 0.
 */
function getLorePart(item: ItemStack, lineIndex: number) {
    const loreArray = item.getLore()
    
    let lore = loreArray[lineIndex]
    if (!lore) { lore = "" }

    return lore
}

/**
 * Sets the lore string of an item at the specified line.
 * @param item The item to set the lore on.
 * @param lore The lore line to set.
 * @param lineIndex The lore line to change, starting from 0.
 * @returns The `itemStack` with the updated lore.
 * @remarks `lore` can only be up to 50 characters.
 */
function setLorePart(item: ItemStack, lore: string, lineIndex: number): ItemStack {
    
    const loreArray = item.getLore()

    // Adds elements to the array if not enough and swaps out the line.
    while (loreArray.length <= lineIndex) { loreArray.push("") }
    const truncatedLore = lore.substring(0, 50)
    loreArray[lineIndex] = truncatedLore

    // Sets the lore
    item.setLore(loreArray)
    return item
}

/**
 * Shows a form to the player for editing item lore.
 * @param player The player to show the form to.
 * @param item The item to edit the lore of.
 */
function showLoreEditingForm(player: Player, item: ItemStack) {
    const loreForm = new ModalFormData().title({translate: "ecs.command.lore.editing", with: { text: item.typeId }})

    loreForm.submitButton({translate: "ecs.command.lore.submit"})

    // Just for you to copy
    loreForm.textField({translate: "ecs.command.lore.section_character"}, "§", "§")

    // All 20 lore lines
    for (let i = 0; i < 20; i++) {
        const currentLine = i + 1
        const currentLineString = currentLine.toString()
        loreForm.textField({translate: "ecs.command.lore.line_number", with: { text: currentLineString }}, { translate: "ecs.command.lore.maximum_50_characters" }, getLorePart(item, i))
    }
    
    loreForm
        .show(player)
        .then(response => {

            // We don't want to update the lore if the player backs out
            if (response.canceled) return

            const lore = response.formValues as string[]

            // I know the loop is inefficient, but I want to use the function I made ;)
            // It shouldn't really affect performance that much anyway
            for (let i = 1; i <= 20; i++) {
                if (lore[i]) {
                    // Take 1 from i because of that section character
                    item = setLorePart(item, lore[i], i-1)
                }
            }

            setItemInSelectedSlot(player, item)
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
function setItemInSelectedSlot(player: Player, item: ItemStack) {
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