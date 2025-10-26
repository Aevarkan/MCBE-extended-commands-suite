/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: tpSpawn.ts
 * Author: Aevarkan
 */

import { CustomCommandParamType, DimensionLocation, Player, ScriptEventCommandMessageAfterEvent, system, TeleportOptions, Vector3, world } from "@minecraft/server";
import { defineCommand, defineParameter } from "command-wrapper";
import { commandRegister } from "constants";

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
    const worldSpawn = world.getDefaultSpawnLocation()
    // TODO: cache this
    const overworld = world.getDimension("minecraft:overworld")
    const topSpawnBlock = overworld.getTopmostBlock({ x: worldSpawn.x, z: worldSpawn.z })
    
    let teleportLocation: DimensionLocation

    if (spawnPoint) {
        teleportLocation = spawnPoint
    } else if (topSpawnBlock) {
        teleportLocation = {
            ...topSpawnBlock.location,
            dimension: topSpawnBlock.dimension
        }
    } else {
        teleportLocation = {
            x: worldSpawn.x,
            y: overworld.heightRange.max,
            z: worldSpawn.z,
            dimension: overworld
        }
    }

    const spawnLocation: Vector3 = {
        x: teleportLocation.x,
        y: teleportLocation.y,
        z: teleportLocation.z
    }

    const tpOptions: TeleportOptions = {
        dimension: teleportLocation.dimension
    }

    player.teleport(spawnLocation, tpOptions)
}

const playerParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.PlayerSelector,
    mandatory: false
})

const tpSpawnCommand = defineCommand({
    name: "tpspawn",
    description: "Teleports the player(s) to back to their spawn location. Defaults to world spawn if not found.",
    parameters: [playerParam],
    callbackFunction(origin, players?) {
        const callerEntity = origin.sourceEntity

        if (players) {
            system.run(() => {
                players.forEach(player => {
                    tpToSpawnAction(player)
                })
            })
        } else if (callerEntity instanceof Player) {
            system.run(() => {
                tpToSpawnAction(callerEntity)
            })
        } else {
            return false
        }
    },
})

commandRegister.registerCommand(tpSpawnCommand)
