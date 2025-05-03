/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: function.ts
 * Author: Aevarkan
 */

/**
 * Checks if an array contains a string in an enum.
 */
export function checkEnumMatchString<T extends object>(array: string[], checkEnum: T): boolean {
    const enumValues = Object.values(checkEnum)

    const foundMatch = array.some(item =>
        enumValues.some(enumValue => item.includes(enumValue))
    )
    return foundMatch
}