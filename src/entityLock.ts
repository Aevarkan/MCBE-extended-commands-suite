/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: entityLock.ts
 * Author: Aevarkan
 */

import { Entity, Player, ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server";
import { ADMIN_TAG, ENTITY_LOCK_PARTICLE, ENTITY_LOCK_TAG, ENTITY_UNLOCK_PARTICLE, MAX_RAYCAST_BLOCK_DISTANCE } from "constants";

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const targetEntity = event.target
    const player = event.player
    const isLocked = targetEntity.hasTag(ENTITY_LOCK_TAG)
    const isPlayerAdmin = player.hasTag(ADMIN_TAG)
    
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

/**
 * Locks the entities that the player is looking at.
 * @param player The player.
 */
function lockAction(player: Player) {
    const entities = getEntitiesFromRaycast(player)
    const entityNames = [] as string[]

    entities.forEach(entity => {
        lockEntity(entity)
        entityNames.push(entity.typeId)
        const entityLocation =  entity.getHeadLocation()
        player.spawnParticle(ENTITY_LOCK_PARTICLE, entityLocation)
    })

    const playerMessage = "Locked " + entityNames.join(", ") + "."

    player.sendMessage(playerMessage)
}

/**
 * Unlocks the entities that the player is looking at.
 * @param player The player.
 */
function unlockAction(player: Player) {
    const entities = getEntitiesFromRaycast(player)
    const entityNames = [] as string[]

    entities.forEach(entity => {
        unlockEntity(entity)
        entityNames.push(entity.typeId)
        const entityLocation =  entity.getHeadLocation()
        player.spawnParticle(ENTITY_UNLOCK_PARTICLE, entityLocation)
    })

    const entityNamesString = entityNames.join(", ")

    const playerMessage = {
        translate: "ecs.command.lock.sucess",
        with: { text: entityNamesString }
        
    }
    // const playerMessage = "Unlocked " + entityNames.join(", ") + "."
    // /tellraw @a {"rawtext":[{"translate":"Hello %%s and %%s", "with":["Steve","Alex"]}]}
    player.sendMessage(playerMessage)
}

/**
 * Gets a list of entities that the player is looking at.
 * @param player The player.
 */
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