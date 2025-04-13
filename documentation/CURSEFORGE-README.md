# Introduction

If you're looking for right click detection, scroll down to `addusecommand`. Note that there are limitations regarding stackable items.

This is a stable addon, it shouldn't require an update to remain compatible with new Minecraft versions. This means it also doesn't require any experimental toggles.

Do you find yourself wishing Bedrock could do more with commands?

Well then you've come to the right place!

This command pack adds functionality you can find in Java, but not Bedrock, such as `/schedule` being able to actually schedule commands for later. It even adds commands that don't exist even in vanilla Java! Continue scrolling down to find out.

# Examples

To show you what is possible with this pack, I have some premade examples.

With the pack installed, do any of the following commands:

```minecraft
/function extendedcommands/examples/countdown
/function extendedcommands/examples/wind_push
/function extendedcommands/examples/horror
```

Do not use any of these example commands on your world/server as a substitute for your own. They can be changed/deleted without notice.

# Auxillary Features

ECS also tracks a few things via scoreboard:
- Entity Health
- Player Deaths
- Player Kills

The full list is as follows:

```
ecs:health
ecs:deaths
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

# List of all Commands

Not everything is possible with this addon. See [here](https://github.com/Aevarkan/MCBE-extended-commands-suite/blob/main/documentation/LIMITATIONS-README.md) for an incomplete list of things it cannot do.

Make use of the `/execute as` command to do these commands on other players. The commands here do not have selectors themselves.

All the commands here must be called via `/scriptevent`, each will have an unique identifier and a namespace, which is `ecs` / `cmd`.

For commands that accept commands themselves, [**do not put the slash in front of the command inside**](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable#runcommand).

## playmusic

This command has the exact same syntax as `/music`, but the difference being it only affects the music of one player.

**Syntax**: `/scriptevent ecs:playmusic <trackName: string> [volume: number] [fadeSeconds: number] [repeat: true/false]`

**Example:** `/scriptevent ecs:playmusic music.game.credits 1 2 true`

This plays the credits track for the player that executed the command after fading for 2 seconds. It will play at volume 1 and repeat after it's done.

## stopmusic

Stops the music track that is currently playing. It stops it abruptly, so it's recommended to use that above command and fade to another track.

**Syntax**: `/scriptevent ecs:stopmusic`

## scale

This command changes the size of **some** entities, most don't work. I've tested it with cats and rabbits.

Not all entities support this. You can edit the entity `.json` yourself, but I won't edit vanilla files in this pack as it will break compatibility.

I have made a [supplementary pack](https://github.com/Aevarkan/MCBE-scale-components) that adds scale components to all entities, **be warned it will very likely not be compatible with other addons**.

**Syntax**: `/scriptevent ecs:scale <scaleMultiplier: float>`

**Example**: `/scriptevent ecs:scale 1.5`

## push / motion

**Java doesn't have this one, at least not for players!**

This command pushes a player (and some entities, not including items).

**Syntax 1:** `/scriptevent ecs:push relative|rel|r [horizontalRotation: number/range] [horizontalStrength: number/range] [verticalStrength: number/range]`

**Example:** `/scriptevent ecs:push relative 90 3 5`

This pushes the entity 90 degrees to the right with a strength of 3 on the horizontal plane, and a strength of 5 upwards.

**Example:** `/scriptevent ecs:push relative -45:45 1:3 -5:5`

This pushes an entity between 45 degrees to the left and 45 degrees to the right with a horizontal strength between 1 and 3, and a vertical strength between -5 and 5.

If you put this in a repeating command block, it will sometimes push an entity left 45 degrees downwards, and sometimes right 45 degrees upwards.

**It takes a random number between the two you put around the colon.**

**Syntax 2:** `/scriptevent ecs:push absolute|abs|a [xVector: float] [yVector: float] [zVector: float]`

**Example:** `/scriptevent ecs:push abs 5 5:10 0`

This pushes an entity upwards and along the positive x direction.

**You must use the `:` colon character to separate a number range. Any other character will not work.**

## pushgliding

This is a special version of `push` that **only** affects `Players` that are gliding with an elytra.

It has the same syntax, but called using `/scriptevent ecs:pushgliding`.

## tpspawn

**Syntax**: `/scriptevent ecs:tpspawn`

Teleports a `Player` to their spawn point. If you've played Terraria, this is what the magic mirror does.

## freeze

This freezes a Player by stopping their camera movements, it doesn't change their velocity (it won't stop anyone from falling).

If used on an entity, it will mostly freeze them (they move very slowly, and they will fall slowly as well).

**Be careful when using this on entities, it is very performance intensive.** Using this on players doesn't affect performance.

**Syntax**: `/scriptevent ecs:freeze <timeTicks: int>`

**Example:** `/scriptevent ecs:freeze 600`

This freezes the entity for 30 seconds. A second is 20 `ticks`.

## chance

This executes a command sometimes.

**Syntax**: `/scriptevent ecs:chance <percentageChance: int> <command: string>`

**Example**: `/scriptevent ecs:chance 10 say LUCKY!!!`

This will make the source of the command say "LUCKY!!!" 10% of the time the command is run.

Note that if this is put into a command block, the source will be `Script Engine`, relative coordinates (~ or ^) will therefore not work.

## schedule

This brings the functionality of Java edition's `/schedule` to Bedrock.



**Syntax**: `/scriptevent ecs:schedule <timeTicks: int> <command: string>`

**Example:** `/scriptevent ecs:schedule 600 scriptevent cmd:push abs 0 10 0`

This will launch the entity which executed this command into the air when 30 seconds passes.

## multicommand

Does multiple commands at once, separated by a pipe `|`.

**Syntax**: `/scriptevent ecs:multicommand <command: string> | <another command: string>`

There is no theoretical limit to how many commands you can include, but I've only tested up to 3 commands simultaneously.

**I am not responsible if your game crashes from using hundreds of simultaneous commands.**

**Example**: `/scriptevent ecs:multicommand scriptevent cmd:push rel 0 5 5 | say I'm flying!`

