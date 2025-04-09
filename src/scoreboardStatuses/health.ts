/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: health.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, EntityHealthComponent, system, world } from "@minecraft/server";

// Initialisation of scoreboards if not done already
let healthScoreboard = world.scoreboard.getObjective("ecs:health")
if (!healthScoreboard) {
    healthScoreboard = world.scoreboard.addObjective("ecs:health")
}

// Gives every player a scoreboard value on script load

system.run(() => {
    initialiseScoreboard()
})

world.afterEvents.playerJoin.subscribe(() => {
    initialiseScoreboard()
})

// Updates the scoreboard value everytime an entity changes health
world.afterEvents.entityHealthChanged.subscribe((event) => {
    const entity = event.entity
    const newHealthValue = event.newValue

    healthScoreboard.setScore(entity, newHealthValue)
})

function initialiseScoreboard() {
    const players = world.getAllPlayers()
    players.forEach(player => {
        const health = player.getComponent(EntityComponentTypes.Health).currentValue
        healthScoreboard.setScore(player, health)
    })
}