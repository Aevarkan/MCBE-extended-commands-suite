scriptevent ecs:playmusic music.game.basalt_deltas 1 2 false
scriptevent ecs:schedule 20 scriptevent ecs:freeze 220
scriptevent ecs:schedule 40 effect @s slowness 11 5 true
scriptevent ecs:schedule 40 effect @s blindness 11 0 true
scriptevent ecs:schedule 40 playsound ambient.cave @s
scriptevent ecs:schedule 120 tellraw @s {"rawtext":[{"text":"§4Unknown:§r I haven't seen you around these parts..."}]}
scriptevent ecs:schedule 160 tellraw @s {"rawtext":[{"text":"§4Unknown:§r You best be careful..."}]}
scriptevent ecs:schedule 200 tellraw @s {"rawtext":[{"text":"§4Unknown:§r Try to not wander too far alone..."}]}
scriptevent ecs:schedule 240 scriptevent ecs:playmusic music.game 1 2 false