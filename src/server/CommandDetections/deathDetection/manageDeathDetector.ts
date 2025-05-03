/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageDeathDetector.ts
 * Author: Aevarkan
 */

import { Entity, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { EntityCommandDatabase, EntityCommandTypes } from "classes/EntityCommandDatabase";
import { RemoveOptions } from "definitions";

/**
 * This makes a death detector for the entity.
 */
export function createDeathDetector(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const parameters = event.message as string

    const parts = parameters.split(" ")
    const commandId = parts[0]
    const command = parts.slice(1).join(" ")

    createDeathDetectorAction(entity, commandId, command)
}

/**
 * This removes the entity's death detector.
 */
export function removeDeathDetector(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const commandId = event.message

    if (commandId.length === 0) {
        removeDeathDetectorAction(entity, {removeAll: true})
    } else {
        removeDeathDetectorAction(entity, {removeAll: false, id: commandId})
    }
}

/**
 * 
 * @param entity The entity that will run the command on death.
 * @param entryId The identifier for the command.
 * @param command The command the entity will run when it dies.
 */
function createDeathDetectorAction(entity: Entity, entryId: string, command: string) {
    const entityDatabase = new EntityCommandDatabase(entity)

    entityDatabase.addEntry(EntityCommandTypes.DeathCommand, command, entryId)
}

/**
 * @param entity The entity to remove the death detector.
 * @param removeOptions Arguments on how to remove the detector(s).
 */
function removeDeathDetectorAction(entity: Entity, removeOptions: RemoveOptions) {

    const entityDatabase = new EntityCommandDatabase(entity)

    if (removeOptions.removeAll === true) {
        // Old way for compatibility
        entity.setDynamicProperty("enabledDeathDetector", false)
        entity.setDynamicProperty("onDeathCommand", undefined)
        
        entityDatabase.removeAllEntries(EntityCommandTypes.DeathCommand)
    } else {
        entityDatabase.removeEntry(EntityCommandTypes.DeathCommand, removeOptions.id)
    }
}