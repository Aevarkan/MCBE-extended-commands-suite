/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: utility.ts
 * Author: Aevarkan
 */

import { ItemStack, world } from "@minecraft/server"
import { RIGHT_CLICK_PREFIX_COMMAND, RIGHT_CLICK_PREFIX_FARMODE, RIGHT_CLICK_PREFIX_LORE } from "constants"

/**
 * Adds an entry into the command database.
 * @param item The item that will have the command.
 * @param command The command the item will run.
 * @param commandId The identifier for the command.
 * @param farMode If the command runs in farmode.
 */
export function addEntry(item: ItemStack, command: string, commandId: string, farmode: boolean) {
    const itemTypeId = item.typeId
    const selectedItemLore = item.getLore()
    const itemLoreString = selectedItemLore.join()

    const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${commandId}`
    const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${commandId}`
    const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${commandId}`

    world.setDynamicProperty(fullCommandId, command)
    world.setDynamicProperty(fullFarmodeId, farmode)
    world.setDynamicProperty(fullLoreId, itemLoreString)
}

/**
 * Checks if the item has any entries in the command database.
 * @param item The `ItemStack` to check.
 * @returns An array of command ids.
 */
export function getMatches(item: ItemStack): string[] {
    const itemTypeId = item.typeId
    const itemLore = item.getLore()
    const loreString = itemLore.join()
    const matchedCommandIds = [] as string[]
    
    const partialLorePrefix = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}`

    // Filtering
    const allIds = world.getDynamicPropertyIds()
    // The ones that start with the prefix
    const loreIds = allIds.filter(item => item.startsWith(partialLorePrefix))

    // Get the command id for each match
    loreIds.forEach(id => {
        const storedLoreString = world.getDynamicProperty(id)
        if (storedLoreString === loreString) {
            const commandId = id.slice(partialLorePrefix.length)
            matchedCommandIds.push(commandId)
        }
    })

    return matchedCommandIds
}

/**
 * Gets an entry from the command database.
 * @param item The item to get an entry for.
 * @param commandId The entry ID.
 * @returns An object with command information.
 */
export function getEntry(item: ItemStack, commandId: string): CommandInformation {
    const itemTypeId = item.typeId

    const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${commandId}`
    const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${commandId}`
    const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${commandId}`

    const command = world.getDynamicProperty(fullCommandId) as string
    const farMode = world.getDynamicProperty(fullFarmodeId) as boolean
    const lore = world.getDynamicProperty(fullLoreId) as string

    const commandInformation: CommandInformation = {
        command: command,
        farMode: farMode,
        lore: lore
    }

    return commandInformation
}

export interface CommandInformation {
    command: string,
    farMode: boolean,
    lore: string
}

/**
 * Removes an entry from the command databaase.
 * @param item The item to remove.
 * @param commandId The identifier.
 */
export function removeEntry(item: ItemStack, commandId: string) {
    const itemTypeId = item.typeId

    const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${commandId}`
    const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${commandId}`
    const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${commandId}`

    world.setDynamicProperty(fullCommandId, undefined)
    world.setDynamicProperty(fullFarmodeId, undefined)
    world.setDynamicProperty(fullLoreId, undefined)
}

/**
 * Removes all entries from the command database for an item.
 * @param item The `ItemStack`.
 */
export function removeAllEntries(item: ItemStack) {
    const matchingIds = getMatches(item)

    matchingIds.forEach(id => {
        removeEntry(item, id)
    })
}