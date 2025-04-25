/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: stateDetection.ts
 * Author: Aevarkan
 */

import { ButtonState, InputButton, world } from "@minecraft/server";
import { PLAYER_JUMPING_TAG, PLAYER_SNEAKING_TAG } from "constants";

// Changes only when the player presses the button
world.afterEvents.playerButtonInput.subscribe((event) => {
    const player = event.player
    const button = event.button
    const buttonState = event.newButtonState

    if (button == InputButton.Jump) {
        if (buttonState == ButtonState.Pressed) {
            player.addTag(PLAYER_JUMPING_TAG)
        } else {
            player.removeTag(PLAYER_JUMPING_TAG)
        }
    }

    else if (button == InputButton.Sneak) {
        if (buttonState == ButtonState.Pressed) {
            player.addTag(PLAYER_SNEAKING_TAG)
        } else {
            player.removeTag(PLAYER_SNEAKING_TAG)
        }
    }
})