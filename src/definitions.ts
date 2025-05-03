/**
 * This file is part of Extended Commands Suite which is released under GPL-3.0.
 * See file LICENCE or go to https://www.gnu.org/licenses/gpl-3.0.en.html for full licence details.
 * File: definitions.ts
 * Author: Aevarkan
 */

/**
 * Whether to remove all entries or just one.
 * If removing just one, the id is required.
 */
export type RemoveOptions =
    | { removeAll: true }
    | { removeAll: false; id: string }

/**
 * Supported dynamic lore variables.
 */
export enum DynamicLoreVariables {
    /**
     * @remarks
     * Current durability of an item.
     */
    Durability = "$DUR",
    /**
     * @remarks
     * The maximum durability of an item.
     */
    MaxDurability = "$MAX_DUR",
    /**
     * @remarks
     * The total number of players and entities killed whilst this item is held.
     */
    TotalKills = "$TOTAL_KILLS",
    /**
     * @remarks
     * The number of players killed whilst this item is held.
     */
    PlayerKills = "$PVP_KILLS",
    /**
     * @remarks
     * The number of non-player entities killed whilst this item is held.
     */
    EntityKills = "$PVE_KILLS",
    /**
     * @remarks
     * The number of blocks this item has broken.
     */
    BlocksBroken = "$BLOCKS_BROKEN"
}

export interface ReplacementLore {
    [DynamicLoreVariables.Durability]: string,
    [DynamicLoreVariables.MaxDurability]: string,
    [DynamicLoreVariables.PlayerKills]: string,
    [DynamicLoreVariables.EntityKills]: string,
    [DynamicLoreVariables.TotalKills]: string,
    [DynamicLoreVariables.BlocksBroken]: string,
}