/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: Database.ts
 * Author: Aevarkan
 */

import { Entity } from "@minecraft/server"
import { DEATH_COMMAND_PREFIX } from "constants"

/**
 * Database handling, mostly for storing commands.
 */
class _Database {

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
}

export const Database = new _Database()