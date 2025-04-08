/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: death.ts
 * Author: Aevarkan
 */

import { Player, world } from "@minecraft/server";

// Initialisation of scoreboards if not done already
let deathScoreboard = world.scoreboard.getObjective("ecs:deaths")
if (!deathScoreboard) {
    deathScoreboard = world.scoreboard.addObjective("ecs:deaths")
}

// Updates the scoreboard value everytime an entity changes health
world.afterEvents.entityDie.subscribe((event) => {
    const player = event.deadEntity
    const isPlayer = player instanceof Player

    // Doesn't apply if it's not a player
    if (!isPlayer) { return }

    deathScoreboard.addScore(player, 1)
})