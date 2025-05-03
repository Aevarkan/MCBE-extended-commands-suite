/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: index.ts
 * Author: Aevarkan
 */

import "./server/scriptEvents"
import "./server/entityLock"

import "./server/CommandDetections/rightClickDetection/rightClickDetection"
import "./server/CommandDetections/rightClickDetection/rightClickDetectionv2"
import "./server/CommandDetections/deathDetection/deathDetection"
import "./server/CommandDetections/emoteDetection/emoteDetection"
import "./server/CommandDetections/jumpDetection/jumpDetection"
import "./server/CommandDetections/punchDetection/punchDetection"
import "./server/CommandDetections/interactDetection/interactDetection"

import "./server/lore/index"
import "./server/scoreboardStatuses/index"
import "./server/tagStatuses/index"

import "./server/versionCounter"