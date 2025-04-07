tellraw @s {"rawtext":[{"text":"§eECS:§r You will be launched up in 5..."}]}
scriptevent ecs:schedule 20 tellraw @s {"rawtext":[{"text":"§eECS:§r You will be launched up in 4..."}]}
scriptevent ecs:schedule 40 tellraw @s {"rawtext":[{"text":"§eECS:§r You will be launched up in 3..."}]}
scriptevent ecs:schedule 60 tellraw @s {"rawtext":[{"text":"§eECS:§r You will be launched up in 2..."}]}
scriptevent ecs:schedule 80 tellraw @s {"rawtext":[{"text":"§eECS:§r You will be launched up in 1..."}]}
scriptevent ecs:schedule 100 scriptevent ecs:push abs 0 10 0
scriptevent ecs:schedule 100 particle minecraft:wind_explosion_emitter
scriptevent ecs:schedule 100 playsound wind_charge.burst @s