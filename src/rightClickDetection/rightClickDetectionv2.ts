/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: rightClickDetectionv2.ts
 * Author: Aevarkan
 */

import { ItemStack, ItemUseBeforeEvent, Player, system, world } from "@minecraft/server";
import { CommandInformation, getEntry, getMatches } from "./utility";

world.beforeEvents.itemUse.subscribe((event: ItemUseBeforeEvent) => {
    const player = event.source as Player
    const item = event.itemStack as ItemStack

    const matchedIds = getMatches(item)

    // console.info("Detected right click")

    // Only continue if we have matches
    // This still matches deleted keys (set to undefined)
    // So we add another check later to stop errors
    if (matchedIds.length === 0) return

    // console.info("Found matches.")

    const commandPackets = [] as CommandInformation[]

    matchedIds.forEach(id => {
        const entryinfo = getEntry(item, id)
        commandPackets.push(entryinfo)
    })

    commandPackets.forEach(packet => {

        // Seems to be an error when removing commands, this stops it
        if (!packet.command) return

        // For some reason, the selectors resolve immediately
        // e.g. You put /sciptevent cmd:test @s
        // @s will be the player's name, and it won't work
        // We use capital letter instead 
        const correctCommand = packet.command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`);
        
        system.run(() => {
            player.runCommand(correctCommand)
        })

        // Implement this later
        if (packet.farMode) {

        }
    })

})
