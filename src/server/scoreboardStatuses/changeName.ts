/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: death.ts
 * Author: Aevarkan
 */

import { DisplaySlotId, ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server";

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
    const originalDisplaySlot = getDisplaySlot(objectiveId)
    world.scoreboard.removeObjective(objectiveId)

    const newScoreboardObjective = world.scoreboard.addObjective(objectiveId, newDisplayName)
    if (originalDisplaySlot) {
        world.scoreboard.setObjectiveAtDisplaySlot(originalDisplaySlot, {objective: newScoreboardObjective})
    }

    allScores.forEach(scoreInfo => {
        const participant = scoreInfo.participant
        const score = scoreInfo.score
        newScoreboardObjective.setScore(participant, score)
    })
}

function getDisplaySlot(objectiveId: string): DisplaySlotId | undefined {
    const comparisonObjective = world.scoreboard.getObjective(objectiveId)
    
    // This will have to be updated if there are more display slots!
    let displaySlot: DisplaySlotId
    const belownameDisplay = world.scoreboard.getObjectiveAtDisplaySlot(DisplaySlotId.BelowName)
    const sidebarDisplay = world.scoreboard.getObjectiveAtDisplaySlot(DisplaySlotId.Sidebar)
    const listDisplay = world.scoreboard.getObjectiveAtDisplaySlot(DisplaySlotId.List)

    // Checks each slot (Pretty sure this can be put in a loop but I'm too tired to do so)
    if (belownameDisplay) {
        const belownameObjective = belownameDisplay.objective
        if (comparisonObjective === belownameObjective) {
            displaySlot = DisplaySlotId.BelowName
        }
    }
    if (sidebarDisplay) {
        const sidebarObjective = sidebarDisplay.objective
        if (comparisonObjective === sidebarObjective) {
            displaySlot = DisplaySlotId.Sidebar
        }
    }
    if (listDisplay) {
        const listObjective = listDisplay.objective
        if (comparisonObjective === listObjective) {
            displaySlot = DisplaySlotId.List
        }
    }

    return displaySlot
}