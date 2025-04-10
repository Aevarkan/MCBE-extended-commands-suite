# Introduction
Github repository for the Extended Commands Suite pack.

This is a stable addon, it shouldn't require an update to remain compatible with new Minecraft versions.

If you've arrived here from [MCPEDL](https://mcpedl.com/extended-commands-suite/) or [CurseForge](https://www.curseforge.com/minecraft-bedrock/scripts/extended-commands-suite) looking for a newer release, then you're in the right place! Github will **always** have the most up to date version of this pack (it's where I build the pack), although I will try my best to keep MCPEDL and CurseForge updated.

If this is your first time on Github, the download button is called **Releases** and should be on the right-hand side of your screen on both mobile and desktop. Click on the **assets** sections of a release and the `.mcpack` should be there for you to download.

> [!NOTE]
> You will not find the JavaScript files inside of this repository, they must be transcompiled from TypeScript. Github does this automatically when I make a release. Please do not put TypeScript files into your Minecraft installation, they will not work.

Continue scrolling down for more information on how to use the commands in the pack.

# Examples

To show you what is possible with this pack, I have some premade examples.

With the pack installed, do any of the following commands:

```minecraft
/function extendedcommands/examples/countdown
/function extendedcommands/examples/wind_push
/function extendedcommands/examples/horror
```

The example commands are inside of [this](functions/extendedcommands/examples/) folder.

# List of all Commands

Not everything is possible with this addon. See [here](#LIMITATIONS-README.md) for a list of things it cannot do.

<sup>The scriptevents are defined in [this](src/scriptEvents.ts) file.</sup>

> [!TIP]
> Make use of the `/execute as` command to do these commands on other players/entities. The commands here do not have selectors themselves.

> [!NOTE]
> All the commands here must be called via `/scriptevent`, each will have an unique identifier and a namespace, which is `ecs` / `cmd`. Any scriptevent called with `/scriptevent ecs:` can also be called with `/scriptevent cmd:`.

## `playmusic`
This command has the exact same syntax as `/music`, but the difference being it only affects the music of one player.

**Syntax**: `/scriptevent ecs:playmusic <trackName: string> [volume: number] [fadeSeconds: number] [repeat: boolean]`

**Example:** `/scriptevent ecs:playmusic music.game.credits 1 2 true`

This plays the credits track for the player that executed the command after fading for 2 seconds. It will play at volume 1 and repeat after it's done.

## `stopmusic`

Stops the music track that is currently playing. It stops the track abruptly, so I recommended to use `playmusic` and fade to another track such as `music.game`.

**Syntax**: `/scriptevent ecs:stopmusic`

## `scale`

This command changes the size of **some** entities, most don't work. I've tested it with cats and rabbits.

> [!IMPORTANT]
> Not all entities support this. You can edit the entity `.json` yourself, but I won't edit vanilla files.
>
> You can get the entity `.json` files [here](https://github.com/Mojang/bedrock-samples/tree/main/behavior_pack/entities).

**Syntax**: `/scriptevent ecs:scale <scaleMultiplier: float>`

**Example**: `/scriptevent ecs:scale 1.5`

## `push` / `motion`

This command pushes a player (and most entities, not including items).

### Relative Motion

**Syntax 1:** `/scriptevent ecs:push relative|rel|r [horizontalRotation: number|range] [horizontalStrength: number|range] [verticalStrength: number|range]`

**Example:** `/scriptevent ecs:push relative 90 3 5`

This pushes the entity 90 degrees to the right of where it's looking with a strength of 3 on the horizontal plane, and an upwards strength of 5.

> [!TIP]
> You can input ranges into this command! See the example below.

**Example:** `/scriptevent ecs:push relative -45:45 1:3 -5:5`

This pushes an entity between 45 degrees to the left and 45 degrees to the right with a horizontal strength between 1 and 3, and a vertical strength between -5 and 5. A negative strength will push the entity down.

### Absolute Motion

You can also use absolute coordinates to push an entity. Absolute coordinates don't factor in where the entity is looking.

**Syntax 2:** `/scriptevent ecs:push absolute|abs|a [xVector: float] [yVector: float] [zVector: float]`

**Example:** `/scriptevent ecs:push abs 5 5:10 0`

This pushes an entity upwards and along the positive x direction.

> [!IMPORTANT]
> You must use the `:` colon character to separate a number range. Any other character will not work.

## `pushgliding`

This is a special version of `push` that **only** affects `Players` that are gliding with an elytra.

It has the same syntax, but called using `/scriptevent ecs:pushgliding`.

## `tpspawn`

**Syntax**: `/scriptevent ecs:tpspawn`

Teleports a `Player` to their spawn point. If you've played Terraria, this is what the magic mirror does.

## `freeze`

This freezes a Player by stopping their camera movements, it doesn't change their velocity (it won't stop anyone from falling).

If used on an entity, it will mostly freeze them (they move very slowly, and they will fall slowly as well). 

> [!CAUTION]
> Be careful when using this on entities, it is very performance intensive. Using this on players doesn't affect performance as it only freezes their camera. 

**Syntax**: `/scriptevent ecs:freeze <timeTicks: int>`

**Example:** `/scriptevent ecs:freeze 600`

This freezes the entity for 30 seconds. A second is 20 `ticks`.

## `schedule`

This brings the functionality of Java edition's `/schedule` to Bedrock.

> [!WARNING]
> [Do not put the slash in front of the command inside](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable#runcommand).

**Syntax**: `/scriptevent ecs:schedule <timeTicks: int> <command: string>`

**Example:** `/scriptevent ecs:schedule 600 scriptevent cmd:push abs 0 10 0`

This will launch the entity which executed this command into the air when 30 seconds passes.

## `multicommand`

Does multiple commands at once, separated by a pipe `|`.

**Syntax**: `/scriptevent ecs:multicommand <command: string> | <another command: string>`

> [!NOTE]
> There is no theoretical limit to how many commands you can include, but I've only tested up to 3 commands simultaneously.
>
> I am not responsible if your game crashes from using 100 simultaneous commands.

**Example**: `/scriptevent ecs:multicommand scriptevent cmd:push rel 0 5 5 | say I'm flying!`

This will push the entity that executed it forwards and up, whilst also saying "I'm flying". 

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

## `adddeathcommand`

This makes the entity run a command when it dies. Only one death command can be put on an entity.

**Syntax**: `/scriptevent ecs:adddeathcommand <command: string>`

**Example**: `/scriptevent ecs:adddeathcommand say AAAAAA`

This command will make the entity say "AAAAAA" in chat when it dies.

## `removedeathcommand`

This removes the death command.

**Syntax**: `/scriptevent ecs:removedeathcommand`

## `setlore`

Sets the lore on the item you're currently holding. Use `\n` to indicate a new line, note that you will need to apply formatting codes again on each new line.

You are limited to having 20 lines of lore with a maximum length of 50 each. See [here](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setlore) for why.

**Syntax**: `/scriptevent ecs:setlore <lore: string>`

**Example:** `/scriptevent ecs:setlore §9I have a pen\n§cI have an apple\n§9I have a pen\n§eI have pineapple`

# Licence

This project is licenced under GPL-3.0, in short:

This means you can share, modify, and include it in your projects, as long as you give credit.

You, however, **cannot** distribute a proprietary (closed-source) version.

You must licence your project under GPL-3.0 and make the source code availabe if it includes a part of this pack.