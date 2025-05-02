/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageEmoteDetector.ts
 * Author: Aevarkan
 */

import { Entity, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { EntityCommandDatabase } from "classes/EntityCommandDatabase";
import { RemoveOptions } from "server/definitions";

/**
 * This makes an emote detector for the entity.
 */
export function createEmoteDetectorScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const parameters = event.message as string

    const parts = parameters.split(" ")
    const commandId = parts[0]
    const command = parts.slice(1).join(" ")

    createEmoteDetector(entity, commandId, command)
}

/**
 * This removes the entity's death detector.
 */
export function removeEmoteDetectorScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const commandId = event.message

    if (commandId.length === 0) {
        removeEmoteDetector(entity, {removeAll: true})
    } else {
        removeEmoteDetector(entity, {removeAll: false, id: commandId})
    }
}

/**
 * 
 * @param entity The entity that will run the command on death.
 * @param entryId The identifier for the command.
 * @param command The command the entity will run when it dies.
 */
function createEmoteDetector(entity: Entity, entryId: string, command: string) {
    const entityDatabase = new EntityCommandDatabase(entity)

    entityDatabase.addEmoteCommandEntry(command, entryId)
}

/**
 * @param entity The entity to remove the death detector.
 * @param removeOptions Arguments on how to remove the detector(s).
 */
function removeEmoteDetector(entity: Entity, removeOptions: RemoveOptions) {

    const entityDatabase = new EntityCommandDatabase(entity)

    if (removeOptions.removeAll === true) {
        entityDatabase.removeAllEmoteCommandEntries()
    } else {
        entityDatabase.removeEmoteCommandEntry(removeOptions.id)
    }
}