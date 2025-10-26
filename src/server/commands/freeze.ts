/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: freeze.ts
 * Author: Aevarkan
 */

import { CustomCommandOrigin, CustomCommandParamType, Entity, InputPermissionCategory, Player, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { defineCommand, defineParameter } from "command-wrapper";
import { commandRegister } from "constants";

export function freeze(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity as Entity
    const duration = parseInt(event.message) as number

    freezeEntity(entity, duration)
}

/**
 * 
 * @param entity The entity you want to freeze
 * @param ticks The number of ticks you want to freeze it for
 * @summary
 * This freezes an entity for a specified number of ticks.
 * @remark 
 * Use with caution on entities, it is very performance heavy.
 * @remark
 * For players, it has a minimal performance impact.
 */
function freezeEntity(entity: Entity, ticks: number) {

    if (entity instanceof Player) {

        // Disable player input
        const player = entity as Player
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false)
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false)
        system.runTimeout(() => {
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true)
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true)
        }, ticks)
    } else { 
        // Note that clear velocity doesn't work for players
        // Error: clearVelocity is not supported for players
        entity.clearVelocity()
        clearVelocityForTicks(entity, ticks)
    }
}

function clearVelocityForTicks(entity: Entity, ticks: number) {
    if (ticks <= 0) return // Ensure ticks is a positive number

    let remainingTicks = ticks;
    const intervalId = system.runInterval(() => {
        if (entity.isValid) {
            entity.clearVelocity()
        } else { // If the entity isn't valid anymore
            system.clearRun(intervalId)
        }

        remainingTicks--

        if (remainingTicks <= 0) {
            system.clearRun(intervalId) // Stop the interval when ticks are done
        }
    }, 1) // Run every tick
}

const entityParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})

const timeParam = defineParameter({
    name: "timeTicks",
    type: CustomCommandParamType.Integer,
    mandatory: true
})

function handleFreezeCommand(_origin: CustomCommandOrigin, entities: Entity[], time: number) {
    system.run(() => {
        entities.forEach(entity => {
            freezeEntity(entity, time)
        })
    })
}

const freezeCommand = defineCommand({
    name: "freeze",
    description: "Freezes selected entities for the specified number of ticks. Players will only have their camera locked.",
    parameters: [entityParam, timeParam],
    callbackFunction: handleFreezeCommand
})

commandRegister.registerCommand(freezeCommand)
