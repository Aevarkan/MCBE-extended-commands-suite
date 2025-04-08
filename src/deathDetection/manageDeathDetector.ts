/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: manageDeathDetection.ts
 * Author: Aevarkan
 */

import { Entity, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";

/**
 * This makes a death detector for the entity.
 */
export function createDeathDetector(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const command = event.message as string

    createDeathDetectorAction(entity, command)
}

/**
 * This removes the entity's death detector.
 */
export function removeDeathDetector(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity

    removeDeathDetectorAction(entity)
}

/**
 * 
 * @param entity The entity that will run the command on death.
 * @param command The command the entity will run when it dies.
 */
function createDeathDetectorAction(entity: Entity, command: string) {
    entity.setDynamicProperty("enabledDeathDetector", true)
    entity.setDynamicProperty("onDeathCommand", command)
}

/**
 * 
 * @param entity The entity to remove the death detector.
 */
function removeDeathDetectorAction(entity: Entity) {
    entity.setDynamicProperty("enabledDeathDetector", false)
    entity.setDynamicProperty("onDeathCommand", undefined)
}