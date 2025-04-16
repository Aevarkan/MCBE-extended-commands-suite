/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: entityLock.ts
 * Author: Aevarkan
 */

import { Entity, Player, ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server";
import { ENTITY_LOCK_TAG, MAX_RAYCAST_BLOCK_DISTANCE, READ_ONLY_ADMIN_TAG } from "constants";

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const targetEntity = event.target
    const player = event.player
    const isLocked = targetEntity.hasTag(ENTITY_LOCK_TAG)
    const isPlayerAdmin = player.hasTag(READ_ONLY_ADMIN_TAG)
    
    if (isLocked && !isPlayerAdmin) {
        event.cancel = true
    }
})

export function lockEntities(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    lockAction(player)
}

export function unlockEntities(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity as Player
    unlockAction(player)
}

function lockAction(player: Player) {
    const entities = getEntitiesFromRaycast(player)

    entities.forEach(entity => {
        lockEntity(entity)
    })
}

function unlockAction(player: Player) {
    const entities = getEntitiesFromRaycast(player)

    entities.forEach(entity => {
        unlockEntity(entity)
    })
}

function getEntitiesFromRaycast(player: Player) {
    const entitiesHit = player.getEntitiesFromViewDirection({maxDistance:MAX_RAYCAST_BLOCK_DISTANCE})
    const entities = [] as Entity[]

    entitiesHit.forEach(raycastHit => {
        entities.push(raycastHit.entity)
    })

    return entities
}

function lockEntity(entity: Entity) {
    const isLocked = entity.hasTag(ENTITY_LOCK_TAG)

    if (!isLocked) {
        entity.addTag(ENTITY_LOCK_TAG)
    }
}

function unlockEntity(entity: Entity) {
    const isLocked = entity.hasTag(ENTITY_LOCK_TAG)

    if (isLocked) {
        entity.removeTag(ENTITY_LOCK_TAG)
    }
}