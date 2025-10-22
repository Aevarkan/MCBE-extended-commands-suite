/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: schedule.ts
 * Author: Aevarkan
 */

import { Entity, EntityComponentTypes, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";

export function setHealthScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const healthValue = parseFloat(event.message)

    setHealth(entity, healthValue)
}

/**
 * Sets the health value of an entity
 * @param entity The entity.
 * @param healthValue The new HP value.
 */
function setHealth(entity: Entity, healthValue: number) {
    const healthComponent = entity.getComponent(EntityComponentTypes.Health)
    healthComponent.setCurrentValue(healthValue)
}