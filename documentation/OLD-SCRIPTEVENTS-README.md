## `addusecommand` / `auc`

> [!IMPORTANT]
> You can only add one command per item, use `multicommand` to add more.

The one you've been waiting for: This command lets you put a command on a **non-stackable** item.

See [here](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setdynamicproperty) for why it only works for non-stackable items.

> [!NOTE]
> There is a workaround to get commands on stackable items. Install an NBT editor such as [NBT Workbench](https://github.com/RealRTTV/nbtworkbench), and make a structure that contains the stackable item and edit the dynamic property manually.
>
> Export one of the items that has a command from this pack as a structure for a reference on what you need to change. You should see a dynamic property section which contains `280232d4-f31d-4849-a42c-ce77e6870e30`.
>
> If you're up to this point, I trust that you will be able to do the rest. If not, then I may have to update these instructions.

> [!CAUTION]
> Be very careful with what command you decide to put on an item. You very likely will not be able to remove it if other players get their hands on it if you haven't set up a safeguard beforehands. See [`removeusecommand`](#removeusecommand) for why.

**Syntax**: `/scriptevent ecs:addusecommand <command: string>`

Let's say we put use this command on a totem of undying.

**Example:** `/scriptevent ecs:addusecommand scriptevent ecs:multicommand effect @s levitation 30 0 true | clear @s totem_of_undying 0 1`

This will delete the item when a player uses it and give that player levitation for 30 seconds with no particles.

## `removeusecommand` / `ruc`

This removes the use command **only** from the item you're holding. It doesn't remove it from other items. 

> [!IMPORTANT]
> The commands are stored in the item itself, you can just remove this item normally. This means you cannot remove command functionality from other players remotely however.

**Syntax**: `/scriptevent ecs:removeusecommand`