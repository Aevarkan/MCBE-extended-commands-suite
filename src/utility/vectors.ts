/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: vectors.ts
 * Author: Aevarkan
 */

/**
 * An XZ Vector.
 */
export class VectorXZ {
    
    x: number
    z: number

    constructor(x: number, z: number) {
        this.x = x
        this.z = z
    }

    /**
     * Apply rotation to the vector
     * @param angle Angle in degrees
     * @returns The modified vector
     */
    applyRotation(angle: number): this {
        const angleRadians = angle * (Math.PI / 180)
        
        const newX = this.x * Math.cos(angleRadians) - this.z * Math.sin(angleRadians)
        const newZ = this.x * Math.sin(angleRadians) + this.z * Math.cos(angleRadians)
        
        this.x = newX
        this.z = newZ

        return this
    }

    /**
     * Scales the vector by a muliplier.
     * @param scaleMultiplier How much the vector should be scaled.
     * @returns The scaled vector.
     */
    applyScale(scaleMultiplier: number): this {
        const newX = this.x * scaleMultiplier
        const newZ = this.z * scaleMultiplier

        this.x = newX
        this.z = newZ

        return this
    }

    /**
     * Normalise the vector
     * @returns The normalised vector
     */
    normalise() {
        const magnitude = Math.sqrt(this.x * this.x + this.z * this.z);
        if (magnitude !== 0) {
            this.x /= magnitude
            this.z /= magnitude
        }
        return this
    }
}