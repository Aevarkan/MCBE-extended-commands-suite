/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: Database.ts
 * Author: Aevarkan
 */

import { Entity, ItemStack, world } from "@minecraft/server"
import { DEATH_COMMAND_PREFIX, RIGHT_CLICK_PREFIX_COMMAND, RIGHT_CLICK_PREFIX_FARMODE, RIGHT_CLICK_PREFIX_LORE, RIGHT_CLICK_SUFFIX_SEPARATOR } from "constants"
import { getDynamicLore, hasDynamicLore } from "server/lore/manageDynamicLore"
import { CommandInformation } from "types/misc"

/**
 * Database handling, purely for storing commands.
 */
class _Database {

    /**
     * ########################
     * #### DEATH COMMANDS ####
     * ########################
     */

    /**
     * Adds a death command entry to an entity.
     * @param entity The entity.
     * @param command The command the entity will run once killed.
     * @param commandId The identifier for the command.
     */
    addDeathCommandEntry(entity: Entity, command: string, commandId: string) {
        const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
    
        entity.setDynamicProperty(fullDeathCommandId, command)
    }

    /**
     * Removes an entity's death command.
     * @param entity The entity.
     * @param commandId The identifier for the command.
     */
    removeDeathCommandEntry(entity: Entity, commandId: string) {
        const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
    
        entity.setDynamicProperty(fullDeathCommandId, undefined)
    }

    removeAllDeathCommandEntries(entity: Entity) {
        const allDeathCommandIds = Database.getAllDeathCommandEntryIds(entity)
    
        allDeathCommandIds.forEach(id => {
            Database.removeDeathCommandEntry(entity, id)
        })
    }

    /**
     * Gets all death command ids on an entity.
     * @param entity The entity.
     * @returns A string array of ids, including the prefix.
     */
    getAllDeathCommandEntryIds(entity: Entity) {
        const allKeys = entity.getDynamicPropertyIds()
        const allDeathCommandIds = allKeys.filter(item => item.startsWith(DEATH_COMMAND_PREFIX))
        return allDeathCommandIds
    }
    
    /**
     * Gets a death command for an entity.
     * @param entity The entity.
     * @param deathCommandKey The identifier of the death command, including the prefix.
     * @returns The command string.
     */
    getDeathCommandEntry(entity: Entity, deathCommandKey: string) {
        // const fullId = `${DEATH_COMMAND_PREFIX}${deathCommandKey}`
        const command = entity.getDynamicProperty(deathCommandKey) as string
        return command
    }

    /**
     * #######################
     * #### ITEM COMMANDS ####
     * #######################
     */


    /**
     * Adds an entry into the command database.
     * @param item The item that will have the command.
     * @param command The command the item will run.
     * @param commandId The identifier for the command.
     * @param farMode If the command runs in farmode.
     */
    addItemCommandEntry(item: ItemStack, command: string, commandId: string, farmode: boolean) {
        const itemTypeId = item.typeId
        const selectedItemLore = item.getLore()
        let itemLoreString = selectedItemLore.join() // This is a let because we want to check for dynamic lore
        
        const isDynamic = hasDynamicLore(item)
        if (isDynamic) {
            itemLoreString = getDynamicLore(item).join()
            // console.log("Detected dynamic lore!")
        }

        const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`

        world.setDynamicProperty(fullCommandId, command)
        world.setDynamicProperty(fullFarmodeId, farmode)
        world.setDynamicProperty(fullLoreId, itemLoreString)

        // console.log("Lore stored as ", itemLoreString)
    }

    /**
     * Checks if the item has any entries in the command database.
     * @param item The `ItemStack` to check.
     * @returns An array of command ids.
     */
    getItemCommandMatches(item: ItemStack): string[] {
        const itemTypeId = item.typeId
        const itemLore = item.getLore()
        const loreString = itemLore.join()
        const matchedCommandIds = [] as string[]
        const dynamicLoreString = getDynamicLore(item).join()
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
     * @param item The item to get an entry for.
     * @param commandId The entry ID.
     * @returns An object with command information.
     */
    getItemCommandEntry(item: ItemStack, commandId: string): CommandInformation {
        const itemTypeId = item.typeId

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
     * @param item The item to remove.
     * @param commandId The identifier.
     */
    removeItemCommandEntry(item: ItemStack, commandId: string) {
        const itemTypeId = item.typeId

        const fullCommandId = `${RIGHT_CLICK_PREFIX_COMMAND}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullFarmodeId = `${RIGHT_CLICK_PREFIX_FARMODE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`
        const fullLoreId = `${RIGHT_CLICK_PREFIX_LORE}${itemTypeId}${RIGHT_CLICK_SUFFIX_SEPARATOR}${commandId}`

        world.setDynamicProperty(fullCommandId, undefined)
        world.setDynamicProperty(fullFarmodeId, undefined)
        world.setDynamicProperty(fullLoreId, undefined)
    }

    /**
     * Removes all entries from the command database for an item.
     * @param item The `ItemStack`.
     */
    removeAllItemCommandEntries(item: ItemStack) {
        const matchingIds = Database.getItemCommandMatches(item)

        matchingIds.forEach(id => {
            Database.removeItemCommandEntry(item, id)
        })
    }
}

export const Database = new _Database()