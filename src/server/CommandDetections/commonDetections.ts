/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: commonDetections.ts
 * Author: Aevarkan
 */

import { Entity } from "@minecraft/server"
import { EntityCommandDatabase, EntityCommandTypes } from "classes/EntityCommandDatabase"
import { RemoveOptions } from "types/misc"

/**
 * Creates a command detector for an entity.
 * @param detectorType The type of detection.
 * @param entity The entity that stores the command.
 * @param entryId The identifier for the command.
 * @param command The command to be run.
 */
export function createEntityDetector(detectorType: EntityCommandTypes, entity: Entity, entryId: string, command: string) {
    const entityDatabase = new EntityCommandDatabase(entity)

    entityDatabase.addEntry(detectorType, command, entryId)
}

/**
 * Removes a command detector from an entity.
 * @param detectorType The type of detection.
 * @param entity The player to remove the jump detector from.
 * @param removeOptions Arguments on how to remove the detector(s).
 */
export function removeEntityDetector(detectorType: EntityCommandTypes, entity: Entity, removeOptions: RemoveOptions) {

    const entityDatabase = new EntityCommandDatabase(entity)

    if (removeOptions.removeAll === true) {
        entityDatabase.removeAllEntries(detectorType)
    } else {
        entityDatabase.removeEntry(detectorType, removeOptions.id)
    }
}