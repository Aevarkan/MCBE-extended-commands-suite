/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: chance.ts
 * Author: Aevarkan
 */

import { Entity, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";

export function chance(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const parameters = event.message

    // Split the message into command and chance
    const parts = parameters.split(" ")
    const percentageChance = parseInt(parts[0])
    const command = parts.slice().join(" ")

    // Executes the command
    chanceAction(entity, command, percentageChance)
}

/**
 * Makes the entity sometimes run a command.
 * @param entity The entity that runs the command.
 * @param command The command string.
 * @param percentageChance How likely the entity is to run the command.
 */
function chanceAction(entity: Entity, command: string, percentageChance: number) {
    
    // Number between 0 and 100
    const runChance = Math.random() * 100

    // Run the command if number is higher than given chance
    if (runChance < percentageChance) {
        system.run(() => {
            entity.runCommand(command)
        })
    }
}