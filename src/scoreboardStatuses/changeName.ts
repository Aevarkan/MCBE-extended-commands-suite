/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: death.ts
 * Author: Aevarkan
 */

import { ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server";

export function setScoreboardNameScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const parameters = event.message
    const parts = parameters.split(" ")

    const scoreboardId = parts[0]
    const scoreboardDisplayName = parts.slice(1).join(" ")
    setScoreboardName(scoreboardId, scoreboardDisplayName)
}

/**
 * Changes the display name of a scoreboard.
 * @param objectiveId The id of the scoreboard objective.
 * @param newDisplayName The new display name for the scoreboard.
 * @remarks Cannot be called in read-only mode.
 * @remarks May be dangerous since it removes a scoreboard.
 */
function setScoreboardName(objectiveId: string, newDisplayName?: string) {
    const originalScoreboardObjective = world.scoreboard.getObjective(objectiveId)
    const allScores = originalScoreboardObjective.getScores()
    world.scoreboard.removeObjective(objectiveId)

    const newScoreboardObjective = world.scoreboard.addObjective(objectiveId, newDisplayName)

    allScores.forEach(scoreInfo => {
        const participant = scoreInfo.participant
        const score = scoreInfo.score
        newScoreboardObjective.setScore(participant, score)
    })
}
