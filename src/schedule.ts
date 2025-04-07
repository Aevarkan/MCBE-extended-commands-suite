// This file is part of Extended Commands Suite which is released under GPL-3.0.
// See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
// File: schedule.ts
// Author: Aevarkan

import { Entity, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";

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
 * @param entity The entity which you want to queue the command for.
 * @param command The command the entity should run.
 * @param delay How long in ticks before the command runs.
 */
function scheduleCommandAction(entity: Entity, command: string, delay: number) {

    // Schedule the command to run
    system.runTimeout(() => {
        // Using runCommandAsync bypasses permission check
        entity.runCommandAsync(command)
    }, delay)
}