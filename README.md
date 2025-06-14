# Introduction
Github repository for the Extended Commands Suite pack.

This is a stable addon, it shouldn't require an update to remain compatible with new Minecraft versions.

> [!IMPORTANT]
> I make it a priority to not break commands if it's not neccessary. You can find the list of breaking changes [here](documentation/BREAKING-CHANGES.md).

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

# Auxillary Features

ECS also tracks a few things via scoreboard such as:
- Entity Health
- Player Deaths
- Player Kills

The full list is as follows:

```
ecs:health
ecs:deaths
ecs:max_render_distance
ecs:blocks_broken
ecs:blocks_placed
ecs:combined_total_kills
ecs:pvp_total_kills
ecs:pve_total_kills
ecs:combined_melee_kills
ecs:pvp_melee_kills
ecs:pve_melee_kills
ecs:combined_ranged_kills
ecs:pvp_ranged_kills
ecs:pve_ranged_kills
ecs:combined_magic_kills
ecs:pve_magic_kills
ecs:pvp_magic_kills
ecs:pvp_deaths
```

Player information is also tracked via tags:

```
ecs:is_sneaking
ecs:is_jumping
ecs:device_pc
ecs:device_console
ecs:device_mobile
ecs:input_keyboard
ecs:input_gamepad
ecs:input_motion_controller
ecs:input_touch
```

# List of all Commands

Not everything is possible with this addon. See [here](documentation/LIMITATIONS-README.md) for a list of things it cannot do.

<sup>The scriptevents are defined in [this](src/scriptEvents.ts) file.</sup>

> [!TIP]
> Make use of the `/execute as` command to do these commands on other players/entities. The commands here do not have selectors themselves.

> [!NOTE]
> All the commands here must be called via `/scriptevent`, each will have an unique identifier and a namespace, which is `ecs` / `cmd`. Any scriptevent called with `/scriptevent ecs:` can also be called with `/scriptevent cmd:`.

