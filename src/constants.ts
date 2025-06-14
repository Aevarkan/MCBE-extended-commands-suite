/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: constants.ts
 * Author: Aevarkan
 */

import { EntityDamageCause } from "@minecraft/server"

// These are where the default values are stored
// You shouldn't really need to change these, as you should be able define them in the command

// Just a version counter, may be used later to help compatibility
// The python script will insert the version number
export const CURRENT_VERSION = "v{{VERSION}}"

// Tags
export const ENTITY_LOCK_TAG = "ecs:locked_entity"
export const READ_ONLY_ADMIN_TAG = "admin" // Only a player can edit this in-game
export const ADMIN_TAG = "ecs:admin"

// Particles
export const ENTITY_LOCK_PARTICLE = "minecraft:villager_angry"
export const ENTITY_UNLOCK_PARTICLE = "minecraft:heart_particle"

// Misc Options
export const MAX_RAYCAST_BLOCK_DISTANCE = 128 // For farmode and lock/unlock commands
export const FARMODE_GOES_THROUGH_LIQUIDS = true 
export const SMITE_COMMAND = "summon lightning_bolt"
export const MAX_LORE_LINES = 20 // This is a minecraft default, you can't change it here
export const COMMAND_SUCESS_SOUND = "note.pling"
export const COMMAND_ERROR_SOUND = "note.hat"

// Music Player
export const DEFAULT_MUSIC_FADE = 1 // In seconds
export const DEFAULT_MUSIC_VOLUME = 1
export const DEFAULT_MUSIC_LOOP = false

// Tag Statuses
export const PLAYER_SNEAKING_TAG = "ecs:is_sneaking"
export const PLAYER_JUMPING_TAG = "ecs:is_jumping"
export const PLAYER_DEVICE_PC_TAG = "ecs:device_pc"
export const PLAYER_DEVICE_CONSOLE_TAG = "ecs:device_console"
export const PLAYER_DEVICE_MOBILE_TAG = "ecs:device_mobile"
export const PLAYER_INPUT_KEYBOARD_AND_MOUSE_TAG = "ecs:input_keyboard"
export const PLAYER_INPUT_GAMEPAD = "ecs:input_gamepad"
export const PLAYER_INPUT_MOTION_CONTROLLER = "ecs:input_motion_controller"
export const PLAYER_INPUT_TOUCH = "ecs:input_touch"

// Continuous Detection (Every tick)
export const PLAYER_CLIMBING_TAG = "ecs:is_climbing"
export const PLAYER_EMOTING_TAG = "ecs:is_emoting"
export const PLAYER_FALLING_TAG = "ecs:is_falling"
export const PLAYER_FLYING_TAG = "ecs:is_flying"
export const PLAYER_GLIDING_TAG = "ecs:is_gliding"
export const PLAYER_INWATER_TAG = "ecs:is_inwater"
export const PLAYER_ONGROUND_TAG = "ecs:is_onground"
export const PLAYER_SLEEPING_TAG = "ecs:is_sleeping"
export const PLAYER_SPRINTING_TAG = "ecs:is_sprinting"
export const PLAYER_SWIMMING_TAG = "ecs:is_swimming"


// Scoreboard Counters
export const HEALTH_SCOREBOARD_NAME = "ecs:health"
export const DEATH_SCOREBOARD_NAME = "ecs:deaths"
export const PLAYER_MAX_RENDER_DISTANCE_SCOREBOARD_NAME = "ecs:max_render_distance"
export const BLOCKS_BROKEN_SCOREBOARD_NAME = "ecs:blocks_broken"
export const BLOCKS_PLACED_SCOREBOARD_NAME = "ecs:blocks_placed"
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


// DO NOT CHANGE THESE

// Right Click Detection
export const RIGHT_CLICK_PREFIX_COMMAND = "_ecs_right_click_cmd_"
export const RIGHT_CLICK_PREFIX_FARMODE = "_ecs_right_click_farmode_"
export const RIGHT_CLICK_PREFIX_LORE = "_ecs_right_click_lore_"
export const RIGHT_CLICK_SUFFIX_SEPARATOR = "_ecs_"

// Entity Commands
export const DEATH_COMMAND_PREFIX = "_ecs_death_command_"
export const EMOTE_COMMAND_PREFIX = "_ecs_emote_command_"
export const JUMP_COMMAND_PREFIX = "_ecs_jump_command_"
export const PUNCH_COMMAND_PREFIX = "_ecs_punch_command_"
export const INTERACT_COMMAND_PREFIX = "_ecs_interact_command_"

// Dynamic Lore
export const DYNAMIC_LORE_PREFIX = "dynamic_lore_line_"
export const DYNAMIC_LORE_CHECK_KEY = `${DYNAMIC_LORE_PREFIX}0`
export const DYNAMIC_LORE_ITEM_TOTAL_KILLS = "total_kills"
export const DYNAMIC_LORE_ITEM_PVP_KILLS = "pvp_kills"
export const DYNAMIC_LORE_ITEM_PVE_KILLS = "pve_kills"
export const DYNAMIC_LORE_ITEM_BLOCKS_BROKEN = "blocks_broken"