/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: push.ts
 * Author: Aevarkan
 */

import { CustomCommandParamType, Entity, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { defineCommand, defineParameter } from "command-wrapper";
import { commandRegister } from "constants";
import { VectorXZ } from "server/utility/Vectors";

export function push(event: ScriptEventCommandMessageAfterEvent) {
    const entity = event.sourceEntity
    const parameters = event.message

    if (!entity) return

    // Split the message into parts by space
    const parts = parameters.split(' ')
    
    // Checks if we're using absolute directions
    const doAbsolute = parts[0].toString()
    const isAbsolute = ['a', 'abs', 'absolute'].includes(doAbsolute)

    // This doesn't work on items!
    if (entity.hasComponent("minecraft:item")) {
        // console.info("/push doeesn't work on items!")
        return
    }

    // Absolute directions
    if (isAbsolute) {

        const xDirectionString = parts[1]
        const yDirectionString = parts[2]
        const zDirectionString = parts[3]

        // If in the form 'min:max', gives a random number between them, otherwise gives the number
        // 0 also gives an error, therefore we handle that separately 
        const xDirection = xDirectionString.includes(':') ? randNumFromStr(xDirectionString) : parseFloat(xDirectionString)
        const yDirection = yDirectionString.includes(':') ? randNumFromStr(yDirectionString) : parseFloat(yDirectionString)
        const zDirection = zDirectionString.includes(':') ? randNumFromStr(zDirectionString) : parseFloat(zDirectionString)

        pushActionAbsolute(entity, xDirection, yDirection, zDirection)

    } else { // Using relative directions
        const horzRotStr = parts[1]
        const horzStrengthStr = parts[2]
        const vertStrengthStr = parts[3]

        // If in the form 'min:max', gives a random number between them, otherwise gives the number
        const horizontalRotation = horzRotStr.includes(':') ? randNumFromStr(horzRotStr) : parseFloat(horzRotStr)
        const horizontalStrength = horzStrengthStr.includes(':') ? randNumFromStr(horzStrengthStr) : parseFloat(horzStrengthStr)
        const verticalStrength = vertStrengthStr.includes(':') ? randNumFromStr(vertStrengthStr) : parseFloat(vertStrengthStr)

        pushActionRelative(entity, horizontalRotation, horizontalStrength, verticalStrength)
    }
}

/**
 * Pushes an entity using absolute coordinates.
 * @param entity The entity that should be pushed.
 * @param xVector Strength to push the entity in the X direction.
 * @param yVector Strength to push the entity in the Y direction.
 * @param zVector Strength to push the entity in the Z direction.
 * @param impulse Whether motion is applied by knockback or impulse. Defaults to knockback.
 */
function pushActionAbsolute(entity: Entity, xVector: number, yVector: number, zVector: number, impulse: boolean = false) {
    // Scaling
    const scaledX = xVector / 2
    const scaledY = sqrtScale(yVector) / 2
    const scaledZ = zVector / 2

    // // Normalisation
    // const horizontalMagnitude = Math.sqrt(scaledX ** 2 + scaledZ ** 2);
    // // Prevent divide by 0 errors, which will happen if you want to go directly up
    // const directionX = (horizontalMagnitude == 0) ? 0 : scaledX / horizontalMagnitude
    // const directionZ = (horizontalMagnitude == 0) ? 0 : scaledZ / horizontalMagnitude
    
    if (impulse) {
        entity.applyImpulse({x: scaledX, y: scaledY, z: scaledZ})
    } else {
        entity.applyKnockback({x: scaledX, z: scaledZ}, scaledY)
    }
}

/**
 * Pushes an entity using relative coordinates.
 * @param entity The entity that should be pushed.
 * @param horizontalRotation The direction the entity should be pushed relative to its current.
 * @param horizontalStrength The strength the entity is pushed along the horizontal plane.
 * @param verticalStrength The strength the entity is pushed along the vertical plane.
 * @param impulse Whether motion is applied by knockback or impulse. Defaults to knockback.
 */
function pushActionRelative(entity: Entity, horizontalRotation: number, horizontalStrength: number, verticalStrength: number, impulse: boolean = false) {
    // Scaling
    const scaledhorizontalStrength = horizontalStrength / 2
    const scaledVerticalStrength = sqrtScale(verticalStrength) / 2

    // Rotation
    const viewDirection = entity.getViewDirection()
    const currentDirection = new VectorXZ(viewDirection.x, viewDirection.z)
    const newDirection = currentDirection.applyRotation(horizontalRotation)

    // entity.applyImpulse(randomDirection) doesn't work on players ! !
    // Therefore, we use .applyKnockback instead. It works on both players and regular entities
    const finalX = newDirection.x * scaledhorizontalStrength
    const finalY = scaledVerticalStrength
    const finalZ = newDirection.z * scaledhorizontalStrength

    if (impulse) {
        entity.applyImpulse({x: finalX, y: finalY, z: finalZ})
    } else {
        entity.applyKnockback({x: finalX, z: finalZ}, finalY)
    }
}

/**
 * 
 * @param number The number you want to scale down
 * @returns The square root of the number, keeping its sign.
 */
function sqrtScale(number: number): number {
    const scaled = Math.sign(number) * Math.sqrt(Math.abs(number))
    return scaled
}

/**
 * Generates a random number given a string.
 * @param string A string in the form `min:max`
 * @returns A random number between the `min` and `max`
 */
function randNumFromStr(string: string): number {
    const range = stringToRange(string)
    const randomNumber = randomInRange(range)
    return randomNumber
}

/**
 * 
 * @param string A string in the form `min:max`
 * @returns A numerical array represenation of the range.
 */
function stringToRange(string: string): [number, number] {
    const [minString, maxString] = string.split(':')
    const min = parseFloat(minString)
    const max = parseFloat(maxString)
    return [min, max]
}

/**
 * 
 * @param range A number array in the form `[min, max]`
 * @returns A random number in between the `min` and `max`
 */
function randomInRange(range: [number, number]): number {
    const randomNumber = ( Math.random() * (range[1] - range[0]) ) + range[0]
    return randomNumber
}

// example command:
// /push @s relative -45 5 2 45 10 3
// /push (entity) (modeEnum|relative) (minangle/angle) (minHorizontalStrength) (minVerticalStrength)
// /push (entity) (modeEnum|absolute) (minXStrength) (minYStrength) (minZStrength)

// very annoying, but subcommands aren't supported yet
// thankfully, the syntax is the same

// MIN
const minAngleXStrength = defineParameter({
    name: "minAngle/minXComponent",
    type: CustomCommandParamType.Float,
    mandatory: true
})

const minHorizontalYStrength = defineParameter({
    name: "minHorizontalStrength/minTComponent",
    type: CustomCommandParamType.Float,
    mandatory: true
})

const minVerticalZStrength = defineParameter({
    name: "minVerticalStrength/minZComponent",
    type: CustomCommandParamType.Float,
    mandatory: true
})

// MAX
const maxAngleXStrength = defineParameter({
    name: "maxAngle/maxXComponent",
    type: CustomCommandParamType.Float,
    mandatory: false
})

const maxHorizontalYStrength = defineParameter({
    name: "maxHorizontalStrength/maxTComponent",
    type: CustomCommandParamType.Float,
    mandatory: false
})

const maxVerticalZStrength = defineParameter({
    name: "maxVerticalStrength/maxZComponent",
    type: CustomCommandParamType.Float,
    mandatory: false
})

// other arguments
const entityParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})

