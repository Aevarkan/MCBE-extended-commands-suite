/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: terminal.ts
 * Author: Aevarkan
 */

import { CustomCommandParamType, Player, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
import { defineCommand, defineParameter } from "command-wrapper"
import { commandRegister } from "constants"

export function showTerminalScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    showTerminalForm(event.sourceEntity as Player)
}

/**
 * Shows a form to the player for executing commands.
 * @param player The player to show the form to.
 */
function showTerminalForm(player: Player) {
    const loreForm = new ModalFormData().title({translate: "ecs.command.terminal.title"})
    const lastUsedCommand = player.getDynamicProperty("lastTerminalCommand") as string

    // Command itself
    loreForm.textField({translate: "ecs.command.terminal.command_field"}, {translate: "ecs.command.terminal.command_placeholder"})

    // Last used command
    loreForm.textField({translate: "ecs.command.terminal.last_used_command_field"}, {translate: "ecs.command.terminal.no_commands_yet"}, { defaultValue: lastUsedCommand })

    // Delay
    loreForm.textField({translate: "ecs.command.terminal.delay_field_seconds"}, {translate: "ecs.command.terminal.delay_placeholder_seconds"}, { defaultValue: "0" })

    loreForm
        .show(player)
        .then(response => {

            // Don't run the command if backing out, and clear the history
            if (response.canceled) {
                player.setDynamicProperty("lastTerminalCommand", undefined)
                return
            }
            const formValues = response.formValues
            if (!formValues) throw new Error("No form response.")

            const command = formValues[0] as string
            const delaySeconds = parseFloat(formValues[2] as string) ?? 0

            const delayTicks = Math.round(delaySeconds * 20)

            // Save the command for the player
            player.setDynamicProperty("lastTerminalCommand", command)
            system.runTimeout(() => {
                player.runCommand(command)
            }, delayTicks)
        })
        .catch((error) => {
            console.error("Error showing terminal form: ", error)
        })
}

const playerParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.PlayerSelector,
    mandatory: false
})

const terminalCommand = defineCommand({
    name: "terminal",
    description: "Opens a command form.",
    parameters: [playerParam],
    successMessage: "Displayed terminal to target player(s).",
    failureMessage: "Terminal could not be shown.",
    callbackFunction(origin, targetPlayers?) {
        const sourceEntity = origin.sourceEntity

        // show terminal to target players
        if (targetPlayers) {
            system.run(() => {
                targetPlayers.forEach(player => {
                    showTerminalForm(player)
                })
            })
        }
        // show terminal to caller if no-one selected
        else if (sourceEntity instanceof Player) {
            system.run(() => {
                showTerminalForm(sourceEntity)
            })
        }
        // error otherwise
        else {
            return false
        }
    }
})

commandRegister.registerCommand(terminalCommand)