> [!WARNING]
> For commands that accept commands themselves, [do not put the slash in front of the command inside](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable#runcommand).

## `playmusic`
This command has the exact same syntax as `/music`, but the difference being it only affects the music of one player.

**Syntax**: `/scriptevent ecs:playmusic <trackName: string> [volume: number] [fadeSeconds: number] [repeat: boolean]`

**Example:** `/scriptevent ecs:playmusic music.game.credits 1 2 true`

This plays the credits track for the player that executed the command after fading for 2 seconds. It will play at volume 1 and repeat after it's done.

## `stopmusic`

Stops the music track that is currently playing. It stops the track abruptly, so I recommended to use `playmusic` and fade to another track such as `music.game`.

**Syntax**: `/scriptevent ecs:stopmusic`

## `scoreboardname`

> [!CAUTION]
> Only use this on scoreboard objectives that only have players, otherwise the score will be wiped.
>
> This is because the command, in the background, deletes the scoreboard and replaces it with a new one.

**Syntax**: `/scriptevent ecs:scoreboardname <scoreboardId: string> <newScoreboardName: string>`

**Example**: `/scriptevent ecs:scoreboardname ecs:combined_total_kills Highest Kills`

This sets the display name of `ecs:combined_total_kills` to "Highest Kills".

> [!IMPORTANT]
> Since this is a dangerous command, use it on a test scoreboard every Minecraft update before using it on your actual scoreboards.

## `scale`

This command changes the size of **some** entities, most don't work. I've tested it with cats and rabbits.

> [!IMPORTANT]
> Not all entities support this. You can edit the entity `.json` yourself, but I won't edit vanilla files in this pack as it will break compatibility.
>
> I have made a [supplementary pack](https://github.com/Aevarkan/MCBE-ECS-supplementary-pack) that adds scale components to all entities, **be warned it will very likely not be compatible with other addons**.

**Syntax**: `/scriptevent ecs:scale <scaleMultiplier: float>`

**Example**: `/scriptevent ecs:scale 1.5`

## `shoot`

This command let's you shoot projectiles.

> [!IMPORTANT]
> Not all projectiles support this. 
>
> You can use the same [supplementary pack](https://github.com/Aevarkan/MCBE-ECS-supplementary-pack) to allow projectiles such as the Ender Dragon's fireball to work with this command, **again, be aware it will very likely not be compatible with other addons**.

**Syntax**: `/scriptevent ecs:shoot <projectileId: string> <strength: float>`

**Example**: `/scriptevent ecs:shoot minecraft:arrow 10`

This shoots an arrow in the direction you're facing at a high speed!

This works on entities, but it may be difficult to get them to face the correct way.

## `lock`

Locks an entity from player interaction. Mostly useful for armour stands.

**Syntax**: `/scriptevent ecs:lock`

Make sure you're facing the entity!

You can also give it the tag `ecs:locked_entity` (This is what the command does anyway)

## `unlock`

Unlocks an entity from player interaction.

**Syntax**: `/scriptevent ecs:unlock`

Make sure you're facing the entity!

Again, you can just remove the tag `ecs:locked_entity`.

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

## `chance`

This executes a command sometimes.

**Syntax**: `/scriptevent ecs:chance <percentageChance: int> <command: string>`

**Example**: `/scriptevent ecs:chance 10 say LUCKY!!!`

This will make the entity that executed the command say "LUCKY!!!" 10% of the time the command is run.

> [!NOTE]
> If this is put into a command block, the source will be `Script Engine`, relative coordinates (~ or ^) will therefore not work.

## `drop`

This makes an entity drop an item.

**Syntax**: `/scriptevent ecs:drop <itemTypeId: string> <itemQuantity: int>`

**Example**: `/scriptevent ecs:drop minecraft:tnt 64`

This makes the entity drop a stack of tnt.

> [!TIP]
> You can combine this with a [death command](#adddeathcommand--adc) and [chance](#chance) to make custom drops.

## `schedule`

This brings the functionality of Java edition's `/schedule` to Bedrock.

**Syntax**: `/scriptevent ecs:schedule <timeTicks: int> <command: string>`

**Example:** `/scriptevent ecs:schedule 600 scriptevent cmd:push abs 0 10 0`

This will launch the entity which executed this command into the air when 30 seconds passes.

> [!NOTE]
> This doesn't work with command blocks, use the built in tick delay instead.

## `multicommand`

Does multiple commands at once, separated by a pipe `|`. Don't use this if you don't have to, will likely be removed in the future.

**Syntax**: `/scriptevent ecs:multicommand <command: string> | <another command: string>`

> [!NOTE]
> There is no theoretical limit to how many commands you can include, but I've only tested up to 3 commands simultaneously.
>
> I am not responsible if your game crashes from using 100 simultaneous commands.

**Example**: `/scriptevent ecs:multicommand scriptevent cmd:push rel 0 5 5 | say I'm flying!`

This will push the entity that executed it forwards and up, whilst also saying "I'm flying". 

## `addusecommand2` / `auc2`

> [!NOTE]
> The old command functionality still works, you can find the documentation [here](documentation/OLD-SCRIPTEVENTS-README.md).

The one you've been waiting for: This command lets you put use-command on any item.

**Syntax**: `/scriptevent ecs:auc2 <commandName: string> <enableFarmode: boolean> <command: string>`

> [!NOTE]
> In farmode, **you** do not run the command, meaning commands like `/effect` will not work.

Let's say we put two use commands on a totem of undying.

**Example 1:**
```
/scriptevent ecs:auc2 give_effect false effect @s levitation 30 0 true
/scriptevent ecs:auc2 discard_item false clear @s totem_of_undying 0 1
```
This will delete the item when a player uses it and give that player levitation for 30 seconds with no particles.

**Example 2:**
```
/scriptevent ecs:auc2 tnt true summon tnt
```
This will summon tnt at the block you're looking at when you use the item.

> [!IMPORTANT]
> You must put lore on the item first. This is how ECS handles item matching, if you change the lore, it will be recognised as a different item and any commands will stop working.

## `removeusecommand2` / `ruc2`

This removes the use command from the item you're holding.

**Syntax**: `/scriptevent ecs:ruc2 <commandName: optional string>`

**Example 1**: `/scriptevent ecs:ruc2 give_effect`

This will remove the `give_effect` command put on the totem earlier.

**Example 2**: `/scriptevent ecs:ruc2`

This removes all commands on the item.

## `adddeathcommand` / `adc`

This makes the entity run a command when it dies.

**Syntax**: `/scriptevent ecs:adddeathcommand <commandId: string> <command: string>`

**Example**: `/scriptevent ecs:adc death_sound say AAAAAA`

This command will make the entity say "AAAAAA" in chat when it dies.

## `removedeathcommand` / `rdc`

This removes a death command. If no command id is specified, it deletes all of them.

**Syntax**: `/scriptevent ecs:removedeathcommand <commandId: string>`

**Example**: `/scriptevent ecs:rdc death_sound`

This removes the `death_sound` command we put on entity earlier.

## `setlore`

Sets the lore on the item you're currently holding. Use `\n` to indicate a new line, note that you will need to apply formatting codes again on each new line.

You are limited to having 20 lines of lore with a maximum length of 50 each. See [here](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setlore) for why.

**Syntax**: `/scriptevent ecs:setlore <lore: string>`

**Example 1:** `/scriptevent ecs:setlore §9I have a pen\n§cI have an apple\n§9I have a pen\n§eI have pineapple`

**Example 2:** `/scriptevent ecs:setlore §rHi, my durability is §b$DUR§r out of §4$MAX_DUR§r!\n§rI have §a$DUR§r HP!§r`

In the second example, the variables $DUR and $MAX_DUR will be replaced with their actual values once you use the item. See [dynamic lore](#dynamic-lore) for more information.


> [!IMPORTANT]
> Dynamic lore only works on non-stackable items!

## `editlore`

This is an interactive version of `setlore`.

**Syntax**: `/scriptevent ecs:editlore`

![Interactive Lore Command Screenshot](documentation/interactive-lore-command.png)

## Dynamic Lore

Dynamic lore automatically updates on an item.

> [!NOTE]
> Item commands made with [auc2](#addusecommand2--auc2) will still work!

There are several properties tracked for an item:

```
$DUR
$MAX_DUR
$TOTAL_KILLS
$PVP_KILLS
$PVE_KILLS
$BLOCKS_BROKEN
```

![Dynamic Lore Example](documentation/dynamic-lore-example.png)

You can get rid of `Has Customised Properties` by doing `/gamerule showtags false`.

# Licence

This project is licenced under GPL-3.0, in short:

This means you can share, modify, and include it in your projects, as long as you give credit.

You, however, **cannot** distribute a proprietary (closed-source) version.

You must licence your project under GPL-3.0 and make the source code available if it includes a part of this pack.