This will push the entity that executed it forwards and up, whilst also saying "I'm flying".

## auc2

**NOTE**: The old command functionality still works, you can find the documentation [here](https://github.com/Aevarkan/MCBE-extended-commands-suite/blob/main/documentation/OLD-SCRIPTEVENTS-README.md).

The one you've been waiting for: This command lets you put use-command on any item.

**Syntax**: `/scriptevent ecs:auc2 <commandName: string> false <command: string>`

Let's say we put two use commands on a totem of undying.

**Example:**
```
/scriptevent ecs:auc2 give_effect false effect @s levitation 30 0 true
/scriptevent ecs:auc2 discard_item false clear @s totem_of_undying 0 1
```
This will delete the item when a player uses it and give that player levitation for 30 seconds with no particles.

You must put lore on the item first. This is how ECS handles item matching, if you change the lore, it will be recognised as a different item and any commands will stop working.

Don't make the command name similar to any items. The command is stored as <itemName><commandName>.

If you were to put a command named `flower` on a torch, it would end up being `minecraft:torchflower`, which **will** have conflicting functionality.

Fixing this will break existing commands, so it will be left for version 1.0.

## ruc2

This removes the use command from the item you're holding.

**Syntax**: `/scriptevent ecs:ruc2 <commandName: optional string>`

**Example 1**: `/scriptevent ecs:ruc2 give_effect`

This will remove the `give_effect` command put on the totem earlier.

**Example 2**: `/scriptevent ecs:ruc2`

This removes all commands on the item.

## adddeathcommand

This makes the entity run a command when it dies. Only one death command can be put on an entity.

**Syntax**: `/scriptevent ecs:adddeathcommand <command: string>`

**Example**: `/scriptevent ecs:adddeathcommand say AAAAAA`

This command will make the entity say "AAAAAA" in chat when it dies.

## removedeathcommand

This removes the death command.

**Syntax**: `/scriptevent ecs:removedeathcommand`

## setlore

Sets the lore on the item you're currently holding. Use `\n` to indicate a new line, note that you will need to apply formatting codes again on each new line.

You are limited to having 20 lines of lore with a maximum length of 50 each. See [here](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setlore) for why.

**Syntax**: `/scriptevent ecs:setlore <lore: string>`

**Example:** `/scriptevent ecs:setlore §9I have a pen\n§cI have an apple\n§9I have a pen\n§eI have pineapple`

## editlore

This is an interactive version of `setlore`.

**Syntax**: `/scriptevent ecs:editlore`

# Licence

This project is licenced under GPL-3.0, in short:

This means you can share, modify, and include it in your projects, as long as you give credit.

You, however, **cannot** distribute a proprietary (closed-source) version.

You must licence your project under GPL-3.0 and make the source code available if it includes a part of this pack.

## For Server Owners

You don't need to ask for my permission to put it on your server, this is already given as part of the licence.

If your players ask where the commands are from though, I'd appreciate you providing a link to either [MCPEDL](https://mcpedl.com/extended-commands-suite/), [CurseForge](https://www.curseforge.com/minecraft-bedrock/scripts/extended-commands-suite), or the [Github](https://github.com/Aevarkan/MCBE-extended-commands-suite) repository (This isn't required though).

## For Addon Creators

This licence allows you to use part of this pack in your own, however you **must** also:
- Make **your** source code available
- Give a link to this pack (MCPEDL, CurseForge, or Github)
- Licence your addon under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)

This means you **cannot** obfuscate your code if you include stuff from this pack in your addon.

# Other Stuff

You can find the source code and latest releases on [Github](https://github.com/Aevarkan/MCBE-extended-commands-suite) as well as older ones.