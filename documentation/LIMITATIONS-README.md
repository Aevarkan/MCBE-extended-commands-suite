Here is a list of things that aren't possible to my knowledge.

If you think a recent Minecraft update has made one of these possible, please notify me by creating an issue.

Feature | Reason | References
:---: | --- | ---
size control | Not every entity has an EntityScaleComponent. You can add it manually to its `.json` file, or use the supplementary pack [here](https://github.com/Aevarkan/MCBE-scale-components). | https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityscalecomponent?view=minecraft-bedrock-stable
over-leveled enchants | The script API is limited in what enchants it can apply to an item just like normal enchanting. | https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemenchantablecomponent?view=minecraft-bedrock-stable#addenchantment