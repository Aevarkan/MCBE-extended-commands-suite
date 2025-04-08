/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: multiCommand.ts
 * Author: Aevarkan
 */

import { ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";

export function multiCommand(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const parameters = event.message

    // Split the message into each command
    const commnandArray = parameters.split('|')
    
    // Run all the commands
    commnandArray.forEach(command => {
        // Must incase .runCommand() in system.run to have permissons
        system.run(() => {
            entity.runCommand(command)
        })
    })
}