# Extended Commands Suite
Github repository for the Extended Commands Suite pack.
## List of Commands
### `playmusic`
This command has the exact same syntax as `/music`, but the difference being it only affects the music of one player.

**Syntax**: `/scriptevent cmd:playmusic <trackName: string> [volume: number] [fadeSeconds: number] [repeat: true/false]`

**Example:** `/scriptevent cmd:playmusic music.game.credits 1 2 true`

This plays the credits track for the player that executed the command after fading for 2 seconds. It will play at volume 1 and repeat after it's done.

### `stopmusic`

Stops the music track that is currently playing. It stops it abruptly, so it's recommended to use that above command and fade to another track.

**Syntax**: `/scriptevent cmd:stopmusic`

### `push`

This command pushes a player (and some entities, not including items). There is no Java equivalent to this.

**Syntax 1:** `/scriptevent cmd:push relative|rel|r [horizontalRotation: number/range] [horizontalStrength: number/range] [verticalStrength: number/range]`

**Example:** `/scriptevent cmd:push relative 90 3 5`

This pushes the entity 90 degrees to the right with a strength of 3 on the horizontal plane, and a strength of 5 upwards.

**Example:** `/scriptevent cmd:push relative -45:45 1:3 -5:5`

This pushes an entity between 45 degrees to the left and 45 degrees to the right with a horizontal strength between 1 and 3, and a vertical strength between -5 and 5.

If you put this in a repeating command block, it will sometimes push an entity left 45 degrees downwards, and sometimes right 45 degrees upwards. **It takes a random number between the two you put around the colon**.

**Syntax 2:** `/scriptevent cmd:push absolute|abs|a [xVector: float] [yVector: float] [zVector: float]`

**Example:** `/scriptevent cmd:push abs 5 10 0`

This pushes an entity upwards and along the positive x direction.

### `motion`

This is just an alias for `push`.

### `pushgliding`

This is a special version of `push` that **only** affects `Players` that are gliding with an elytra. It has the same syntax.

### `tpspawn`

**Syntax**: `/scriptevent cmd:tpSpawn

Teleports a `Player` to their spawn point. If you've played Terraria, this is what the magic mirror does.

### `freeze`

This freezes a Player by stopping their camera movements, it doesn't change their velocity (it won't stop anyone from falling).

If used on an entity, it will mostly freeze them (they move very slowly, and they will fall slowly as well). Be **VERY** careful when using this on entities, it is very performance intensive. Using this on players doesn't affect performance. 

**Syntax**: `/scriptevent cmd:freeze <timeTicks: int>`

**Example:** `/scriptevent cmd:freeze 600`

This freezes the entity for 30 seconds. A second is 20 `ticks`.

### `addusecommand`

The one you've been waiting for: This command lets you put a command on a **non-stackable** item.

See [here][https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setdynamicproperty] why it only works for non-stackable items.

**Be very careful with what command you decide to put on an item. You very likely will not be able to remove it if other players get their hands on it. See below for why.**

For best practice, make use of a `function` that clears the item from the player upon using it.

**Syntax**: `/scriptevent cmd:addusecommand <command: string>`

**Example:** `/scriptevent cmd:addusecommand effect @s levitation 30 0 true`

This will make the item give the player that uses it levitation for 30 seconds without showing particles.

You can chain this with the scriptevent commands here for even more creativity.

### `removeusecommand`

This removes the use command **from the item you're holding**. It doesn't remove it from all identical items. 

**Syntax**: `/scriptevent cmd:removeusecommand`

### `setlore`

Sets the lore on the item you're currently holding. Use `\n` to indicate a new line, note that you will need to apply formatting codes again on each new line.

You are limited to having 20 lines of lore with a maximum length of 50 each. See [here][https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack?view=minecraft-bedrock-stable#setlore] for why.

**Syntax**: `/scriptevent cmd:setlore <lore: string>`

**Example:** `/scriptevent cmd:setlore §9I have a pen\n§cI have an apple\n§9I have a pen\n§eI have pineapple`