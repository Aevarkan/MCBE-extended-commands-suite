/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: manageMusic.ts
 * Author: Aevarkan
 */

import { CustomCommandParamType, MusicOptions, Player, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { commandRegister, DEFAULT_MUSIC_FADE, DEFAULT_MUSIC_LOOP, DEFAULT_MUSIC_VOLUME } from "constants";
import { defineCommand, defineParameter } from "command-wrapper";

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
    const musicLoop = parts.length > 3 ? parts[3].toLowerCase() === "true" ? true : DEFAULT_MUSIC_LOOP : DEFAULT_MUSIC_LOOP

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

// playmusic command
const playerParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.PlayerSelector,
    mandatory: true,
})

const trackIdParam = defineParameter({
    name: "trackId",
    type: CustomCommandParamType.String,
    mandatory: true
})

const musicVolumeParam = defineParameter({
    name: "volume",
    type: CustomCommandParamType.Float,
    mandatory: false
})

const musicFadeParam = defineParameter({
    name: "fade",
    type: CustomCommandParamType.Float,
    mandatory: false
})

const musicLoopParam = defineParameter({
    name: "loop",
    type: CustomCommandParamType.Boolean,
    mandatory: false
})

const musicCommand = defineCommand({
    name: "playmusic",
    description: "Plays music for selected players.",
    parameters: [playerParam, trackIdParam, musicVolumeParam, musicFadeParam, musicLoopParam],
    callbackFunction(_origin, players, trackId, volumeArg?, fadeArg?, loopArg?) {
        const volume = volumeArg ?? DEFAULT_MUSIC_VOLUME
        const fade = fadeArg ?? DEFAULT_MUSIC_FADE
        const loop = loopArg ?? DEFAULT_MUSIC_LOOP

        system.run(() => {
            players.forEach(player => {
                playMusicAction(player, trackId, volume, fade, loop)
            })
        })
    },
})

// stopmusic command
const stopMusicCommand = defineCommand({
    name: "stopmusic",
    description: "Stops any music tracks playing for selected players.",
    parameters: [playerParam],
    callbackFunction(_origin, players) {
        players.forEach(player => {
            system.run(()=> {
                player.stopMusic()
            })
        })
    },
})

commandRegister.registerCommand(musicCommand)
commandRegister.registerCommand(stopMusicCommand)
