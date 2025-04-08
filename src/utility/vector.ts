/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full license details.
 * File: vectors.ts
 * Author: Aevarkan
 */

export class Vector2D {
    
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
        const newY = this.x * Math.sin(angleRadians) + this.z * Math.cos(angleRadians)
        
        this.x = newX
        this.z = newY

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