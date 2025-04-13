/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: constants.ts
 * Author: Aevarkan
 */

import { EntityDamageCause } from "@minecraft/server"

// These are where the default values are stored
// You shouldn't really need to change these, as you should be able define them in the command

// Music Player
export const DEFAULT_MUSIC_FADE = 1 // In seconds
export const DEFAULT_MUSIC_VOLUME = 1
export const DEFAULT_MUSIC_LOOP = false

// Scoreboard Counters
export const HEALTH_SCOREBOARD_NAME = "ecs:health"
export const DEATH_SCOREBOARD_NAME = "ecs:deaths"
export const COMBINED_TOTAL_KILLS_SCOREBOARD_NAME = "ecs:combined_total_kills"
export const PVP_TOTAL_KILLS_SCOREBOARD_NAME = "ecs:pvp_total_kills"
export const PVE_TOTAL_KILLS_SCOREBOARD_NAME = "ecs:pve_total_kills"
export const COMBINED_MELEE_KILLS_SCOREBOARD_NAME = "ecs:combined_melee_kills"
export const PVP_MELEE_KILLS_SCOREBOARD_NAME = "ecs:pvp_melee_kills"
export const PVE_MELEE_KILLS_SCOREBOARD_NAME = "ecs:pve_melee_kills"
export const COMBINED_RANGED_KILLS_SCOREBOARD_NAME = "ecs:combined_ranged_kills"
export const PVP_RANGED_KILLS_SCOREBOARD_NAME = "ecs:pvp_ranged_kills"
export const PVE_RANGED_KILLS_SCOREBOARD_NAME = "ecs:pve_ranged_kills"
export const COMBINED_MAGIC_KILLS_SCOREBOARD_NAME = "ecs:combined_magic_kills"
export const PVE_MAGIC_KILLS_SCOREBOARD_NAME = "ecs:pve_magic_kills"
export const PVP_MAGIC_KILLS_SCOREBOARD_NAME = "ecs:pvp_magic_kills"
export const PVP_DEATHS_SCOREBOARD_NAME = "ecs:pvp_deaths"

export const KILL_SCOREBOARD_NAMES: string[] = [
    PVP_TOTAL_KILLS_SCOREBOARD_NAME,
    PVE_TOTAL_KILLS_SCOREBOARD_NAME,
    PVP_MELEE_KILLS_SCOREBOARD_NAME,
    PVE_MELEE_KILLS_SCOREBOARD_NAME,
    PVP_RANGED_KILLS_SCOREBOARD_NAME,
    PVE_RANGED_KILLS_SCOREBOARD_NAME,
    PVE_MAGIC_KILLS_SCOREBOARD_NAME,
    PVP_MAGIC_KILLS_SCOREBOARD_NAME,
    PVP_DEATHS_SCOREBOARD_NAME
]

export const MELEE_KILL_CAUSES: EntityDamageCause[] = [
    EntityDamageCause.entityAttack,
    EntityDamageCause.charging,
    EntityDamageCause.contact,
    EntityDamageCause.maceSmash,
    EntityDamageCause.ramAttack,
]

export const RANGED_KILL_CAUSES: EntityDamageCause[] = [
    EntityDamageCause.projectile,
    EntityDamageCause.sonicBoom
]

export const MAGIC_KILL_CAUSES: EntityDamageCause[] = [
    EntityDamageCause.magic,
    EntityDamageCause.thorns,
    EntityDamageCause.blockExplosion,
    EntityDamageCause.wither
]

// Right Click Detection

// DO NOT CHANGE THESE
export const RIGHT_CLICK_PREFIX_COMMAND = "_ecs_right_click_cmd_"
export const RIGHT_CLICK_PREFIX_FARMODE = "_ecs_right_click_farmode_"
export const RIGHT_CLICK_PREFIX_LORE = "_ecs_right_click_lore_"