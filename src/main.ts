/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: main.ts
 * Author: Aevarkan
 */

import { CommandRegister } from "library/classes/CommandRegister"
import "./index"

// Commands are registered after everything else is loaded
CommandRegister._registerCommands()

import { CURRENT_VERSION } from "constants"

console.info(`\x1b[92mExtended Commands Suite \x1b[36m${CURRENT_VERSION}\x1b[92m loaded.\x1b[0m`)