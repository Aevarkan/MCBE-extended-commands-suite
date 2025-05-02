/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: EntityCommandDatabase.ts
 * Author: Aevarkan
 */

import { Entity } from "@minecraft/server"
import { DEATH_COMMAND_PREFIX } from "constants"

/**
 * Stores commands for an entity.
 */
export class EntityCommandDatabase {

    entity: Entity

    /**
     * Creates a new database viewer for an entity.
     * @param entity
     */
    constructor(entity: Entity) {
        this.entity = entity
    }

    /**
     * Adds a death command entry to an entity.
     * @param command The command the entity will run once killed.
     * @param commandId The identifier for the command.
     */
    addDeathCommandEntry(command: string, commandId: string) {
        const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
    
        this.entity.setDynamicProperty(fullDeathCommandId, command)
    }

    /**
     * Removes an entity's death command.
     * @param commandId The identifier for the command.
     */
    removeDeathCommandEntry(commandId: string) {
        const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
    
        this.entity.setDynamicProperty(fullDeathCommandId, undefined)
    }

    removeAllDeathCommandEntries() {
        const allDeathCommandIds = this.getAllDeathCommandEntryIds()
    
        allDeathCommandIds.forEach(id => {
            this.removeDeathCommandEntry(id)
        })
    }

    /**
     * Gets all death command ids on an entity.
     * @returns A string array of ids, including the prefix.
     */
    getAllDeathCommandEntryIds() {
        const allKeys = this.entity.getDynamicPropertyIds()
        const allDeathCommandIds = allKeys.filter(item => item.startsWith(DEATH_COMMAND_PREFIX))
        return allDeathCommandIds
    }
    
    /**
     * Gets a death command for an entity.
     * @param deathCommandKey The identifier of the death command, including the prefix.
     * @returns The command string.
     */
    getDeathCommandEntry(deathCommandKey: string) {
        // const fullId = `${DEATH_COMMAND_PREFIX}${deathCommandKey}`
        const command = this.entity.getDynamicProperty(deathCommandKey) as string
        return command
    }
}
