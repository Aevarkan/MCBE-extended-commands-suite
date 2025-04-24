/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageMusic.ts
 * Author: Aevarkan
 */

import { MusicOptions, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { DEFAULT_MUSIC_FADE, DEFAULT_MUSIC_LOOP, DEFAULT_MUSIC_VOLUME } from "constants";

export function playMusic(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    const parameters = event.message as string

    // Split the message into parts by space
    const parts = parameters.split(' ')

    // The parts
    const trackId = parts[0].toString()

    // If parts.length greater than 1, then turn this section into a float, otherwise use the default
    const musicVolume = parts.length > 1 ? parseFloat(parts[1]) : DEFAULT_MUSIC_VOLUME
    const musicFade = parts.length > 2 ? parseFloat(parts[2]) : DEFAULT_MUSIC_FADE
    // true if the string is 'true', else false
    const musicLoop = parts[3].toLowerCase() === "true" ? true : DEFAULT_MUSIC_LOOP

    // The actual music player
    // Will be useful for later when custom slash commands are added
    playMusicAction(player, trackId, musicVolume, musicFade, musicLoop)
}

export function stopMusic(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    
    player.stopMusic()
}

/**
 * 
 * @param player The player that the music will play for.
 * @param trackId Identifier of the music track to play.
 * @param trackFade How long the transition is between the new and old tracks playing.
 * @param trackVolume How loud the track will play.
 * @param trackLoop Will the track play more than once?
 */
function playMusicAction(player: Player, trackId: string, trackVolume: number, trackFade: number, trackLoop: boolean) {

    const musicOptions: MusicOptions = {
        volume: trackVolume,
        fade: trackFade,
        loop: trackLoop,
    }

    player.playMusic(trackId, musicOptions)
}