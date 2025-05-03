/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: continuousDetection.ts
 * Author: Aevarkan
 */

import { system, world } from "@minecraft/server";
import { PLAYER_CLIMBING_TAG, PLAYER_EMOTING_TAG, PLAYER_FALLING_TAG, PLAYER_FLYING_TAG, PLAYER_GLIDING_TAG, PLAYER_INWATER_TAG, PLAYER_ONGROUND_TAG, PLAYER_SLEEPING_TAG, PLAYER_SPRINTING_TAG, PLAYER_SWIMMING_TAG } from "constants";

const enabledContinuousDetection = world.getDynamicProperty("enabledContinuousDetection") as boolean ?? false

if (enabledContinuousDetection) {
    system.runInterval(() => {
        const players = world.getAllPlayers()

        players.forEach(player => {
            // The detections must be here so they'll be delayed by one tick
            const isClimbing = player.isClimbing
            const isEmoting = player.isEmoting
            const isFalling = player.isFalling
            const isFlying = player.isFlying
            const isGliding = player.isGliding
            const isInWater = player.isInWater
            // jumping and sneaking is handled by the button input
            // const isJumping = player.isJumping
            const isOnGround = player.isOnGround
            const isSleeping = player.isSleeping
            const isSprinting = player.isSprinting
            const isSwimming = player.isSwimming

            system.runTimeout(() => {

                if (isClimbing) {
                    player.addTag(PLAYER_CLIMBING_TAG)
                } else {
                    player.removeTag(PLAYER_CLIMBING_TAG)
                }

                if (isEmoting) {
                    player.addTag(PLAYER_EMOTING_TAG)
                } else {
                    player.removeTag(PLAYER_EMOTING_TAG)
                }

                if (isFalling) {
                    player.addTag(PLAYER_FALLING_TAG)
                } else {
                    player.removeTag(PLAYER_FALLING_TAG)
                }

                if (isFlying) {
                    player.addTag(PLAYER_FLYING_TAG)
                } else {
                    player.removeTag(PLAYER_FLYING_TAG)
                }

                if (isGliding) {
                    player.addTag(PLAYER_GLIDING_TAG)
                } else {
                    player.removeTag(PLAYER_GLIDING_TAG)
                }

                if (isInWater) {
                    player.addTag(PLAYER_INWATER_TAG)
                } else {
                    player.removeTag(PLAYER_INWATER_TAG)
                }

                if (isOnGround) {
                    player.addTag(PLAYER_ONGROUND_TAG)
                } else {
                    player.removeTag(PLAYER_ONGROUND_TAG)
                }

                if (isSleeping) {
                    player.addTag(PLAYER_SLEEPING_TAG)
                } else {
                    player.removeTag(PLAYER_SLEEPING_TAG)
                }

                if (isSprinting) {
                    player.addTag(PLAYER_SPRINTING_TAG)
                } else {
                    player.removeTag(PLAYER_SPRINTING_TAG)
                }

                if (isSwimming) {
                    player.addTag(PLAYER_SWIMMING_TAG)
                } else {
                    player.removeTag(PLAYER_SWIMMING_TAG)
                }

            }, 1)
        })

    }, 1)
}
