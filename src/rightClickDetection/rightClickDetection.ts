// This file is part of Extended Commands Suite which is released under GPL-3.0.
// See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
// File: rightClickDetection.ts
// Author: Aevarkan

import { ItemStack, ItemUseBeforeEvent, Player, system, world } from "@minecraft/server";

// This is the detector itself.
// Checks everytime a player uses an item if there is a command set on it.
// There isn't anything here that errors when an item is stackable
// You can add the command to the item manually if you know how, but the script API doesn't allow it.
// https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setdynamicproperty

world.beforeEvents.itemUse.subscribe((event: ItemUseBeforeEvent) => {
    const player = event.source as Player
    const item = event.itemStack as ItemStack
    const commandsEnabled = item.getDynamicProperty('isCommandItem') as boolean

    if (commandsEnabled) {
        const itemCommand = item.getDynamicProperty('command') as string
        // Must incase it in system.run to have permimssions
        system.run(() => {
            player.runCommand(itemCommand)
        })
    }

    // Stackable item uses QIDB
    // Get it to work later, it doesn't work currently
    if (item.isStackable) {
        // This may be bad for perfomance, but there should only be a few items here anyway
        // Broken for now
        // const commandPairs = getAllItemCommandPairs()
        // for (const pair of commandPairs) {
        //     if (item.isStackableWith(pair.itemStack)) {
        //         player.runCommandAsync(pair.commandOptions.command)
        //         // break
        //     }
        // }
    }

    // DEBUG
    // const allProperties = item.getDynamicPropertyIds() as string[]
    // console.log("[DEBUG] CMDLIB: Detected right click. Item command: ", allProperties, commandsEnabled)
})
