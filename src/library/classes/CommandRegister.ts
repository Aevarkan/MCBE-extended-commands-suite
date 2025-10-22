/**
 * This file is part of Areas which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: CommandRegister.ts
 * Author: Aevarkan
 */

import { CustomCommand, CustomCommandOrigin, CustomCommandResult, CustomCommandStatus, system } from "@minecraft/server";
import { CommandInfo } from "./types/customCommands";
import config from "config";

export class CommandRegister {

    private static commandsToRegister: CommandInfo[] = []

    /**
     * Register a new command.
     * @param commandInfo The command info object.
     */
    public static registerCommand(commandInfo: CommandInfo) {

        this.commandsToRegister.push(commandInfo)
    }

    // public static getCommands() {
    //     return this.commandsToRegister
    // }


    /**
     * Registers all custom commands.
     * 
     * @internal
     * This should only be run in main after all commands are registered.
     */
    public static _registerCommands() {
        system.beforeEvents.startup.subscribe(event => {
            const commandRegistry = event.customCommandRegistry

            // Register each command put in the register
            this.commandsToRegister.forEach(command => {

                const namespacedName = config.commandPrefix + ":" + command.name

                const permissionLevel = command.permissionLevel ?? config.commandPermissionLevel
                const cheatsRequired = command.cheatsRequired ?? config.cheatsRequired

                const customCommand: CustomCommand = {
                    name: namespacedName,
                    description: command.description,
                    permissionLevel: permissionLevel,
                    cheatsRequired: cheatsRequired,
                    mandatoryParameters: command.mandatoryParameters,
                    optionalParameters: command.optionalParameters
                }

                function callbackWrapper(origin: CustomCommandOrigin, ...args: any[]): CustomCommandResult {
                    try {
                        const result = command.callbackFunction(origin, ...args)

                        // If the command returns false, then it's also a failure (instead of throwing an error)
                        if (result === false) {
                            return { message: command.failureMessage, status: CustomCommandStatus.Failure }
                        } else {
                            return { message: command.successMessage, status: CustomCommandStatus.Success }
                        }
                    } catch (error) {
                        return { message: command.failureMessage, status: CustomCommandStatus.Failure }
                    }
                }

                commandRegistry.registerCommand(customCommand, callbackWrapper)
            })
            
        })
    }

}
