/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: stateDetection.ts
 * Author: Aevarkan
 */

import { InputMode, PlatformType, world } from "@minecraft/server";
import { PLAYER_DEVICE_CONSOLE_TAG, PLAYER_DEVICE_MOBILE_TAG, PLAYER_DEVICE_PC_TAG, PLAYER_INPUT_GAMEPAD, PLAYER_INPUT_KEYBOARD_AND_MOUSE_TAG, PLAYER_INPUT_MOTION_CONTROLLER, PLAYER_INPUT_TOUCH, PLAYER_MAX_RENDER_DISTANCE_SCOREBOARD_NAME } from "constants";
import { getScoreboard } from "server/scoreboardStatuses/utility";

world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player
    const maxRenderDistance = player.clientSystemInfo.maxRenderDistance
    const platform = player.clientSystemInfo.platformType
    const inputMode = player.inputInfo.lastInputModeUsed

    // Puts the player's max render distance into a scoreboard
    // I have no idea why you'd use this, but it's there if you want
    // This is a scoreboard, but it's close enough to being a tag
    const renderDistanceScoreboard = getScoreboard(PLAYER_MAX_RENDER_DISTANCE_SCOREBOARD_NAME)
    renderDistanceScoreboard.setScore(player, maxRenderDistance)

    // The rest of the tags
    // Removing them
    player.removeTag(PLAYER_DEVICE_PC_TAG)
    player.removeTag(PLAYER_DEVICE_CONSOLE_TAG)
    player.removeTag(PLAYER_DEVICE_MOBILE_TAG)

    // The device the player is on
    if (platform == PlatformType.Desktop) {
        player.addTag(PLAYER_DEVICE_PC_TAG)
    } else if (platform == PlatformType.Console) {
        player.addTag(PLAYER_DEVICE_CONSOLE_TAG)
    } else if (platform == PlatformType.Mobile) {
        player.addTag(PLAYER_DEVICE_MOBILE_TAG)
    }

    // Input modes, like keyboard and mouse
    if (inputMode == InputMode.KeyboardAndMouse) {
        player.addTag(PLAYER_INPUT_KEYBOARD_AND_MOUSE_TAG)
    } else if (inputMode == InputMode.Gamepad) {
        player.addTag(PLAYER_INPUT_GAMEPAD)
    } else if (inputMode == InputMode.MotionController) {
        player.addTag(PLAYER_INPUT_MOTION_CONTROLLER)
    } else if (inputMode == InputMode.Touch) {
        player.addTag(PLAYER_INPUT_TOUCH)
    }
})

world.afterEvents.playerInputModeChange.subscribe((event) => {
    const inputMode = event.newInputModeUsed
    const player = event.player

    player.removeTag(PLAYER_INPUT_KEYBOARD_AND_MOUSE_TAG)
    player.removeTag(PLAYER_INPUT_GAMEPAD)
    player.removeTag(PLAYER_INPUT_MOTION_CONTROLLER)
    player.removeTag(PLAYER_INPUT_TOUCH)

    if (inputMode == InputMode.KeyboardAndMouse) {
        player.addTag(PLAYER_INPUT_KEYBOARD_AND_MOUSE_TAG)
    } else if (inputMode == InputMode.Gamepad) {
        player.addTag(PLAYER_INPUT_GAMEPAD)
    } else if (inputMode == InputMode.MotionController) {
        player.addTag(PLAYER_INPUT_MOTION_CONTROLLER)
    } else if (inputMode == InputMode.Touch) {
        player.addTag(PLAYER_INPUT_TOUCH)
    }
})