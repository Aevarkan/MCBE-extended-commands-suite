/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: schedule.ts
 * Author: Aevarkan
 */

import { CustomCommandOrigin, CustomCommandParamType, Entity, EntityComponentTypes, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { defineCommand, defineParameter } from "command-wrapper";
import { commandRegister } from "constants";

export function setHealthScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const healthValue = parseFloat(event.message)

    if (!entity) return

    setHealth(entity, healthValue)
}

/**
 * Sets the health value of an entity
 * @param entity The entity.
 * @param healthValue The new HP value.
 */
function setHealth(entity: Entity, healthValue: number) {
    const healthComponent = entity.getComponent(EntityComponentTypes.Health)
    if (!healthComponent) return

    const minHealth = healthComponent.effectiveMin
    const maxHealth = healthComponent.effectiveMax
    const clampedValue = Math.min(Math.max(healthValue, minHealth), maxHealth)

    healthComponent.setCurrentValue(clampedValue)
}

const enumValues = ["set", "add", "reduce"] as const

const modeEnum = defineParameter({
    name: "healthSetMode",
    type: CustomCommandParamType.Enum,
    mandatory: true,
    values: enumValues
})

const entityParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})

const healthValue = defineParameter({
    name: "healthValue",
    type: CustomCommandParamType.Float,
    mandatory: true,
})

function handleHealthCommand(_origin: CustomCommandOrigin, targetEntity: Entity[], healthSetMode: string, healthSetValue: number) {
    targetEntity.forEach(entity => {
        const healthComponent = entity.getComponent(EntityComponentTypes.Health)
        // return false to indicate command failure, as there is no health component
        if (!healthComponent) return false

        const maxHealth = healthComponent.effectiveMax
        const minHealth = healthComponent.effectiveMin
        const currentHealth = healthComponent.currentValue
        system.run(() => {
            switch (healthSetMode) {
                case "set":
                    const clampedValue = Math.min(Math.max(healthSetValue, minHealth), maxHealth)
                    healthComponent.setCurrentValue(clampedValue)
                    break
    
                case "reduce":
                    const reducedClampedValue = Math.max(currentHealth - healthSetValue, minHealth)
                    healthComponent.setCurrentValue(reducedClampedValue)
                    break
    
                case "add":
                    const addClampedValue = Math.min(currentHealth + healthSetValue, maxHealth)
                    healthComponent.setCurrentValue(addClampedValue)
                    break
    
                default:
                    break
            }
        })
    })
}

const healthCustomCommand = defineCommand({
    callbackFunction: handleHealthCommand,
    name: "health",
    description: "Sets an entity's health according to parameters.",
    parameters: [entityParam, modeEnum, healthValue],
})

commandRegister.registerCommand(healthCustomCommand)
