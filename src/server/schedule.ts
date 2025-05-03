/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: schedule.ts
 * Author: Aevarkan
 */

import { Block, Entity, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";

/**
 * 
 * This schedules a command for the entity to do later.
 * Pretty much just Java edition's /schedule.
 */
export function scheduleCommand(event: ScriptEventCommandMessageAfterEvent) {
    const source = event.sourceEntity as Entity
    const parameters = event.message as string

    // Split the message into parts by space
    const parts = parameters.split(' ')

    // The parts
    const delay = parseInt(parts[0])
    const command = parts.slice(1).join(' ')

    scheduleCommandAction(source, command, delay) 
}

/**
 * 
 * @param source The source of the command.
 * @param command The command to be run.
 * @param delay How long in ticks before the command runs.
 */
function scheduleCommandAction(source: Entity | Block, command: string, delay: number) {

    // Blocks cannot run commands
    if (source instanceof Entity) {
        const entity = source as Entity
        system.runTimeout(() => {
            system.run(() => {
                entity.runCommand(command)
            })
        }, delay)
    } else {
        const dimension = source.dimension
        system.run(() => {
            dimension.runCommand(command)
        })
    }
    

}