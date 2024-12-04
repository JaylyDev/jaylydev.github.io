---
author: Jayly
title: Minecraft Terminator
description: A Minecraft Bedrock Add-On that adds a powerful mob that has the ability to follow entities, destroy blocks and build blocks, to prevent you from beating the game.
date: 12/4/2024
image: /assets/posts/terminator/terminator-v2-beta-thumbnail.png
download: true
---

# Minecraft Terminator

![thumbnail](/assets/posts/terminator/terminator-v2-beta-thumbnail.png)

> Download links for the add-on is located at the bottom of the page.

**Introducing Terminator to your Minecraft world!** This is a powerful mob that has the ability to follow entities, destroy blocks and build blocks when the terminator thinks it's necessary, pick up melee and ranged weapons such as swords and bows to attack entities, and wear armors such as chestplates to protect itself from being damaged.

## Build and Destroy Blocks

This terminator can build blocks to reach its target and break blocks that stops the terminator from reaching the target.

![terminator-building](/assets/posts/terminator/terminator-building.png)

![terminator-can-build](/assets/posts/terminator/terminator-can-build.png)

## Entities Attack

![terminator-attack](/assets/posts/terminator/terminator-attack.png)

The terminator can attack the following types of mobs. Please note that Terminator will attack a selected mob when the terminator and it's target met the right conditions (which you can check the table below the list):

- Players
- Iron Golems
- Snow Golems
- Tamed Parrots
- Wolfs
- Allay
- Armadillo
- Axolotl
- Camel
- Horse
- Pig
- Skeleton Horse
- Sniffer
- Villager
- Wandering Trader

### Terminator Entity Attack Requirement

| Target Entity Type        | Requirements for Target Entity                     | Requirements for Terminator                                                                                                                                                                                                                                                                                                                                                  | Can See Through Blocks | Maximum Distance |
| ------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------- |
| Player                    | No invisibility                                    |                                                                                                                                                                                                                                                                                                                                                                              | Yes                    | 1024 blocks      |
| Iron Golems               | No invisibility                                    | <p>Must wear the following:</p><ul><li>Netherite Helmet</li><li>Netherite Boots</li></ul><p>Must wear the following:</p><ul><li>Netherite Helmet</li><li>Netherite Boots</li></ul><p>Needs to hold one of the following weapons:</p><ul><li>Netherite Sword</li><li>Diamond Sword</li><li>Iron Sword</li><li>Golden Sword</li><li>Stone Sword</li><li>Wooden Sword</li></ul> | No                     | 24 blocks        |
| Wolf                      | <ul><li>Must be tamed<li>No invisibility</li></ul> |                                                                                                                                                                                                                                                                                                                                                                              | No                     | 16 blocks        |
| Passive mobs listed above | No invisibility                                    |                                                                                                                                                                                                                                                                                                                                                                              | No                     | 16 blocks        |

> [!NOTE]
> Terminator can only attack mobs and players, when difficulty levels in the game is set to Easy, Normal, or Hard.

## Combat

The Terminator Combat is a major update released for Terminator Combat Update (add-on version 1.3).

In order for the terminator to use different kinds of combat, they need to pick up the weapon in order to switch combat mechanic.

![combat](/assets/posts/terminator/terminator-combat.png)

Showcase video:

<iframe width="914" height="514" src="https://www.youtube.com/embed/YkKNTtvbvtg" title="PVP against a Minecraft terminator" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

#### Melee Attack

Melee attack is activated when the terminator is spawned and is holding a melee weapon (trident is excluded from this category).

Features:

- Movement speed multiplier of terminator is 130%
- It does 1 attack damage

### Bow

Bow combat is activated when the terminator is holding a bow.

> [!NOTE]
>
> - Terminator will wait 1 to 3 seconds after an attack before launching another.
> - Terminator shoots normal arrows (It will not shoot different effects of arrows even if terminator receives it.)

### Crossbow

Crossbow combat is activated when the terminator is holding a crossbow.

> [!NOTE]
>
> - Terminator will wait 1 second after an attack before launching another
> - Terminator shoots normal arrows (It will not shoot different effects of arrows even if terminator receives it.)
> - Movement speed multiplier of terminator is 100%

### Trident

Trident combat is activated when the terminator is holding a trident.

Switching combat:

- Melee combat - activates when the target is 3 blocks or less away from the terminator
- Ranged combat - activates when the target is 4 blocks or more away from the terminator

### Snowball

