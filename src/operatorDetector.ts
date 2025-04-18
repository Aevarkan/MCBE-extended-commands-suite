/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: operatorDetector.ts
 * Author: Aevarkan
 */

import { world } from "@minecraft/server";
import { ADMIN_TAG, READ_ONLY_ADMIN_TAG } from "constants";

world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player
    const hasAdminTag = player.hasTag(READ_ONLY_ADMIN_TAG)
    const hasECSTag = player.hasTag(ADMIN_TAG)

    // Don't know if it's possible yet to detect operators
    // const isOperator = player.
    
    if (hasECSTag) return

    if (hasAdminTag) {
        player.addTag(ADMIN_TAG)
    }
})