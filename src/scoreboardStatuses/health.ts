/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: health.ts
 * Author: Aevarkan
 */

import { Entity, EntityComponentTypes, EntityHealthComponent, world } from "@minecraft/server";
import { getScoreboard } from "./utility";
import { HEALTH_SCOREBOARD_NAME } from "constants";

// Gives entity an initial scoreboard value
world.afterEvents.worldInitialize.subscribe(() => {
    const players = world.getAllPlayers()
    players.forEach(player => {
        initialiseScoreboard(player)
    })
})

world.afterEvents.entitySpawn.subscribe((event) => {
    initialiseScoreboard(event.entity)
})

// Updates the scoreboard value everytime an entity changes health
world.afterEvents.entityHealthChanged.subscribe((event) => {
    const entity = event.entity
    const newHealthValue = event.newValue
    const healthScoreboard = getScoreboard(HEALTH_SCOREBOARD_NAME)

    if (!entity.isValid()) return

    healthScoreboard.setScore(entity, newHealthValue)
})

/**
 * Initialise the health scoreboard for an entity.
 * @param entity The entity.
 */
function initialiseScoreboard(entity: Entity) {
    const healthScoreboard = getScoreboard(HEALTH_SCOREBOARD_NAME)
    const hasHealth = entity.hasComponent(EntityComponentTypes.Health)

    // Only does it for entities with health
    if (!hasHealth) return

    const healthComponent = entity.getComponent(EntityComponentTypes.Health) as EntityHealthComponent
    const health = healthComponent.currentValue
    healthScoreboard.setScore(entity, health)
}