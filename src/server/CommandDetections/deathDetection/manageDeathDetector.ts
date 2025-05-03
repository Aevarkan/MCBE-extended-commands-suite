/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageDeathDetector.ts
 * Author: Aevarkan
 */

import { Entity, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { EntityCommandTypes } from "classes/EntityCommandDatabase";
import { createEntityDetector, removeEntityDetector } from "../commonDetections";

/**
 * This makes a death detector for the entity.
 */
export function createDeathDetector(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const parameters = event.message as string

    const parts = parameters.split(" ")
    const commandId = parts[0]
    const command = parts.slice(1).join(" ")

    createEntityDetector(EntityCommandTypes.DeathCommand, entity, commandId, command)
}

/**
 * This removes the entity's death detector.
 */
export function removeDeathDetector(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const commandId = event.message

    if (commandId.length === 0) {
        removeEntityDetector(EntityCommandTypes.DeathCommand, entity, {removeAll: true})
    } else {
        removeEntityDetector(EntityCommandTypes.DeathCommand, entity, {removeAll: false, id: commandId})
    }
}