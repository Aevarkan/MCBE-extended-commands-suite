/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: blockCounter.ts
 * Author: Aevarkan
 */

import { world } from "@minecraft/server"
import { getScoreboard } from "./utility"
import { BLOCKS_BROKEN_SCOREBOARD_NAME, BLOCKS_PLACED_SCOREBOARD_NAME } from "constants"

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const player = event.player

    const blocksBrokenScoreboard = getScoreboard(BLOCKS_BROKEN_SCOREBOARD_NAME)

    blocksBrokenScoreboard.addScore(player, 1)
})

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const player = event.player

    const blocksPlacedScoreboard = getScoreboard(BLOCKS_PLACED_SCOREBOARD_NAME)

    blocksPlacedScoreboard.addScore(player, 1)
})