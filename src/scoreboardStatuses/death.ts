/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: death.ts
 * Author: Aevarkan
 */

import { Player, world } from "@minecraft/server";
import { DEATH_SCOREBOARD_NAME } from "constants";
import { getScoreboard } from "./utility";

// Gives all players an initial scoreboard value
world.afterEvents.worldInitialize.subscribe(() => {
    const players = world.getAllPlayers()
    players.forEach(player => {
        initialiseScoreboard(player)
    })
})

world.afterEvents.playerSpawn.subscribe((event) => {
    const isFirstSpawn = event.initialSpawn
    if (isFirstSpawn) initialiseScoreboard(event.player)
})

// Updates the scoreboard value everytime a player dies
world.afterEvents.entityDie.subscribe((event) => {
    const player = event.deadEntity
    const isPlayer = player instanceof Player

    // Doesn't apply if it's not a player
    if (!isPlayer) { return }

    const deathScoreboard = getScoreboard(DEATH_SCOREBOARD_NAME)

    deathScoreboard.addScore(player, 1)
})

/**
 * Initialise the death scoreboard for a player.
 * @param player The player.
 */
function initialiseScoreboard(player: Player) {
    const deathScoreboard = getScoreboard(DEATH_SCOREBOARD_NAME)
    const hasDied = deathScoreboard.hasParticipant(player)
    if (!hasDied) deathScoreboard.setScore(player, 0)
}