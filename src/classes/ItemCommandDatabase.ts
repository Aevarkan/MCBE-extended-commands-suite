/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: ItemCommandDatabase.ts
 * Author: Aevarkan
 */

import { ItemStack, world } from "@minecraft/server"
import { RIGHT_CLICK_PREFIX_COMMAND, RIGHT_CLICK_PREFIX_FARMODE, RIGHT_CLICK_PREFIX_LORE, RIGHT_CLICK_SUFFIX_SEPARATOR } from "constants"
import { CommandInformation } from "definitions"
import { getDynamicLore, hasDynamicLore } from "server/lore/manageDynamicLore"

/**
 * Database handling for item commands.
 */
export class ItemCommandDatabase {

    readonly itemStack: ItemStack

    /**
     * Creates a new database viewer for an {@link ItemStack}.
     * @param entity
     */
    constructor(itemStack: ItemStack) {
        this.itemStack = itemStack
    }

    /**
     * Adds an entry into the item command database.
     * @param command The command the item will run.
     * @param commandId The identifier for the command.
     * @param farMode If the command runs in farmode.
     */
    addItemCommandEntry(command: string, commandId: string, farmode: boolean) {
        const correctCommand = command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)
        const itemTypeId = this.itemStack.typeId
        const selectedItemLore = this.itemStack.getLore()
        let itemLoreString = selectedItemLore.join() // This is a let because we want to check for dynamic lore
        
        const isDynamic = hasDynamicLore(this.itemStack)
        if (isDynamic) {
            itemLoreString = getDynamicLore(this.itemStack).join()
            // console.log("Detected dynamic lore!")
        }

        const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`

        world.setDynamicProperty(fullCommandId, correctCommand)
        world.setDynamicProperty(fullFarmodeId, farmode)
        world.setDynamicProperty(fullLoreId, itemLoreString)

        // console.log("Lore stored as ", itemLoreString)
    }

    /**
     * Checks if an itemStack has any entries in the command database.
     * @returns An array of command ids.
     */
    getItemCommandMatches(): string[] {
        const itemTypeId = this.itemStack.typeId
        const itemLore = this.itemStack.getLore()
        const loreString = itemLore.join()
        const matchedCommandIds = [] as string[]
        const dynamicLoreString = getDynamicLore(this.itemStack).join()
        const partialLorePrefix = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}`

        // console.log("Dynamic lore is: ", dynamicLoreString)

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

            // We also need to match dynamic lore
            else if (storedLoreString === dynamicLoreString) {
                const commandId = id.slice(partialLorePrefix.length)
                matchedCommandIds.push(commandId)
            }
        })

        return matchedCommandIds
    }


    /**
     * Gets an entry from the command database.
     * @param commandId The entry ID.
     * @returns An object with command information.
     */
    getItemCommandEntry(commandId: string): CommandInformation {
        const itemTypeId = this.itemStack.typeId

        const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`

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


    /**
     * Removes an entry from the command databaase.
     * @param commandId The identifier.
     */
    removeItemCommandEntry(commandId: string) {
        const itemTypeId = this.itemStack.typeId

        const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`

        world.setDynamicProperty(fullCommandId, undefined)
        world.setDynamicProperty(fullFarmodeId, undefined)
        world.setDynamicProperty(fullLoreId, undefined)
    }

    /**
     * Removes all entries from the command database for an item.
     */
    removeAllItemCommandEntries() {
        const matchingIds = this.getItemCommandMatches()

        matchingIds.forEach(id => {
            this.removeItemCommandEntry(id)
        })
    }
}