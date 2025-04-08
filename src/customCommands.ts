/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: customCommands.ts
 * Author: Aevarkan
 */

import { CustomCommand, CustomCommandOrigin, CustomCommandResult, CustomCommandStatus, system, world } from "@minecraft/server";

const testCommand: CustomCommand = {
    name: "a",
    permissionLevel: 0,
    description: "HI"   
}

const testCommand2: CustomCommand = {
    name: "ecs:a2",
    permissionLevel: 0,
    description: "HI"
}

system.beforeEvents.startup.subscribe((event) => {
    const commandRegistry = event.customCommandRegistry
    commandRegistry.registerCommand(testCommand,
        (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
            // Your command logic here
            world.sendMessage("IT WORKED!")
            const type = origin.sourceType
            return { status: CustomCommandStatus.Success }
        }
    )

    commandRegistry.registerCommand(testCommand2,
        (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
            // Your command logic here
            world.sendMessage("IT WORKED 2!")
            const type = origin.sourceType
            return { status: CustomCommandStatus.Success }
        }
    )

})