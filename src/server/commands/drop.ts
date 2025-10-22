/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: drop.ts
 * Author: Aevarkan
 */

import { DimensionLocation, Entity, ItemStack, ScriptEventCommandMessageAfterEvent, Vector3 } from "@minecraft/server";

export function dropItem(event: ScriptEventCommandMessageAfterEvent) {
    const sourceEntity = event.sourceEntity
    const parameters = event.message

    const parts = parameters.split(" ")
    const itemId = parts[0]
    const itemQuantity = parts.length > 1 ? parseInt(parts[1]) : 1

    spawnItemAtEntity(sourceEntity, itemId, itemQuantity)
}

/**
 * Spawns an ItemStack at an Entity's location.
 * @param entity The entity.
 * @param itemId The item type id (e.g. minecraft:diamond).
 * @param itemQuantity How many items that are in the stack.
 */
function spawnItemAtEntity(entity: Entity, itemId: string, itemQuantity: number) {
    const entityLocation = entity.location
    const entityDimension = entity.dimension
    const dimensionLocation: DimensionLocation = {
        x: entityLocation.x,
        y: entityLocation.y,
        z: entityLocation.z,
        dimension: entityDimension
    }

    spawnItemAtLocation(dimensionLocation, itemId, itemQuantity)
}

/**
 * Spawns an ItemStack.
 * @param dimensionLocation The location where the item should spawn.
 * @param itemId The item type id.
 * @param itemQuantity How many items that are in the stack.
 */
function spawnItemAtLocation(dimensionLocation: DimensionLocation, itemId: string, itemQuantity: number) {
    const itemStack = new ItemStack(itemId, itemQuantity)
    const location: Vector3 = {x: dimensionLocation.x, y: dimensionLocation.y, z: dimensionLocation.z}
    dimensionLocation.dimension.spawnItem(itemStack, location)
}