Snowball combat activates when the terminator holds a snowball.

Features:

- Terminator shoots snowball every 0.2 seconds
- Terminator's snowball combat showcase

[**Showcase Video - Terminator Snowball Ranged Attack**](https://youtu.be/Tcm816bN5II?t=50)

### Shield

Shield is activated when the terminator is holding a shield in main hand or off hand.

- Shield has a 5 ticks (0.25 seconds) cooldown after a defense before blocking another attack or terminator's hand.
- The shield disables damage cause by: block explosion, entity attack, entity explosion and projectile.

## Respawn Event

When the terminator dies for the first time, the terminator will trigger a respawn event which will respawn itself.

The terminator will have the ability to respawn itself for the second time until terminator dies for the third time.

The following image is taken after the terminator dies:

![stage 1](/assets/posts/terminator/terminator-death-event-stage1.png)

![stage 2](/assets/posts/terminator/terminator-death-event-stage2.png)

When the terminator respawns, a customized death message appears.

![death message](/assets/posts/terminator/terminator-death-message.png)

Shown here is a list of death messages for Terminator's first death (and many more).

## Feeding the Terminator

![feed](/assets/posts/terminator/feed-terminator.png)

Method: <ins>You feed the terminator as you feed a horse.</ins>

You can feed the terminator food that players can eat.

The amount of health the terminator gains when fed one of the food is the same as the amount of food points player gets when eat one of the food. For more infomation about food points and items players can eat check out Minecraft Wiki.

Difference about food points for players and health points for terminators:

- Terminator restores 14 health points from eating cake
- Terminator cannot eat chorus fruit

More infomation about food points: https://minecraft.wiki/w/Food#Foods

## Skins and Models

**Terminator now has different skins!**

Christmas skins only display in Minecraft from **December 1st to December 25th**. The add-on will change their skin back to normal afterwards.

![terminator skins](/assets/posts/terminator/terminator-skins.png)

This feature includes the introduction of skin models:

![terminator skin models](/assets/posts/terminator/minecraft-terminator-customization-update_6.png)

<details><summary><strong>Differences</strong></summary>

The difference here are the steve's model arm's are 4 pixels wide and the alex's model arm's are 3 pixels wide, like what you see when choosing your own custom skin.

![terminator skin models](/assets/posts/terminator/minecraft-terminator-customization-update_7.png)

</details>

### Changing Terminator Skins

Players may not like the Minecraft skins Terminator entity wears. Currently the only way to change its textures is to modify the resource pack files.

1. Extract the Add-On
2. In the extracted folder, navigate to `resource_pack/textures/entity` folder, where you would see a bunch of image files.
3. Modify the `steve.png` or the `alex.png` file
4. Save the changes, then import the Add-On with modified changes to Minecraft
5. Run `/function terminator` command to bring the 'Spawn Terminator' form
6. In the Skin Model dropdown, select either 'Custom (Steve Model)' or 'Custom (Alex Model)'
   ![selection](/assets/posts/terminator/custom-skin-selection.png)

## Capes

Terminator can now equip all the capes obtainable in Bedrock Edition, and Migrator cape as a bonus. When they equip the cape it also change the appearance of a worn elytra. Capes are purely decorational, and do not alter the wearers' capabilities in any way.

![terminator with cape](/assets/posts/terminator/terminator-capes.png)

Terminators can equip the following cape, which they can be spawned using the 'Spawn Terminator' form:

- 15th Anniversary
- Cherry Blossom
- Founder
- Migrator
- Mojang New
- Pan
- Progress Pride
- Follower (TikTok)
- Purple Heart (Twitch)
- One Vanilla

## Spawn a Terminator

You have seen the cool features the Terminator add-on offers. There are multiple ways to spawn a terminator in your Minecraft world:

1. You can obtain the terminator spawn egg in the creative inventory

   ![creative inventory](/assets/posts/terminator/spawn-terminator-creative-inventory.png)

2. Use the /summon command to spawn the terminator

   ![summon command](/assets/posts/terminator/spawn-terminator-command.png)

3. Craft the terminator spawn egg using a crafting table, here is the recipe:

   ![recipe](/assets/posts/terminator/terminator-recipe.png)

   > Thanks May5Flames for the terminator crafting recipe!

4. Spawn Terminator command

   ```
   /function terminator
   ```

   This function command will lead you to the 'Spawn Terminator' form, allowing you to spawn your own Terminator entity.

### List of settings in Spawn Terminator form

In the 'Spawn Terminator' form, there are multiple properties that can be customized when spawning a new Terminator entity. This can be accessed through the `/function terminator` command mentioned above.

The following is a list of settings available in the form.

| Setting             | Description                                                                                  | Default Value | Type                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| Name Tag            | Sets Terminator's name when spawned.                                                         | Terminator    | String                                                                                                 |
| Spawn Coordinates   | The location at which to spawn the Terminator entity.                                        | ~ ~ ~         | x y z                                                                                                  |
| Skin Model          | Sets the skin model for the Terminator entity.                                               | Steve         | One of the following:<ul><li>Steve</li><li>Alex</li><li>Custom (Steve)</li><li>Custom (Alex)</li></ul> |
| Enable Custom Skin  |                                                                                              | False         | Bool                                                                                                   |
| Enable Bossbar      | Display Terminator's health as a bossbar at the top of the screen.                           | False         | Bool                                                                                                   |
| Enable Immunity     | when enabled, any damage will not apply to the specific terminator.                          | False         | Bool                                                                                                   |
| Enable Death Event  | Enables the death event when the terminator dies.                                            | True          | Bool                                                                                                   |
| Enable Physics      | Determines if the terminator entity is affected by gravity or if it collides with objects.   | True          | Bool                                                                                                   |
| Enable Regeneration | Whether or not the terminator entity heals itself when having a low health bar.              | True          | Bool                                                                                                   |
| Enable Respawn      | Whether or not the terminator entity is allowed to respawn 3 times before dying permanently. | True          | Bool                                                                                                   |
| Enable Breedability | Allows the entity to procreate.                                                              | False         | Bool                                                                                                   |
| Cape                | Equip capes for terminator entity.                                                           | None          | [Capes](#capes)                                                                                        |

### Still stuck at spawning a terminator?

Don't worry. When you spawn into the world with the Add-On loaded for the first time, a Terminator guide book will appear in your inventory.

![guide book](/assets/posts/terminator/guide-book.png)

Right click and scroll down to the bottom, a button that says "Spawn Terminator" will redirect you to this form:

![Spawn Terminator form 1](/assets/posts/terminator/spawn-terminator-form-1.png)

![Spawn Terminator form 2](/assets/posts/terminator/spawn-terminator-form-2.png)

By pressing the 'Submit' button, the game will spawn a terminator with changes applied based on options available in the 'Spawn Terminator' form.

## Function commands

The terminator add-on also provides ways to activate advanced features via `/function` commands.

- `/function terminator` - This shows the 'Spawn Terminator' form.

- `/function terminator/killall` - This kills every terminator and disables all currently running respawn events in existence, terminators will not respawn by running this command.

## Experimental Features

> [!CAUTION]
> The following features are being experimented. It may change or it may be removed in future releases.

### Traveling Through Overworld and Nether

Terminator is now able to travel between the overworld and the nether dimension. The following video demostrates this feature:

<iframe width="914" height="514" src="https://www.youtube.com/embed/Tcm816bN5II" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This event triggers when the terminator is in a dimension where there are zero players with survival or adventure gamemode. The terminator will attempt to build a nether portal to go to the other dimension attempts to find players to kill.

Please leave your feedback in the [Discord Server](https://discord.com/invite/SuhGvZEXb4)!

## Changelog

A complete release history for Terminator Add-On is available [here](/posts/terminator-changelog).

Changelogs for recent releases can also be found below.

### 2.1.2

> Release Date: December 4, 2024

- Fixed a bug where Terminator cannot pick up items

### 2.1.1

> Release Date: November 16, 2024

- Removed event `terminator:fix_default_target`. Players now will not be able to switch combat through commands.
- Fixed a bug related to terminator's naming system.
- Fixed a bug where LocationOutOfWorldBoundariesError throws when initialise respawn structure outside of height range.
- Fixed a bug where LocationOutOfWorldBoundariesError throws when attempted to drop terminator's inventory outside of height range.
- Fixed a bug where LocationOutOfWorldBoundariesError throws when terminator attempted to break or place blocks outside of height range.

### 2.1.0

> Release Date: September 7, 2024

Terminator v2.1.0 has been released.

This update contains some Minecraft parity changes, improvements and various bug fixes.

#### Add-On Changes

- Rewrite terminator respawn event entirely, from JSON to scripts.
- Removed unused `terminator:find_end_portal` and `terminator:find_nether_portal` event for terminator entity.
- Add-On now requires Minecraft v1.21.0 to run.

#### Function Commands Changes

- Removed the following deprecated commands:
  - `/function player/kit/chainmail`
  - `/function player/kit/diamond`
  - `/function player/kit/golden`
  - `/function player/kit/leather`
  - `/function player/kit/iron`
  - `/function player/kit/netherite`

#### Terminator Entity Changes

- Terminator is now able to break the following leaves: `acacia_leaves`, `birch_leaves`, `cherry_leaves`, `dark_oak_leaves`, `jungle_leaves`, `mangrove_leaves`, `oak_leaves`, and `spruce_leaves`
- Updated list of item terminator wants:
  - Changed `grass` to `grass_block` (parity change)
  - Added new items terminator wants:
    - Planks: `minecraft:acacia_planks`, `minecraft:bamboo_planks`, `minecraft:birch_planks`, `minecraft:cherry_planks`, `minecraft:crimson_planks`, `minecraft:dark_oak_planks`, `minecraft:jungle_planks`, `minecraft:mangrove_planks`, `minecraft:oak_planks`, `minecraft:spruce_planks`, `minecraft:warped_planks`
    - Logs and stripped logs: `minecraft:acacia_log`, `minecraft:birch_log`, `minecraft:cherry_log`, `minecraft:dark_oak_log`, `minecraft:jungle_log`, `minecraft:mangrove_log`, `minecraft:oak_log`, `minecraft:spruce_log`, `minecraft:stripped_acacia_log`, `minecraft:stripped_birch_log`, `minecraft:stripped_cherry_log`, `minecraft:stripped_dark_oak_log`, `minecraft:stripped_jungle_log`, `minecraft:stripped_mangrove_log`, `minecraft:stripped_oak_log`, `minecraft:stripped_spruce_log`
- Terminator now avoids withers and wardens
- Terminator is now unable to break the following blocks: Glowingobsidian, Obsidian, Netherreactor, Allow, Deny, Portal, Fire, Soul Fire, and the 20 light blocks.
- Respawn event structure from Terminator's respawn event is now placed block by block.
- Improved death messages for terminator's first death, thanks to respawn event is rewritten in scripting.
- Terminator is now able to build vertically when players are within 8 block volume, centered at terminator's location.
- **Experimental**: Added a feature where Terminators build nether portals, either in the overworld when all players are in the nether, or in the nether when all players are in the overworld.

#### Terminator Entity Fixes

- Fix a bug where terminator doesn't avoid soul campfire blocks
- Terminator now avoids sculk shriekers in the behavior JSON, so when they move away from those blocks it may trigger wardens to spawn.
- Respawn event is now able to spawn Terminator custom slim models, if terminator dies with custom slim models.
- Fix an issue where Terminator cannot snowball when near player ([#69](https://github.com/JaylyDev/terminator/issues/69))

### 2.0.0

> Release Date: July 14, 2024

For the past few months I have been rewriting this Terminator add-on so it works in Minecraft's Tricky Trials Update and to celebrate Terminator add-on's 3rd anniversary. Thanks to everyone who helped testing beta versions of Terminator add-on version 2.

#### Add-On Changes

- Add-On now no longer requires experiments to run.
- Addon now requires Minecraft version 1.20.70 or above to run properly.
- Fix a bug where addon can be applied to Global Resources.
- Converted `glow_squid` family to `squid`
- Revamped death message system from entity JSON to TypeScript.
- Revamped forward bridging from animation controller JSON to TypeScript fully.
- Converted death event to scripts
- Added Terminator Guide Book. Obtained when player first join with this add-on loaded to world.
- Removed `/function terminator/nbt/nodeathevent` - Please spawn a terminator without death event activated on it's death through the Spawn Terminator form.
- Spawn Terminator form now allow spawning default/custom steve and alex skin
- Terminator now drops their entire inventory on death
- Removed property dimension from spawn terminator form
- Spawn terminator form now has settings preference for players
- Removed `.pdn` files from resource pack.
- `/function terminator` command now returns the spawn terminator form.
- Removed all nbt-related function commands. Please spawn it using `/function terminator` command instead.

#### Function Commands Changes

- Fixed invalid command syntax which caused add-on not being to run properly.
- Function commands are being deprecated in v2.0.0, and it will be replaced by script forms which will be released in future v2.0.0 beta updates.

#### Terminator Entity Changes

- Updated terminator to leave chest boats.
- Updated unbreakable blocks list so terminator cannot break blocks with blast resistance of 100 or above, which includes the following:
  - Barrier
  - Light Block
  - Bedrock
  - Command Block
  - End Gateway
  - End Portal
  - End Portal Frame
  - Jigsaw
  - Structure Block
  - Water
  - Lava
  - Flowing Lava
  - Flowing Water
  - Air
- Add-On now detects death causes and broadcast death messages added from 1.20.
- Added 1.20 death messages to terminator add-on.
- Terminator will now bridge inside the height range of each dimension.
- Added Terminator spawn sound.
- Added deepslate to terminator breakable block list
- Terminator placing blocks now includes sounds
- Added a set of rules for terminator to have the ability to place blocks.
- Terminator names are now sanitized. Following bedrock edition nametag rules.
- Terminator now has the ability to break blocks around it's hitbox when attempting to break the block below
- Reduced maximum distance Terminator can be from the target when following it, from 2048 blocks to 1024 blocks in favor of performance improvement. I'll increase the limit when the navigation behavior is having a rewrite from JSON to JavaScript.
- Terminator is now able all the bedrock capes, incuding:
  - 15th Anniversary
  - Cherry Blossom
  - Founder
  - Migrator
  - Mojang New
  - Pan
  - Progress Pride
  - Follower (TikTok)
  - Purple Heart (Twitch)
  - One Vanilla

#### Terminator Entity Fixes

- Fixed a bug that entity nametag is not shown in death messages.
- Fixed a bug that modified terminator nametag won't display in join message.
- Fix a bug where terminator unable to bridge towards northwest direction.
- Fix Terminator left message not shown and not colored yellow.
- Fix a bug where terminator will fly when attempting to jump.
- Fix a bug that terminator will not place blocks at certain directions when bridging.
- Fix #46
- Fix issues with terminator respawn event
- Fix an issue with West and East place direction having wrong coordinates.
- Fix issue where terminator jumping action would trigger mid-air
- Fix an issue with Terminator digs a block below when having target (#60)
- Fix an issue where blocks broken by terminator will not drop the item.
- Fix an issue with all directions are offset by 180 degree.
- Fixed an issue where terminator will create multiple goals to escape to when trying to escape
- Fixed an issue with cape flaping and legs movement
- Fix an issue where disabling terminator death event through spawn terminator form will not work.
- Fix an issue that terminator spawn message appearing twice
- Fix Terminator not being able to get off boats, chest boats and minecarts
- Fix an issue where spawn Terminator form will spawn default alex skin instead of terminator variant
- Fixed an issue where multiple terminator can have the same nametags
- Fix a bug that terminator sometimes attempts to punch nothing [#70](https://github.com/JaylyDev/terminator/issues/70)
- Fix a bug where massive explosions occurs when terminator dies in water and respawn [#64](https://github.com/JaylyDev/terminator/issues/64)
- Fix an issue where addon fails to retrieve damaging entity nameTag
- Fix an issue that terminator will not escape when reaching below 20hp after `/reload`
- Fix an issue where death message didn't display item name tag
- Fix an issue where Terminator name will not display in some cases
- Fixed a bug that Terminator death message not showing after respawn.
- Fixed a bug that Terminator's join message appears after respawning
- Fixed a bug where terminator doesn't spawn with terminator steve skin if spawning with the 'Spawn Terminator' form

## Installation

After downloading the add-on below and import the add-on to Minecraft, **make sure both resource pack and behavior pack are imported** so you do not have the error related to incompatibility when applying the add-on.

[**Join my Discord server**](https://discord.com/invite/SuhGvZEXb4) or [**report to Terminator GitHub Repository**](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=) if there are any issues, questions and feedbacks regarding to the add-on's installation or the gameplay.

Terminator entity can cause massive destruction. **Please save a copy of your world** before activating this add-on!

You are allowed to repost this add-on to other websites or make a YouTube video for commercial purposes, provided that you must put the link this post or the MCPEDL post in the description of the video or a webpage and must not have any other direct-download links.

This add-on is compatible with **Minecraft Bedrock v1.21.0 or above**.

## Downloads

Click the link below and choose a version to download.

- [Download Minecraft Terminator Add-On](/posts/terminator/downloads/)
- [Submit a bug report to improve the add-on](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=)
- [Suggest an idea for this add-on](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=)
- [Support Discord Server](https://discord.com/invite/SuhGvZEXb4)
