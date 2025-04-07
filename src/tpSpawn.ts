// This file is part of Extended Commands Suite which is released under GPL-3.0.
// See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
// File: tpSpawn.ts
// Author: Aevarkan

import { Player, ScriptEventCommandMessageAfterEvent, TeleportOptions, Vector3 } from "@minecraft/server";

/**
 * 
 * Teleports a player to their spawn point. Like the magic mirror in Terraria.
 */
export function tpToSpawn(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player

    tpToSpawnAction(player)
}

/**
 * @param player The player who you want to teleport to their spawnpoint.
 * @summary
 * Teleports a player to their spawn point. Like the magic mirror in Terraria.
 */
function tpToSpawnAction(player: Player) {
    const spawnPoint = player.getSpawnPoint()
    
    const spawnLocation: Vector3 = {
        x: spawnPoint.x,
        y: spawnPoint.y,
        z: spawnPoint.z
    }

    const tpOptions: TeleportOptions = {
        dimension: spawnPoint.dimension
    }

    player.teleport(spawnLocation, tpOptions)
}