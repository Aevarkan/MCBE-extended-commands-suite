/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: deathDetection.ts
 * Author: Aevarkan
 */

import { system, world } from "@minecraft/server";

// Runs every time an entity dies and checks if it has a detector.
world.afterEvents.entityDie.subscribe((event) => {
    const entity = event.deadEntity
    
    // Stops errors from popping up further down
    if (!entity.isValid()) return

    const isDetector = entity.getDynamicProperty("enabledDeathDetector") as boolean

    if (isDetector) {
        const deathCommand = entity.getDynamicProperty("onDeathCommand") as string

        system.run(() => {
            entity.runCommand(deathCommand)
        })
    }
})