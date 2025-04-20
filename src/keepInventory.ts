/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: keepInventory.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, Player } from "@minecraft/server";

function setKeepInventoryAction(player: Player, keepInventory: boolean) {
    const playerInventory = player.getComponent(EntityComponentTypes.Inventory).container
    const inventorySize = playerInventory.size - 1 // Arrays start at 0

    for (let i: number; i < inventorySize; i++) {
        const item = playerInventory.getItem(i)
        item.keepOnDeath = keepInventory
    }

    // Must also do offhand and armour slots
}