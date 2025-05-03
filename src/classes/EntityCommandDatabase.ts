/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: EntityCommandDatabase.ts
 * Author: Aevarkan
 */

import { Entity } from "@minecraft/server"
import { DEATH_COMMAND_PREFIX, EMOTE_COMMAND_PREFIX, JUMP_COMMAND_PREFIX } from "constants"

/**
 * Stores commands for an entity.
 */
export class EntityCommandDatabase {

    entity: Entity

    /**
     * Creates a new database viewer for an entity.
     * @param entity
     */
    constructor(entity: Entity) {
        this.entity = entity
    }

    /**
     * #################################
     * ######## DEATH DETECTION ########
     * #################################
     */

    /**
     * Adds a death command entry to an entity.
     * @param command The command the entity will run once killed.
     * @param commandId The identifier for the command.
     */
    addDeathCommandEntry(command: string, commandId: string) {
        const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`

        const correctCommand = command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)
    
        this.entity.setDynamicProperty(fullDeathCommandId, correctCommand)
    }

    /**
     * Removes an entity's death command.
     * @param commandId The identifier for the command.
     */
    removeDeathCommandEntry(commandId: string) {
        const fullDeathCommandId = `${DEATH_COMMAND_PREFIX}${commandId}`
    
        this.entity.setDynamicProperty(fullDeathCommandId, undefined)
    }

    removeAllDeathCommandEntries() {
        const allDeathCommandIds = this.getAllDeathCommandEntryIds()
    
        allDeathCommandIds.forEach(id => {
            this.removeDeathCommandEntry(id)
        })
    }

    /**
     * Gets all death command ids on an entity.
     * @returns A string array of ids, including the prefix.
     */
    getAllDeathCommandEntryIds() {
        const allKeys = this.entity.getDynamicPropertyIds()
        const allDeathCommandIds = allKeys.filter(item => item.startsWith(DEATH_COMMAND_PREFIX))
        return allDeathCommandIds
    }
    
    /**
     * Gets a death command for an entity.
     * @param deathCommandKey The identifier of the death command, including the prefix.
     * @returns The command string.
     */
    getDeathCommandEntry(deathCommandKey: string) {
        // const fullId = `${DEATH_COMMAND_PREFIX}${deathCommandKey}`
        const command = this.entity.getDynamicProperty(deathCommandKey) as string
        return command
    }

    /**
     * #################################
     * ######## EMOTE DETECTION ########
     * #################################
     */

    /**
     * Adds an emote command entry to an entity.
     * @param command The command the entity will run once on emoting.
     * @param commandId The identifier for the command.
     */
    addEmoteCommandEntry(command: string, commandId: string) {
        const fullEmoteCommandId = `${EMOTE_COMMAND_PREFIX}${commandId}`

        const correctCommand = command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)
    
        this.entity.setDynamicProperty(fullEmoteCommandId, correctCommand)
    }

    /**
     * Removes an entity's emote command.
     * @param commandId The identifier for the command.
     */
    removeEmoteCommandEntry(commandId: string) {
        const fullEmoteCommandId = `${EMOTE_COMMAND_PREFIX}${commandId}`
    
        this.entity.setDynamicProperty(fullEmoteCommandId, undefined)
    }

    removeAllEmoteCommandEntries() {
        const allEmoteCommandIds = this.getAllEmoteCommandEntryIds()
    
        allEmoteCommandIds.forEach(id => {
            this.removeEmoteCommandEntry(id)
        })
    }

    /**
     * Gets all emote command ids on an entity.
     * @returns A string array of ids, including the prefix.
     */
    getAllEmoteCommandEntryIds() {
        const allKeys = this.entity.getDynamicPropertyIds()
        const allEmoteCommandIds = allKeys.filter(item => item.startsWith(EMOTE_COMMAND_PREFIX))
        return allEmoteCommandIds
    }
    
    /**
     * Gets an emote command for an entity.
     * @param emoteCommandKey The identifier of the death command, including the prefix.
     * @returns The command string.
     */
    getEmoteCommandEntry(emoteCommandKey: string) {
        // const fullId = `${EMOTE_COMMAND_PREFIX}${emoteCommandKey}`
        const command = this.entity.getDynamicProperty(emoteCommandKey) as string
        return command
    }

    /**
     * ################################
     * ######## JUMP DETECTION ########
     * ################################
     */

    /**
     * Adds a jump command entry to an entity.
     * @param command The command the entity will run once on emoting.
     * @param commandId The identifier for the command.
     */
    addJumpCommandEntry(command: string, commandId: string) {
        const fullJumpCommandId = `${JUMP_COMMAND_PREFIX}${commandId}`

        const correctCommand = command.replace(/@([ASREP])/g, (_match, matchingPart) => `@${matchingPart.toLowerCase()}`)
    
        this.entity.setDynamicProperty(fullJumpCommandId, correctCommand)
    }

    /**
     * Removes an entity's jump command.
     * @param commandId The identifier for the command.
     */
    removeJumpCommandEntry(commandId: string) {
        const fullJumpCommandId = `${JUMP_COMMAND_PREFIX}${commandId}`
    
        this.entity.setDynamicProperty(fullJumpCommandId, undefined)
    }

    removeAllJumpCommandEntries() {
        const allJumpCommandIds = this.getAllEmoteCommandEntryIds()
    
        allJumpCommandIds.forEach(id => {
            this.removeEmoteCommandEntry(id)
        })
    }

    /**
     * Gets all jump command ids on an entity.
     * @returns A string array of ids, including the prefix.
     */
    getAllJumpCommandEntryIds() {
        const allKeys = this.entity.getDynamicPropertyIds()
        const allJumpCommandIds = allKeys.filter(item => item.startsWith(JUMP_COMMAND_PREFIX))
        return allJumpCommandIds
    }
    
    /**
     * Gets an jump command for an entity.
     * @param jumpCommandKey The identifier of the jump command, including the prefix.
     * @returns The command string.
     */
    getJumpCommandEntry(jumpCommandKey: string) {
        // const fullId = `${JUMP_COMMAND_PREFIX}${jumpCommandKey}`
        const command = this.entity.getDynamicProperty(jumpCommandKey) as string
        return command
    }
}
