/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: smite.ts
 * Author: Aevarkan
 */

import { DimensionLocation, LocationInUnloadedChunkError, LocationOutOfWorldBoundariesError, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server"
import { COMMAND_ERROR_SOUND, SMITE_COMMAND } from "constants"
import { doOffsetCommand, getBlockFromRaycast } from "server/CommandDetections/rightClickDetection/rightClickDetectionv2"

export function smite(event:ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player

    smiteAction(player)

    // Add target selectors when custom commands are added, scriptevent message can't get a player
}

/**
 * Smites the block the player is looking at.
 * @param player The player.
 */
function smiteAction(player: Player) {
    try {
        const targetBlock = getBlockFromRaycast(player, false)

        if (!targetBlock) {
            throw new Error("Block out of range.")
        }

        const topBlockLocation: DimensionLocation = {
            x: targetBlock.x,
            y: targetBlock.y + 1, // Add 1 to not have the command done inside the block
            z: targetBlock.z,
            dimension: targetBlock.dimension
        }

        doOffsetCommand(SMITE_COMMAND, player, topBlockLocation)
    } catch (error) {
        if (error instanceof LocationInUnloadedChunkError) {
            player.sendMessage({translate: "ecs.command.error.outside_ticking_range"})
            player.playSound(COMMAND_ERROR_SOUND)
        } else if (error instanceof LocationOutOfWorldBoundariesError) {
            player.sendMessage({translate: "ecs.command.error.outside_world_boundary"})
            player.playSound(COMMAND_ERROR_SOUND)
        } else {
            player.sendMessage({translate: "ecs.command.error.too_far"})
            player.playSound(COMMAND_ERROR_SOUND)
        }
    }
}