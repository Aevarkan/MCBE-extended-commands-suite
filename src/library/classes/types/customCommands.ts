/**
 * This file is part of Areas which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: customCommands.ts
 * Author: Aevarkan
 */

import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParameter } from "@minecraft/server";

export interface CommandInfo {
    /**
     * The callback function the command should run.
     * @remarks This function should throw an error or return false to indicate command failure.
     * 
     * @remarks Callbacks happen in read-only mode.
     * 
     */
    callbackFunction: (origin: CustomCommandOrigin, ...args: any[]) => void | boolean
    /**
     * @remarks
     * Message displayed to chat after successful command execution.
     *
     */
    successMessage?: string
    /**
     * @remarks
     * Message displayed to chat after unsuccessful command execution.
     *
     */
    failureMessage?: string
    /**
     * @remarks
     * Whether or not cheats must be enabled to run the command.
     * 
     * Uses configuration setting if not specified.
     * 
     */
    cheatsRequired?: boolean
    /**
     * @remarks
     * The name of the command. The namespace will be added automatically.
     *
     */
    name: string
    /**
     * @remarks
     * Command description as seen on the command line.
     *
     */
    description: string
    /**
     * @remarks
     * The permission level required to execute the command.
     * 
     * Uses configuration setting if not specified.
     *
     */
    permissionLevel?: CommandPermissionLevel
    /**
     * @remarks
     * List of mandatory command parameters.
     *
     */
    mandatoryParameters?: CustomCommandParameter[]
    /**
     * @remarks
     * List of optional command parameters.
     *
     */
    optionalParameters?: CustomCommandParameter[]
}