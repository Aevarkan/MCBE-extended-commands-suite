/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: interactDetection.ts
 * Author: Aevarkan
 */

import { system, world } from "@minecraft/server";
import { EntityCommandDatabase, EntityCommandTypes } from "classes/EntityCommandDatabase";

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
    const player = event.player
    const hitEntity = event.target
    const hitEntityDatabase = new EntityCommandDatabase(hitEntity)

    const commandIds = hitEntityDatabase.getAllEntryIds(EntityCommandTypes.InteractCommand)

    // Only proceed if there are actually commands to run
    if (commandIds.length === 0) return

    commandIds.forEach(id => {
        const command = hitEntityDatabase.getEntry(id)

        system.run(() => {
            player.runCommand(command)
        })
    })
})