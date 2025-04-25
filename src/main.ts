/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: main.ts
 * Author: Aevarkan
 */

import "./scriptEvents"
import "./rightClickDetection/rightClickDetection"
import "./rightClickDetection/rightClickDetectionv2"
import "./deathDetection/deathDetection"
import "./scoreboardStatuses/index"
import "./entityLock"
import "./lore/index"


import "./versionCounter"

import { CURRENT_VERSION } from "constants"

console.info(`Extended Commands Suite ${CURRENT_VERSION} loaded.`)