/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: utility.ts
 * Author: Aevarkan
 */

import { Entity } from "@minecraft/server"
import { DEATH_COMMAND_PREFIX } from "constants"

/**
 * Adds a death command entry to an entity.
 * @param entity The entity.
 * @param command The command the entity will run once killed.
 * @param commandId The identifier for the command.
 */
export function addDeathCommandEntry(entity: Entity, command: string, commandId: string) {
    const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`

    entity.setDynamicProperty(fullDeathCommandId, command)
}

/**
 * Removes an entity's death command.
 * @param entity The entity.
 * @param commandId The identifier for the command.
 */
export function removeDeathCommandEntry(entity: Entity, commandId: string) {
    const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`

    entity.setDynamicProperty(fullDeathCommandId, undefined)
}

export function removeAllDeathCommandEntries(entity: Entity) {
    const allDeathCommandIds = getAllDeathCommandEntryIds(entity)

    allDeathCommandIds.forEach(id => {
        removeDeathCommandEntry(entity, id)
    })
}

/**
 * Gets all death command ids on an entity.
 * @param entity The entity.
 * @returns A string array of ids, including the prefix.
 */
export function getAllDeathCommandEntryIds(entity: Entity) {
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
export function getDeathCommandEntry(entity: Entity, deathCommandKey: string) {
    // const fullId = `${DEATH_COMMAND_PREFIX}${deathCommandKey}`
    const command = entity.getDynamicProperty(deathCommandKey) as string
    return command
}

/**
 * Whether to remove all entries or just one.
 * If removing just one, the id is required.
 */
type RemoveOptions =
  | { removeAll: true }
  | { removeAll: false; id: string }
