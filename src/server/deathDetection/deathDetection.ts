/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: deathDetection.ts
 * Author: Aevarkan
 */

import { system, world } from "@minecraft/server";
import { getAllDeathCommandEntryIds, getDeathCommandEntry } from "./utility";

// Runs every time an entity dies and checks if it has a detector.
world.afterEvents.entityDie.subscribe((event) => {
    const entity = event.deadEntity
    
    // Stops errors from popping up further down
    if (!entity.isValid()) return

    const deathCommandIds = getAllDeathCommandEntryIds(entity)

    deathCommandIds.forEach(id => {
        const command = getDeathCommandEntry(entity, id)
        system.run(() => {
            entity.runCommand(command)
        })
    })

    // Left here for compatability
    const isDetector = entity.getDynamicProperty("enabledDeathDetector") as boolean

    if (isDetector) {
        const deathCommand = entity.getDynamicProperty("onDeathCommand") as string

        system.run(() => {
            entity.runCommand(deathCommand)
        })
    }
})