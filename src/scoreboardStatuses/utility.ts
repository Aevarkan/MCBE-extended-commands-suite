/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: utility.ts
 * Author: Aevarkan
 */

import { world } from "@minecraft/server"

/**
 * Gets the specified scoreboard, or makes one if it dosn't exist.
 * @param scoreboardName The name of the scoreboard.
 * @returns The scoreboard.
 */
export function getScoreboard(scoreboardName: string) {
    let scoreboard = world.scoreboard.getObjective(scoreboardName)
    if (!scoreboard) {
        scoreboard = world.scoreboard.addObjective(scoreboardName)
    }
    return scoreboard
}