/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: health.ts
 * Author: Aevarkan
 */

import { world } from "@minecraft/server";

// Initialisation of scoreboards if not done already
const scoreboard = world.scoreboard.getObjective("ecs:health")
if (!scoreboard) { world.scoreboard.addObjective("ecs:health") }

// Updates the scoreboard value everytime an entity changes health
world.afterEvents.entityHealthChanged.subscribe((event) => {
    const entity = event.entity
    const newHealthValue = event.newValue

    scoreboard.setScore(entity, newHealthValue)
})