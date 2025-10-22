/**
 * This file is part of Areas which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: config.ts
 * Author: Aevarkan
 */

import { CommandPermissionLevel } from "@minecraft/server";

/**
 * Configuration settings.
 */
export default {
    /**
     * The tag to check if a player should have admin permissions according to Areas.
     * 
     * @remarks
     * Set this to undefined to not have a tag.
     * 
     * At the very minimum, either the `operatorTag` or `checkForOp` setting should be active.
     */
    operatorTag: "areas:admin",
    /**
     * Whether Areas should consider the Minecraft operator permission as an admin.
     * 
     * @remarks
     * At the very minimum, either the `operatorTag` or `checkForOp` setting should be active.
     */
    checkForOp: true,
    /**
     * The command permission level required to do commands.
     * @remarks Set this to `CommandPermissionLevel.Any` to let anyone run commands.
     */
    commandPermissionLevel: CommandPermissionLevel.GameDirectors,
    /**
     * @remarks
     * Whether or not cheats should be required to execute commands.
     */
    cheatsRequired: true,
    /**
     * @remarks
     * The prefix for custom commands. Leaving this empty can cause errors.
     */
    commandPrefix: "areas",
}