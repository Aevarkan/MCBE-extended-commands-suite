/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: jumpDetection.ts
 * Author: Aevarkan
 */

import { ButtonState, InputButton, system, world } from "@minecraft/server";
import { EntityCommandDatabase } from "classes/EntityCommandDatabase";

world.afterEvents.playerButtonInput.subscribe((event) => {
    const button = event.button
    const newState = event.newButtonState

    // We only care when the jump button is pressed
    if (button !== InputButton.Jump) return
    if (newState !== ButtonState.Pressed) return

    const player = event.player

    const jumpDatabase = new EntityCommandDatabase(player)
    
    const emoteCommandIds = jumpDatabase.getAllJumpCommandEntryIds()
    
    emoteCommandIds.forEach(id => {
        const command = jumpDatabase.getJumpCommandEntry(id)
        system.run(() => {
            player.runCommand(command)
        })
    })
})
