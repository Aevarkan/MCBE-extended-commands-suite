/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: schedule.ts
 * Author: Aevarkan
 */

import { Block, CustomCommandParamType, Entity, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { defineCommand, defineParameter } from "command-wrapper";
import { commandRegister } from "constants";

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
    const correctCommand = command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)

    scheduleCommandAction(source, correctCommand, delay) 
}

/**
 * 
 * @param source The source of the command.
 * @param command The command to be run.
 * @param delay How long in ticks before the command runs.
 */
function scheduleCommandAction(source: Entity, command: string, delay: number) {

    system.runTimeout(() => {
        system.run(() => {
            source.runCommand(command)
        })
    }, delay)

}

const commandParam = defineParameter({
    name: "command",
    type: CustomCommandParamType.String,
    mandatory: true
})

const timeParam = defineParameter({
    name: "timeTicks",
    type: CustomCommandParamType.Integer,
    mandatory: true
})

const entityParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})

const scheduleCustomCommand = defineCommand({
    name: "schedulecommand",
    description: "Schedules a command to run for selected entities after a number of ticks.",
    parameters: [entityParam, timeParam, commandParam],
    callbackFunction(_origin, entities, time, command) {
        entities.forEach(entity => {
            scheduleCommandAction(entity, command, time)
        })
    },
})

commandRegister.registerCommand(scheduleCustomCommand)
