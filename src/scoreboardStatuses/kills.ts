/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: kills.ts
 * Author: Aevarkan
 */

import { Player, world } from "@minecraft/server";
import { getScoreboard } from "./utility";
import { KILL_SCOREBOARD_NAMES, MAGIC_KILL_CAUSES, MELEE_KILL_CAUSES, PVE_MAGIC_KILLS_SCOREBOARD_NAME, PVE_MELEE_KILLS_SCOREBOARD_NAME, PVE_RANGED_KILLS_SCOREBOARD_NAME, PVE_TOTAL_KILLS_SCOREBOARD_NAME, PVP_DEATHS_SCOREBOARD_NAME, PVP_MAGIC_KILLS_SCOREBOARD_NAME, PVP_MELEE_KILLS_SCOREBOARD_NAME, PVP_RANGED_KILLS_SCOREBOARD_NAME, PVP_TOTAL_KILLS_SCOREBOARD_NAME, RANGED_KILL_CAUSES } from "constants";

// Gives all players an initial scoreboard value
world.afterEvents.worldInitialize.subscribe(() => {
    const players = world.getAllPlayers()
    players.forEach(player => {
        initialiseScoreboard(player)
    })
})

world.afterEvents.playerSpawn.subscribe((event) => {
    initialiseScoreboard(event.player)
})

world.afterEvents.entityDie.subscribe((event) => {
    const source = event.damageSource.damagingEntity
    const victim = event.deadEntity
    const killMethod = event.damageSource.cause
    const killerIsPlayer = source instanceof Player

    // Only players have kill counters
    if (!killerIsPlayer) return

    // PvP Kills
    if (victim instanceof Player) {
        const killScoreboardPVP = getScoreboard(PVP_TOTAL_KILLS_SCOREBOARD_NAME)
        const deathScoreboardPVP = getScoreboard(PVP_DEATHS_SCOREBOARD_NAME)

        // Adds to both killer and victim's scoreboards
        killScoreboardPVP.addScore(source, 1)
        deathScoreboardPVP.addScore(victim, 1)

        const meleeKillScoreboardPVP = getScoreboard(PVP_MELEE_KILLS_SCOREBOARD_NAME)
        const rangedKillScoreboardPVP = getScoreboard(PVP_RANGED_KILLS_SCOREBOARD_NAME)
        const magicKillScoreboardPVP = getScoreboard(PVP_MAGIC_KILLS_SCOREBOARD_NAME)
        
        // Additional checks for ranged/melee/magic
        if (MELEE_KILL_CAUSES.includes(killMethod)) {
            rangedKillScoreboardPVP.addScore(source, 1)
        } else if (RANGED_KILL_CAUSES.includes(killMethod)) {
            meleeKillScoreboardPVP.addScore(source, 1)
        } else if (MAGIC_KILL_CAUSES.includes(killMethod)) {
            magicKillScoreboardPVP.addScore(source, 1)
        }


    } else { // Must be a PVE kill otherwise
        const killScoreboardPVE = getScoreboard(PVE_TOTAL_KILLS_SCOREBOARD_NAME)
        killScoreboardPVE.addScore(source, 1)

        // console.log(source, killMethod)

        const meleeKillScoreboardPVE = getScoreboard(PVE_MELEE_KILLS_SCOREBOARD_NAME)
        const rangedKillScoreboardPVE = getScoreboard(PVE_RANGED_KILLS_SCOREBOARD_NAME)
        const magicKillScoreboardPVE = getScoreboard(PVE_MAGIC_KILLS_SCOREBOARD_NAME)

        // Additional checks for ranged/melee/magic
        if (MELEE_KILL_CAUSES.includes(killMethod)) {
            meleeKillScoreboardPVE.addScore(source, 1)
        } else if (RANGED_KILL_CAUSES.includes(killMethod)) {
            rangedKillScoreboardPVE.addScore(source, 1)
        } else if (MAGIC_KILL_CAUSES.includes(killMethod)) {
            magicKillScoreboardPVE.addScore(source, 1)
        }
    }
})

/**
 * Initialise the kill scoreboards for a player.
 * @param player The player.
 */
function initialiseScoreboard(player: Player) {
    // Go through all the scoreboards and checks if the player is on it.
    // If not, then set the score to 0.
    KILL_SCOREBOARD_NAMES.forEach(scoreboardName => {
        const scoreboard = getScoreboard(scoreboardName)
        const isParticipant = scoreboard.hasParticipant(player)
        if (!isParticipant) scoreboard.setScore(player, 0)
    })
}