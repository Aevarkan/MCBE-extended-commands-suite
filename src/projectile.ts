/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: projectile.ts
 * Author: Aevarkan
 */

import { DimensionLocation, Entity, EntityComponentTypes, ScriptEventCommandMessageAfterEvent, Vector3 } from "@minecraft/server";

// Plan:
// Two commands: /shoot and /projectile
// Only doing /shoot for now
// /projectile will let you spawn a projectile at any location
// /shoot only from an entity


// Testing notes
// Only works with arrows, wind charges
// Only things that appear in /summon work
export function shoot(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const parameters = event.message
    
    const parts = parameters.split(" ")

    const projectileEntityTypeId = parts[0]
    const projectilePower = parseFloat(parts[1])

    shootStraightAction(entity, projectileEntityTypeId, projectilePower)
}

/**
 * Shoots a projectile straight from an entity.
 * @param sourceEntity The entity that willn shoot the projectile.
 * @param projectileEntityTypeId The type id of the projectile (e.g. minecraft:arrow).
 * @param shootStrength How much power to shoot the projectile out with.
 */
function shootStraightAction(sourceEntity: Entity, projectileEntityTypeId: string, shootStrength: number) {
    const entityLocation = sourceEntity.getHeadLocation()
    const entityDimension = sourceEntity.dimension

    const entityDimensionLocation: DimensionLocation = {
        dimension: entityDimension,
        x: entityLocation.x,
        y: entityLocation.y,
        z: entityLocation.z
    }

    const viewDirection = sourceEntity.getViewDirection()

    const shootVector: Vector3 = {
        x: viewDirection.x * shootStrength,
        y: viewDirection.y * shootStrength,
        z: viewDirection.z * shootStrength,
    }

    shootProjectileAsEntity(projectileEntityTypeId, entityDimensionLocation, shootVector, sourceEntity)
}

/**
 * Creates and shoots a projectile, assigning ownership to an entity.
 * @param projectileEntityTypeId The projectile entity type id. (e.g. minecraft:arrow)
 * @param location The location where the projectile is shot from.
 * @param directionVector The vector that the projectile should be shot at.
 * @param sourceEntity The entity that will have ownership of the projectile.
 */
function shootProjectileAsEntity(projectileEntityTypeId: string, location: DimensionLocation, directionVector: Vector3, sourceEntity?: Entity) {

    const projectileEntity = location.dimension.spawnEntity(projectileEntityTypeId, {x: location.x, y: location.y, z:location.z})
    const isProjectileEntity = projectileEntity.hasComponent(EntityComponentTypes.Projectile)

    if (!isProjectileEntity) {
        console.log("[ECS]: ", projectileEntityTypeId, " doesn't have a projectile component!")
        return
    }

    const projectileComponent = projectileEntity.getComponent(EntityComponentTypes.Projectile)

    projectileComponent.owner = sourceEntity
    // This command always has perfect shots, could change this later though
    projectileComponent.shoot(directionVector, {uncertainty: 0})
}