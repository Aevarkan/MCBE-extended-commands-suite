tellraw @s {"rawtext":[{"text":"§eECS:§r A jump command has been added to you, press jump to see what it does!"}]}
tellraw @s {"rawtext":[{"text":"§eECS:§r You can remove this command using /scriptevent cmd:rjc example"}]}
scriptevent cmd:addjumpcommand example execute unless block ~ ~-1 ~ air run function extendedcommands/internal/jump_example
playsound note.pling