const movementMode = defineParameter({
    name: "movementMode",
    type: CustomCommandParamType.Enum,
    mandatory: true,
    values: ["relative", "r", "absolute", "a"] as const
})

// JUST so I don't have to copy it out twice
function handleMovement(impulse: boolean, entities: Entity[], mode: string, mandatoryArg1: number, mandatoryArg2: number, mandatoryArg3: number, optionalArg1?: number, optionalArg2?: number, optionalArg3?: number) {
    // process ranges first
    let float1 = mandatoryArg1
    if (optionalArg1) {
        float1 = randomInRange([mandatoryArg1, optionalArg1])
    }
    let float2 = mandatoryArg2
    if (optionalArg2) {
        float2 = randomInRange([mandatoryArg2, optionalArg2])
    }
    let float3 = mandatoryArg3
    if (optionalArg3) {
        float3 = randomInRange([mandatoryArg3, optionalArg3])
    }


    // absolute movement
    if (mode === "a" || mode === "absolute") {
        const xVector = float1
        const yVector = float2
        const zVector = float3
        system.run(() => {
            entities.forEach(entity => {
                pushActionAbsolute(entity, xVector, yVector, zVector, impulse)
            })
        })
    }
    // relative movement
    else {
        const rotationAngle = float1
        const horizontalStrength = float2
        const verticalStrength = float3
        system.run(() => {
            entities.forEach(entity => {
                pushActionRelative(entity, rotationAngle, horizontalStrength, verticalStrength, impulse)
            })
        })
    }
}

const motionCommand = defineCommand({
    name: "motion",
    description: "Sets the velocity of selected entities.",
    parameters: [entityParam, movementMode, minAngleXStrength, minHorizontalYStrength, minVerticalZStrength, maxAngleXStrength, maxHorizontalYStrength, maxVerticalZStrength],
    callbackFunction(_origin, entities, mode, mandatoryArg1, mandatoryArg2, mandatoryArg3, optionalArg1?, optionalArg2?, optionalArg3?) {
        handleMovement(true, entities, mode, mandatoryArg1, mandatoryArg2, mandatoryArg3, optionalArg1, optionalArg2, optionalArg3)
    },
})

// const pushCommand = defineCommand({
//     name: "push",
//     description: "Changes the velocity of selected entities.",
//     parameters: [entityParam, movementMode, minAngleXStrength, minHorizontalYStrength, minVerticalZStrength, maxAngleXStrength, maxHorizontalYStrength, maxVerticalZStrength],
//     callbackFunction(_origin, entities, mode, mandatoryArg1, mandatoryArg2, mandatoryArg3, optionalArg1?, optionalArg2?, optionalArg3?) {
//         handleMovement(false, entities, mode, mandatoryArg1, mandatoryArg2, mandatoryArg3, optionalArg1, optionalArg2, optionalArg3)
//     },
// })

commandRegister.registerCommand(motionCommand)
