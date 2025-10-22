/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: index.ts
 * Author: Aevarkan
 */

import "./server/scriptEvents"
import "./server/commands/entityLock"
import "./server/commands/index"

import "./server/commandDetections/rightClickDetection/rightClickDetection"
import "./server/commandDetections/rightClickDetection/rightClickDetectionv2"
import "./server/commandDetections/deathDetection/deathDetection"
import "./server/commandDetections/emoteDetection/emoteDetection"
import "./server/commandDetections/jumpDetection/jumpDetection"
import "./server/commandDetections/punchDetection/punchDetection"
import "./server/commandDetections/interactDetection/interactDetection"

import "./server/lore/index"
import "./server/scoreboardStatuses/index"
import "./server/tagStatuses/index"

import "./server/versionCounter"