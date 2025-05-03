/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageInteractDetector.ts
 * Author: Aevarkan
 */

import { Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { EntityCommandTypes } from "classes/EntityCommandDatabase";
import { createEntityDetector, removeEntityDetector } from "../commonDetections";

/**
 * This makes an interaction detector for the entity.
 */
export function createInteractDetectorScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const parameters = event.message as string

    const parts = parameters.split(" ")
    const commandId = parts[0]
    const command = parts.slice(1).join(" ")

    createEntityDetector(EntityCommandTypes.InteractCommand, player, commandId, command)
}

/**
 * This removes the entity's interaction detector.
 */
export function removeInteractDetectorScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const commandId = event.message

    if (commandId.length === 0) {
        removeEntityDetector(EntityCommandTypes.InteractCommand, player, {removeAll: true})
    } else {
        removeEntityDetector(EntityCommandTypes.InteractCommand, player, {removeAll: false, id: commandId})
    }
}