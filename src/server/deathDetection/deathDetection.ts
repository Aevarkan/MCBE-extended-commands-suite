/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: deathDetection.ts
 * Author: Aevarkan
 */

import { system, world } from "@minecraft/server";
import { EntityCommandDatabase } from "classes/EntityCommandDatabase";

// Runs every time an entity dies and checks if it has a detector.
world.afterEvents.entityDie.subscribe((event) => {
    const entity = event.deadEntity
    
    // Stops errors from popping up further down
    if (!entity.isValid()) return

    const entityDatabase = new EntityCommandDatabase(entity)

    const deathCommandIds = entityDatabase.getAllDeathCommandEntryIds()
    // const deathCommandIds = Database.getAllDeathCommandEntryIds(entity)

    deathCommandIds.forEach(id => {
        const command = entityDatabase.getDeathCommandEntry(id)
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