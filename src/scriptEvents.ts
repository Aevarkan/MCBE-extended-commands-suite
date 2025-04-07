// This file is part of Extended Commands Suite which is released under GPL-3.0.
// See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
// File: scriptEvents.ts
// Author: Aevarkan

import { Player, system } from "@minecraft/server";
import { push } from "push";
import { playMusic, stopMusic } from "manageMusic";
import { scheduleCommand } from "schedule";
import { tpToSpawn } from "tpSpawn";
import { freeze } from "freeze";
import { createRightClickDetector, removeRightClickDetector } from "rightClickDetection/manageDetector";
import { setLore } from "setLore";

// This file contains ALL the script events
// event.id is what you put in as the first part of the command
// e.g. /scriptevent hello
// This makes event.id = 'hello'
// Anything you put afterwards will be part of event.message
// See the playmusic command for an example
system.afterEvents.scriptEventReceive.subscribe((event) => {

    // The command prefixes
    const prefixes = ["cmd", "cmdlib", "clib"]

    // Create regex patterns using the prefixes
    // These are what the scriptevent commands are
    const playMusicId = new RegExp(`^(${prefixes.join('|')}):playmusic$`)
    const stopMusicId = new RegExp(`^(${prefixes.join('|')}):stopmusic$`)
    const pushId = new RegExp(`^(${prefixes.join('|')}):push$`)
    const motionId = new RegExp(`^(${prefixes.join('|')}):motion$`)
    const pushGlidingId = new RegExp(`^(${prefixes.join('|')}):pushgliding$`)
    // const pushBackId = new RegExp(`^(${prefixes.join('|')}):pushback$`)
    // const pushForwardId = new RegExp(`^(${prefixes.join('|')}):pushforward$`)
    // const pushRandomId = new RegExp(`^(${prefixes.join('|')}):pushrandom$`)
    const scheduleId = new RegExp(`^(${prefixes.join('|')}):schedule$`)
    const tpSpawnId = new RegExp(`^(${prefixes.join('|')}):tpspawn$`)
    const freezeId = new RegExp(`^(${prefixes.join('|')}):freeze$`)
    const addUseCommandId = new RegExp(`^(${prefixes.join('|')}):addusecommand$`)
    const removeUseCommandId = new RegExp(`^(${prefixes.join('|')}):removeusecommand$`)
    const setLoreId = new RegExp(`^(${prefixes.join('|')}):setlore$`)

    // This is called using /scriptevent cmdlib:playmusic trackid
    // Example /scriptevent cmdlib:playmusic music.game.credits 2 1 true
    // This plays the credits track, fading from the currently playing track in 2 seconds, has a volume of 1, and will loop
    // This is basically a better /playsound command, or /music that works for individual players
    // Just like /music, the options after the track are optional
    // /playsound doesn't have fade, and the game music will still play
    // The /music command doesn't work either, it affects the music of *every* player
    if (playMusicId.test(event.id)) {
        playMusic(event)
    } 

    // Unfortunately, there is no fade out for stopping music
    // If you want to fade out the current track, you can use the playmusic scriptevent above instead
    else if (stopMusicId.test(event.id)) {
        stopMusic(event)
    }

    else if (pushId.test(event.id) || motionId.test(event.id)) {
        push(event)
    }

    else if (
        pushGlidingId.test(event.id) &&
        event.sourceEntity instanceof Player &&
        event.sourceEntity.isGliding
    ) {
        push(event)
    }

    // This schedules a command for the entity to do later. Pretty much just Java edition's /schedule.
    // This makes the entity that runs this command say hi in 100 ticks, or 5 seconds
    // Example: /scriptevent cmd:schedule 100 say hi
    else if (scheduleId.test(event.id)) {
        scheduleCommand(event)
    }

    // Teleports a player to their spawn point. Like the magic mirror in Terraria.
    // Example: /scriptevent cmd:tpspawn
    else if (tpSpawnId.test(event.id)) {
        tpToSpawn(event)
    }

    // Freezes an entity for a specified number of ticks
    // WARNING: THIS IS VERY PERFORMANCE INTENSIVE
    // BEST PRACTICE, USE IT ONLY ON PLAYERS
    else if (freezeId.test(event.id)) {
        freeze(event)
    }

    // NOTE: This does NOT work on stackable items!
    // Dynamic properties can't be added to them
    // https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setdynamicproperty
    // Adds a right click detector onto the player's selected item
    // Usage: /scriptevent cmdlib:addrightclickcommand command
    // Example /scriptevent cmdlib:addrightclickcommand say hi
    // This makes the player say hi everytime they use that nonstackable item
    // DO NOT put a slash in front of the command
    // This is bad: /scriptevent cmdlib:addrightclickcommand /say hi
    // This is good: /scriptevent cmdlib:addrightclickcommand say hi
    else if (addUseCommandId.test(event.id) && event.sourceEntity instanceof Player) {
        createRightClickDetector(event)
    }
    // // Removes the right click detector on the player's selected item
    else if (removeUseCommandId.test(event.id) && event.sourceEntity instanceof Player) {
        removeRightClickDetector(event)
    }


    // Sets the item lore, the explainer text shows up when you hover over an item
    // Example /scriptevent cmd:setlore I am an apple!
    else if (setLoreId.test(event.id) && event.sourceEntity instanceof Player) {
        setLore(event)
    }

    // Switch statements exist, but I don't like how they look
})