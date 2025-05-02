/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: rightClickDetectionv2.ts
 * Author: Aevarkan
 */

import { BlockRaycastOptions, DimensionLocation, ItemStack, ItemUseBeforeEvent, LocationInUnloadedChunkError, LocationOutOfWorldBoundariesError, Player, system, Vector3, world } from "@minecraft/server";
import { Database } from "classes/Database";
import { COMMAND_ERROR_SOUND, FARMODE_GOES_THROUGH_LIQUIDS, MAX_RAYCAST_BLOCK_DISTANCE } from "constants";
import { CommandInformation } from "types/misc";

world.beforeEvents.itemUse.subscribe((event: ItemUseBeforeEvent) => {
    const player = event.source as Player
    const item = event.itemStack as ItemStack

    const matchedIds = Database.getItemCommandMatches(item)

    // console.info("Detected right click")

    // Only continue if we have matches
    // This still matches deleted keys (set to undefined)
    // So we add another check later to stop errors
    if (matchedIds.length === 0) return

    // console.info("Found matches.")

    const commandPackets = [] as CommandInformation[]

    matchedIds.forEach(id => {
        const entryinfo = Database.getItemCommandEntry(item, id)
        commandPackets.push(entryinfo)
    })

    commandPackets.forEach(packet => {

        // Seems to be an error when removing commands, this stops it
        if (!packet.command) return

        // For some reason, the selectors resolve immediately
        // e.g. You put /sciptevent cmd:test @s
        // @s will be the player's name, and it won't work
        // We use capital letter instead 
        const correctCommand = packet.command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)
        
        if (packet.farMode) {
            system.run(() => {
                // Max distance error
                try {
                    const targetBlock = getBlockFromRaycast(player, FARMODE_GOES_THROUGH_LIQUIDS)

                    if (!targetBlock) {
                        throw new Error("Block out of range.")
                    }
                
                    const topBlockLocation: DimensionLocation = {
                        x: targetBlock.x,
                        y: targetBlock.y + 1, // Add 1 to not have the command done inside the block
                        z: targetBlock.z,
                        dimension: targetBlock.dimension
                    }
        
                    // console.log("In farmode!", correctCommand, targetBlock.x, targetBlock.y, targetBlock.z)
        
                    doOffsetCommand(correctCommand, player, topBlockLocation)
                } catch (error) {
                    if (error instanceof LocationInUnloadedChunkError) {
                        player.sendMessage({translate: "ecs.command.error.outside_ticking_range"})
                        player.playSound(COMMAND_ERROR_SOUND)
                    } else if (error instanceof LocationOutOfWorldBoundariesError) {
                        player.sendMessage({translate: "ecs.command.error.outside_world_boundary"})
                        player.playSound(COMMAND_ERROR_SOUND)
                    }
                    else {
                        player.sendMessage({translate: "ecs.command.error.too_far"})
                        player.playSound(COMMAND_ERROR_SOUND)
                    }
                }
            })

        } else {

            // console.log("In regular mode!", correctCommand)

            system.run(() => {
                player.runCommand(correctCommand)
            })
        }
    })

})

/**
 * Gets the block that the player is looking at.
 * @param player The player.
 * @param includeLiquidBlocks To pass through blocks like water.
 * @returns A block.
 */
export function getBlockFromRaycast(player: Player, includeLiquidBlocks: boolean) {

    // Make this into an option later
    // No we have to do it now
    const raycastOptions: BlockRaycastOptions = {
        includeLiquidBlocks: includeLiquidBlocks,
        maxDistance: MAX_RAYCAST_BLOCK_DISTANCE
    }

    const raycastHit = player.getBlockFromViewDirection(raycastOptions)
    return raycastHit.block
}

/**
 * Does an offset command for an player. (i.e. execute as @s, but at a location)
 * @param command The command string.
 * @param sourcePlayer The player that is executing the command.
 * @param location Where the command should be run.
 */
export function doOffsetCommand(command: string, sourcePlayer: Player, location: DimensionLocation) {
    const commandLocation: Vector3 = {
        y: location.y,
        x: location.x,
        z: location.z
    }
    const commandDimension = location.dimension

    // Create a dummy and have it run the command, but execute can have the player run it.
    // This doesn't work on entities because you can't do /execute as on them
    try {
        const dummyEntity = commandDimension.spawnEntity("ecs:dummy", commandLocation)
        // dummyEntity.runCommand(`execute as ${playerName} at @s run ${command}`)
        dummyEntity.runCommand(command)
        dummyEntity.remove()
    } catch (error) {
        throw error
    }
}