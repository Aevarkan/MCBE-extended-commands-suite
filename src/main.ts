/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: main.ts
 * Author: Aevarkan
 */

import "./server/scriptEvents"
import "./server/rightClickDetection/rightClickDetection"
import "./server/rightClickDetection/rightClickDetectionv2"
import "./server/deathDetection/deathDetection"
import "./server/entityLock"

import "./server/lore/index"
import "./server/scoreboardStatuses/index"
import "./server/tagStatuses/index"

import "./server/versionCounter"

import { CURRENT_VERSION } from "constants"

console.info(`§aExtended Commands Suite §b${CURRENT_VERSION}§a loaded.§r`)