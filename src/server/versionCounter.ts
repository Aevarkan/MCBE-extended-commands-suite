/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: versionCounter.ts
 * Author: Aevarkan
 */

import { world } from "@minecraft/server";
import { CURRENT_VERSION } from "constants";

// Future proofing
const previousVersion = world.getDynamicProperty("ecs_version") as string

world.setDynamicProperty("ecs_version", CURRENT_VERSION)