/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: emoteDetection.ts
 * Author: Aevarkan
 */

import { system, world } from "@minecraft/server";
import { EntityCommandDatabase, EntityCommandTypes } from "classes/EntityCommandDatabase";

world.afterEvents.playerEmote.subscribe((event) => {
    const player = event.player

    // const emoteId = event.personaPieceId // This is a uuid, not really usefu
    // console.log(player.name, emoteId)

    const emoteDatabase = new EntityCommandDatabase(player)
    
    const emoteCommandIds = emoteDatabase.getAllEntryIds(EntityCommandTypes.EmoteCommand)
    
    emoteCommandIds.forEach(id => {
        const command = emoteDatabase.getEntry(id)
        system.run(() => {
            player.runCommand(command)
        })
    })
})