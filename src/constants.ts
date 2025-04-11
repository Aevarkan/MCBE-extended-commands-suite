/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: constants.ts
 * Author: Aevarkan
 */

// These are where the default values are stored
// You shouldn't really need to change these, as you should be able define them in the command

// Music Player
export const DEFAULT_MUSIC_FADE = 1 // In seconds
export const DEFAULT_MUSIC_VOLUME = 1
export const DEFAULT_MUSIC_LOOP = false

// Scoreboard Counters
export const HEALTH_SCOREBOARD_NAME = "ecs:health"
export const DEATH_SCOREBOARD_NAME = "ecs:deaths"
export const PVP_KILLS_SCOREBOARD_NAME = "ecs:player_kills"
export const PVE_KILLS_SCOREBOARD_NAME = "ecs:mob_kills"
export const PVP_DEATHS_SCOREBOARD_NAME = "ecs:pvp_deaths"