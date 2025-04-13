/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: chance.ts
 * Author: Aevarkan
 */

import { Dimension, Entity, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";

export function chance(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const block = event.sourceBlock
    const blockDimension = block.dimension
    const parameters = event.message

    // Split the message into command and chance
    const parts = parameters.split(" ")
    const percentageChance = parseInt(parts[0])
    const command = parts.slice(1).join(" ")

    // Executes the command
    if (entity) chanceActionEntity(entity, command, percentageChance)
    if (block) chanceActionBlock(blockDimension, command, percentageChance)
}

/**
 * Makes the world sometimes run a command.
 * @param block The block that called the command.
 * @param command The command string.
 * @param percentageChance How likely the world is to run the command.
 */
function chanceActionBlock(dimension: Dimension, command: string, percentageChance: number) {
    
    // Number between 0 and 100
    const runChance = Math.random() * 100

    // Run the command if number is higher than given chance
    if (runChance < percentageChance) {
        system.run(() => {
            dimension.runCommand(command)
        })
    }
}

/**
 * Makes the entity sometimes run a command.
 * @param entity The entity that runs the command.
 * @param command The command string.
 * @param percentageChance How likely the entity is to run the command.
 */
function chanceActionEntity(entity: Entity, command: string, percentageChance: number) {
    
    // Number between 0 and 100
    const runChance = Math.random() * 100

    // Run the command if number is higher than given chance
    if (runChance < percentageChance) {
        system.run(() => {
            entity.runCommand(command)
        })
    }
}