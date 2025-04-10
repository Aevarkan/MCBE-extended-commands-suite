/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: size.ts
 * Author: Aevarkan
 */

import { Entity, EntityScaleComponent, ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server";

export function setScale(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const scaleMultiplierString = event.message

    const scaleMultiplier = parseFloat(scaleMultiplierString)
    
    setSize(entity, scaleMultiplier)
}

/**
 * Sets the size of an entity.
 * @param entity The entity to change.
 * @param sizeMultiplier How big the entity should be.
 * @remarks The exact number for each entity varies.
 */
function setSize(entity: Entity, sizeMultiplier: number) {
    const scaleComponent = entity.getComponent(EntityScaleComponent.componentId)

    // Not every entity has a scale component
    if (!scaleComponent) {
        console.info("[ECS]: ", entity.typeId, " doesn't have a scale component.")
        return
    }

    // Dynamic property is because the scale resets
    entity.setDynamicProperty("scale", sizeMultiplier)
    scaleComponent.value = sizeMultiplier
}

// This makes sure the entities keep their scale
world.afterEvents.entityLoad.subscribe((event) => {
    const entity = event.entity
    const entityScale = entity.getDynamicProperty("scale") as number
    
    if (!entityScale) return

    const scaleComponent = entity.getComponent(EntityScaleComponent.componentId)
    scaleComponent.value = entityScale
})