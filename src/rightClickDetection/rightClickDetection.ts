/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: rightClickDetection.ts
 * Author: Aevarkan
 */

import { ItemStack, ItemUseBeforeEvent, Player, system, world } from "@minecraft/server";

// Left here for compatibility

world.beforeEvents.itemUse.subscribe((event: ItemUseBeforeEvent) => {
    const player = event.source as Player
    const item = event.itemStack as ItemStack
    const commandsEnabled = item.getDynamicProperty('isCommandItem') as boolean

    if (commandsEnabled) {
        const itemCommand = item.getDynamicProperty('command') as string

        // Seems to be an error when removing commands, this stops it
        if (!itemCommand) return

        // Must incase it in system.run to have permimssions
        system.run(() => {
            player.runCommand(itemCommand)
        })
    }
})
