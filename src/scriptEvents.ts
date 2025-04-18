/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: scriptEvents.ts
 * Author: Aevarkan
 */

import { Player, system } from "@minecraft/server";
import { push } from "push";
import { playMusic, stopMusic } from "manageMusic";
import { scheduleCommand } from "schedule";
import { tpToSpawn } from "tpSpawn";
import { freeze } from "freeze";
import { createRightClickDetector, removeRightClickDetector } from "rightClickDetection/manageRightClickDetector";
import { editLore, setLore } from "setLore";
import { multiCommand } from "multiCommand";
import { createDeathDetector, removeDeathDetector } from "deathDetection/manageDeathDetector";
import { chance } from "chance";
import { setScale } from "size";
import { createRightClickDetectorv2, removeRightClickDetectorv2 } from "rightClickDetection/manageRightClickDetectorv2";
import { shoot } from "projectile";
import { lockEntities, unlockEntities } from "entityLock";

// This file contains ALL the script events

system.afterEvents.scriptEventReceive.subscribe((event) => {

    // The command prefixes
    const prefixes = ["ecs", "cmd"]

    // Create regex patterns using the prefixes
    // These are what the scriptevent commands are
    const playMusicId = new RegExp(`^(${prefixes.join('|')}):playmusic$`)
    const stopMusicId = new RegExp(`^(${prefixes.join('|')}):stopmusic$`)
    const pushId = new RegExp(`^(${prefixes.join('|')}):push$`)
    const motionId = new RegExp(`^(${prefixes.join('|')}):motion$`)
    const pushGlidingId = new RegExp(`^(${prefixes.join('|')}):pushgliding$`)
    const scheduleId = new RegExp(`^(${prefixes.join('|')}):schedule$`)
    const tpSpawnId = new RegExp(`^(${prefixes.join('|')}):tpspawn$`)
    const freezeId = new RegExp(`^(${prefixes.join('|')}):freeze$`)
    const addUseCommandId = new RegExp(`^(${prefixes.join('|')}):addusecommand$`)
    const addUseCommandShortId = new RegExp(`^(${prefixes.join('|')}):auc$`)
    const removeUseCommandId = new RegExp(`^(${prefixes.join('|')}):removeusecommand$`)
    const removeUseCommandShortId = new RegExp(`^(${prefixes.join('|')}):ruc$`)
    const setLoreId = new RegExp(`^(${prefixes.join('|')}):setlore$`)
    const multiCommandId = new RegExp(`^(${prefixes.join('|')}):multicommand$`)
    const addDeathCommandId = new RegExp(`^(${prefixes.join('|')}):adddeathcommand$`)
    const removeDeathCommandId = new RegExp(`^(${prefixes.join('|')}):removedeathcommand$`)
    const chanceId = new RegExp(`^(${prefixes.join('|')}):chance$`)
    const editLoreId = new RegExp(`^(${prefixes.join('|')}):editlore$`)
    const scaleId = new RegExp(`^(${prefixes.join('|')}):scale$`)
    const shootId = new RegExp(`^(${prefixes.join('|')}):shoot$`)
    const lockId = new RegExp(`^(${prefixes.join('|')}):lock$`)
    const unlockId = new RegExp(`^(${prefixes.join('|')}):unlock$`)

    const addUseCommandv2ShortId = new RegExp(`^(${prefixes.join('|')}):auc2$`)
    const removeUseCommandv2ShortId = new RegExp(`^(${prefixes.join('|')}):ruc2$`)

    // The /music command, but for individual players
    if (playMusicId.test(event.id)) {
        playMusic(event)
    } 

    // Unfortunately, there is no fade out for stopping music
    // If you want to fade out the current track, you can use the playmusic command above instead
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
    else if (
        (addUseCommandId.test(event.id) || addUseCommandShortId.test(event.id)) &&
        event.sourceEntity instanceof Player
    ) {
        createRightClickDetector(event)
    }
    // Removes the right click detector on the player's selected item
    else if (
        (removeUseCommandId.test(event.id) || removeUseCommandShortId.test(event.id)) &&
        event.sourceEntity instanceof Player
    ) {
        removeRightClickDetector(event)
    }

    // Sets the item lore, the explainer text shows up when you hover over an item
    // Example /scriptevent cmd:setlore I am an apple!
    else if (setLoreId.test(event.id) && event.sourceEntity instanceof Player) {
        setLore(event)
    }

    // Does multiple commands, separated by the pipe character `|`
    else if (multiCommandId.test(event.id)) {
        multiCommand(event)
    }

    else if (addDeathCommandId.test(event.id)) {
        createDeathDetector(event)
    }

    else if (removeDeathCommandId.test(event.id)) {
        removeDeathDetector(event)
    }

    else if (chanceId.test(event.id)) {
        chance(event)
    }

    else if (editLoreId.test(event.id)) {
        editLore(event)
    }

    else if (scaleId.test(event.id)) {
        setScale(event)
    }

    else if (addUseCommandv2ShortId.test(event.id)) {
        createRightClickDetectorv2(event)
    }

    else if (removeUseCommandv2ShortId.test(event.id)) {
        removeRightClickDetectorv2(event)
    }

    else if (shootId.test(event.id)) {
        shoot(event)
    }

    else if (lockId.test(event.id)) {
        lockEntities(event)
    }

    else if (unlockId.test(event.id)) {
        unlockEntities(event)
    }

    // Switch statements exist, but I don't like how they look
})