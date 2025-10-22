/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: keepInventory.ts
 * Author: Aevarkan
 */

import { EntityComponentTypes, EntityInventoryComponent, EquipmentSlot, Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { COMMAND_SUCESS_SOUND } from "constants";

export function setKeepInventoryScriptEvent(event: ScriptEventCommandMessageAfterEvent) {
    const player = event.sourceEntity
    const message = event.message
    const parts = message.split(" ")

    if (!(player instanceof Player)) return

    // Uses the player message or toggles if there isn't one
    let keepInventory = parts.length > 0 && parts[0].toLowerCase() === "true" ? true : false
    let hideMessage = parts.length > 1 && parts[1].toLowerCase() === "true" ? true : false
    const currentKeepStatus = player.getDynamicProperty("keepInventory") as boolean ?? false

    if (message.length === 0) {
        keepInventory = !currentKeepStatus
    }

    setKeepInventory(player, keepInventory, hideMessage)
}

/**
 * Turns keep inventory on/off for a player.
 * @param player The player.
 * @param keepInventory Whether to turn keep inventory on or off.
 * @param hideMessage Whether or not to show command feedback.
 */
function setKeepInventory(player: Player, keepInventory: boolean, hideMessage: boolean) {
    const playerInventoryComponent = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent
    const playerInventory = playerInventoryComponent.container
    const inventorySize = playerInventory.size

    for (let i = 0; i < inventorySize; i++) {
        const slot = playerInventory.getSlot(i)
        // It gives an error if there's no item
        if (slot.hasItem()){
            slot.keepOnDeath = keepInventory
        }
    }
    // console.log("Step 2")

    const equipmentComponent = player.getComponent(EntityComponentTypes.Equippable)

    // This sets the mainhand slot twice as it'll be in EquipmentSlot as well, but that shouldn't matter
    const equipmentSlots = Object.values(EquipmentSlot)
    equipmentSlots.forEach(equipmentSlot => {
        const slot = equipmentComponent.getEquipmentSlot(equipmentSlot)
        // It gives an error if there's no item
        if (slot.hasItem()){
            slot.keepOnDeath = keepInventory
        }
    })

    // Dynamic property to store this state.
    player.setDynamicProperty("keepInventory", keepInventory)

    if (hideMessage) return

    if (keepInventory) {
        player.sendMessage({translate: "ecs.command.keepinventory.on"})
        player.playSound(COMMAND_SUCESS_SOUND)
    } else {
        player.sendMessage({translate: "ecs.command.keepinventory.off"})
        player.playSound(COMMAND_SUCESS_SOUND)
    }
    
}