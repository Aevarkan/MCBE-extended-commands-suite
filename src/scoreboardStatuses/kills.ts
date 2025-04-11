/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: kills.ts
 * Author: Aevarkan
 */

import { Player, world } from "@minecraft/server";
import { getScoreboard } from "./utility";
import { PVE_KILLS_SCOREBOARD_NAME, PVP_DEATHS_SCOREBOARD_NAME, PVP_KILLS_SCOREBOARD_NAME } from "constants";

world.afterEvents.playerSpawn.subscribe((event) => {
    initialiseScoreboard(event.player)
})

world.afterEvents.entityDie.subscribe((event) => {
    const source = event.damageSource.damagingEntity
    const victim = event.deadEntity
    const killerIsPlayer = source instanceof Player

    // Only players have kill counters
    if (!killerIsPlayer) return

    // PvP Kills
    if (victim instanceof Player) {
        const killScoreboardPVP = getScoreboard(PVP_KILLS_SCOREBOARD_NAME)
        const deathScoreboardPVP = getScoreboard(PVP_DEATHS_SCOREBOARD_NAME)
        
        // Adds to both killer and victim's scoreboards
        killScoreboardPVP.addScore(source, 1)
        deathScoreboardPVP.addScore(victim, 1)

    } else { // Must be a PVE kill otherwise
        const killScoreboardPVE = getScoreboard(PVE_KILLS_SCOREBOARD_NAME)
        killScoreboardPVE.addScore(source, 1)
    }
})

/**
 * Initialise the kill scoreboards for a player.
 * @param player The player.
 */
function initialiseScoreboard(player: Player) {
    const killScoreboardPVE = getScoreboard(PVE_KILLS_SCOREBOARD_NAME)
    const killScoreboardPVP = getScoreboard(PVP_KILLS_SCOREBOARD_NAME)
    const deathScoreboardPVP = getScoreboard(PVP_DEATHS_SCOREBOARD_NAME)

    const hasPVEKills = killScoreboardPVE.hasParticipant(player)
    const hasPVPKills = killScoreboardPVP.hasParticipant(player)
    const hasPVPDeaths = deathScoreboardPVP.hasParticipant(player)

    if (!hasPVEKills) killScoreboardPVE.setScore(player, 0)
    if (!hasPVPKills) killScoreboardPVP.setScore(player, 0)
    if (!hasPVPDeaths) deathScoreboardPVP.setScore(player, 0)
}