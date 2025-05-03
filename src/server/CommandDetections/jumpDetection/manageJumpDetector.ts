/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageEmoteDetector.ts
 * Author: Aevarkan
 */

import { Entity, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { EntityCommandDatabase } from "classes/EntityCommandDatabase";
import { RemoveOptions } from "server/definitions";

/**
 * This makes a jump detector for the player.
 */
export function createJumpDetectorScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const parameters = event.message as string

    const parts = parameters.split(" ")
    const commandId = parts[0]
    const command = parts.slice(1).join(" ")

    createJumpDetector(player, commandId, command)
}

/**
 * This removes the entity's death detector.
 */
export function removeJumpDetectorScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const commandId = event.message

    if (commandId.length === 0) {
        removeJumpDetector(player, {removeAll: true})
    } else {
        removeJumpDetector(player, {removeAll: false, id: commandId})
    }
}

/**
 * Creates a jump detector for a player.
 * @param player The player that will run the command upon pressing .
 * @param entryId The identifier for the command.
 * @param command The command the entity will run when it dies.
 */
function createJumpDetector(player: Player, entryId: string, command: string) {
    const jumpDatabase = new EntityCommandDatabase(player)

    jumpDatabase.addJumpCommandEntry(command, entryId)
}

/**
 * @param player The player to remove the jump detector from.
 * @param removeOptions Arguments on how to remove the detector(s).
 */
function removeJumpDetector(player: Player, removeOptions: RemoveOptions) {

    const jumpDatabase = new EntityCommandDatabase(player)

    if (removeOptions.removeAll === true) {
        jumpDatabase.removeAllJumpCommandEntries()
    } else {
        jumpDatabase.removeJumpCommandEntry(removeOptions.id)
    }
}