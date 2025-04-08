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

# List of all Commands

Make use of the `/execute as` command to do these commands on other players. The commands here do not have selectors themselves.

All the commands here must be called via `/scriptevent`, each will have an unique identifier and a namespace, which is `ecs` **or** `cmd`.


## playmusic
This command has the exact same syntax as `/music`, but the difference being it only affects the music of one player.

**Syntax**: `/scriptevent ecs:playmusic <trackName: string> [volume: number] [fadeSeconds: number] [repeat: true/false]`

**Example:** `/scriptevent ecs:playmusic music.game.credits 1 2 true`

This plays the credits track for the player that executed the command after fading for 2 seconds. It will play at volume 1 and repeat after it's done.

## stopmusic

Stops the music track that is currently playing. It stops it abruptly, so it's recommended to use that above command and fade to another track.

**Syntax**: `/scriptevent ecs:stopmusic`

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

## schedule

This brings the functionality of Java edition's `/schedule` to Bedrock.


[**Do not put the slash in front of the command inside**](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable#runcommand).

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

## addusecommand / auc

The one you've been waiting for: This command lets you put a command on a **non-stackable** item.

**You can only add one command per item, use `multicommand` to add more.**

See [here](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setdynamicproperty) for why it only works for non-stackable items.

There is a workaround to get commands on stackable items: Make a structure that contains the stackable item and the dynamic property manually.

Export one of the items that has a command from this pack as a structure for a reference on what you need to change.

You should see a dynamic property section which contains `280232d4-f31d-4849-a42c-ce77e6870e30`. If you're up to this point, I trust that you will be able to do the rest.

**Be very careful with what command you decide to put on an item. You very likely will not be able to remove it if other players get their hands on it. See `removeusecommand` for why.**


For best practice, make use of a `function` that clears the item from the player upon using it.

**Syntax**: `/scriptevent ecs:addusecommand <command: string>`

**Example:** `/scriptevent ecs:addusecommand effect @s levitation 30 0 true`

This will make the item give the player that uses it levitation for 30 seconds without showing particles.

You can chain this with the scriptevent commands here for even more creativity.

## removeusecommand / ruc

This removes the use command **from the item you're holding**. It doesn't remove it from all identical items. 

**Syntax**: `/scriptevent ecs:removeusecommand`

## setlore

Sets the lore on the item you're currently holding. Use `\n` to indicate a new line, note that you will need to apply formatting codes again on each new line.

You are limited to having 20 lines of lore with a maximum length of 50 each. See [here](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setlore) for why.

**Syntax**: `/scriptevent ecs:setlore <lore: string>`

**Example:** `/scriptevent ecs:setlore §9I have a pen\n§cI have an apple\n§9I have a pen\n§eI have pineapple`

# Other Stuff

You can find the source code and latest releases on [Github](https://github.com/Aevarkan/MCBE-extended-commands-suite).