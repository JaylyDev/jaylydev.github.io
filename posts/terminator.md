---
author: Jayly
title: Minecraft Terminator [v2.0.0]
description: A Minecraft Bedrock Add-On that adds a powerful mob that has the ability to follow entities, destroy blocks and build blocks, to prevent you from beating the game.
date: 7/19/2024
image: /assets/posts/terminator/terminator-v2-beta-thumbnail.png
download: true
---

# Minecraft Terminator [v2.0.0]

![thumbnail](/assets/posts/terminator/terminator-v2-beta-thumbnail.png)

> Download links for the add-on is located at the bottom of the page.

**Introducing Terminator to your Minecraft world!** This is a powerful mob that has the ability to follow entities, destroy blocks and build blocks when the terminator thinks it's necessary, pick up melee and ranged weapons such as swords and bows to attack entities, and wear armors such as chestplates to protect itself from being damaged.

## Build and Destroy Blocks

This terminator can build blocks to reach its target and break blocks that stops the terminator from reaching the target.

![terminator-building](/assets/posts/terminator/terminator-building.png)

![terminator-can-build](/assets/posts/terminator/terminator-can-build.png)

## Respawn Event

When the terminator dies for the first time, the terminator will trigger a respawn event which will respawn itself.

The terminator will have the ability to respawn itself for the second time until terminator dies for the third time.

The following image is taken after the terminator dies:

![stage 1](/assets/posts/terminator/terminator-death-event-stage1.png)

![stage 2](/assets/posts/terminator/terminator-death-event-stage2.png)

## Feeding the Terminator

![feed](/assets/posts/terminator/feed-terminator.png)

Method: <ins>You feed the terminator as you feed a horse.</ins>

You can feed the terminator food that players can eat.

The amount of health the terminator gains when fed one of the food is the same as the amount of food points player gets when eat one of the food. For more infomation about food points and items players can eat check out Minecraft Wiki.

Difference about food points for players and health points for terminators:

- Terminator restores 14 health points from eating cake
- Terminator cannot eat chorus fruit

More infomation about food points: https://minecraft.wiki/w/Food#Foods

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

<iframe width="914" height="514" src="https://www.youtube.com/embed/krSKg8erXLk" title="snowball.mp5" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Here's a (very old) video showcasing terminator snowball ranged attack!

### Shield

Shield is activated when the terminator is holding a shield in main hand or off hand.

- Shield has a 5 ticks (0.25 seconds) cooldown after a defense before blocking another attack or terminator's hand.
- The shield disables damage cause by: block explosion, entity attack, entity explosion and projectile.

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

## Changelog

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

### 2.0.0-beta (2024/6/9)

> [!IMPORTANT]
> The Terminator add-on is currently in early testing. As with all add-ons that are in development, it is unstable. Check the changelog for details on any changes to the add-on.

Another Terminator beta release! This will likely be the final beta release for v2.0.0. This release focus on Behavior AI changes for Terminator mob along some bug fixes, oh and additional capes for the mob.

#### Terminator Entity Changes

- Fix a bug that terminator sometimes attempts to punch nothing [#70](https://github.com/JaylyDev/terminator/issues/70)
- Fix a bug where massive explosions occurs when terminator dies in water and respawn [#64](https://github.com/JaylyDev/terminator/issues/64)
- Fix an issue where addon fails to retrieve damaging entity nameTag
- Fix an issue that terminator will not escape when reaching below 20hp after `/reload`
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
- Fix an issue where death message didn't display item name tag
- Fix an issue where Terminator name will not display in some cases

#### Add-On Changes

- Removed `.pdn` files from resource pack.
- `/function terminator` command now returns the spawn terminator form

### 2.0.0-beta (2024/5/26)

> [!IMPORTANT]
> The Terminator add-on is currently in early testing. As with all add-ons that are in development, it is unstable. Check the changelog for details on any changes to the add-on.

I'm still rewriting this add-on in hopes for most of the feature works before releasing v2.0.0 officially. As expected there are still lots of bugs and I'm working on resolving them, so please be patient and keep reporting the bugs to [the bug tracker](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=) please! Thank you.

> You can also suggest features you want me to add to the Terminator add-on, they'll be reviewed too.

#### Add-On Changes

- Removed `/function terminator/nbt/nodeathevent` - Please spawn a terminator without death event activated on it's death through the Spawn Terminator form.
- Spawn Terminator form now allow spawning default/custom steve and alex skin
- Terminator now drops their entire inventory on death
- Removed property dimension from spawn terminator form
- Spawn terminator form now has settings preference for players

#### Terminator Entity Changes

- Terminator placing blocks now includes sounds
- Added a set of rules for terminator to have the ability to place blocks.
- Terminator names are now sanitized. Following bedrock edition nametag rules.
- Terminator now has the ability to break blocks around it's hitbox when attempting to break the block below
- Reduced maximum distance Terminator can be from the target when following it, from 2048 blocks to 1024 blocks in favor of performance improvement. I'll increase the limit when the navigation behavior is having a rewrite from JSON to JavaScript.

#### Terminator Entity Fixes

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

### 2.0.0-beta (2024/5/17)

> [!IMPORTANT]
> The Terminator add-on is currently in early testing. As with all add-ons that are in development, it is unstable. Check the changelog for details on any changes to the add-on.

We're fixing more bugs in preparation for Terminator add-on release v2.0.0.

Releasing this add-on to MCPEDL for public testing.

#### Add-On Changes

- Added Terminator Guide Book. Obtained when player first join with this add-on loaded to world.

#### Add-On Codebase

- Converted death event to scripts

#### Terminator Entity Changes

- Fixed a bug that modified terminator nametag won't display in join message.
- Added Terminator spawn sound.
- Fixed a bug that entity nametag is not shown in death messages.
- Added deepslate to terminator breakable block list
- Fix issues with terminator respawn event

### 2.0.0-beta (2024/5/12)

> [!IMPORTANT]
> The Terminator add-on is currently in early testing. As with all add-ons that are in development, it is unstable. Check the changelog for details on any changes to the add-on.

We're fixing more bugs in preparation for Terminator add-on release v2.0.0.

#### Add-On Codebase

- Revamped death message system from entity JSON to TypeScript.
- Revamped forward bridging from animation controller JSON to TypeScript fully.

#### Terminator Entity Changes

- Added 1.20 death messages to terminator add-on.
- Fix Terminator left message not shown and not colored yellow.
- Fix a bug where terminator will fly when attempting to jump.
- Fix a bug that terminator will not place blocks at certain directions when bridging.
- Fix [Terminator doesn't move when using snowballs #46](https://github.com/JaylyDev/terminator/issues/46)
- Terminator will now bridge inside the height range of each dimension.

### 2.0.0-beta (5/9/2024)

Once again, I'm rewriting this add-on so it works in latest versions of Minecraft - The 1.21 Update, I mean the Tricky Trials Update. This update includes the codebase of the add-on migrating from JSON to TypeScript, tons of bug fixes, and experimental features! Sounds impressive? Let's dive in.

#### Engine Changes

- Add-On now no longer requires experiments to run.
- Addon now requires Minecraft version 1.20.70 or above to run properly.
- Fix a bug where addon can be applied to Global Resources.
- Converted `glow_squid` family to `squid`

#### Function Commands Changes

- Fixed invalid command syntax which caused add-on not being to run properly.
- Function commands are being deprecated in v2.0.0, and it will be replaced by script forms which will be released in future v2.0.0 beta updates.

#### Terminator Entity Changes

- Fix a bug where terminator unable to bridge towards northwest direction.
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

### 1.4.0

#### What's Changed

- Terminator now changes skin to christmas theme across all platforms.
- Removed `#summon` command, replaced with `/scriptevent terminator:spawn` with a modal form.
- Add-On now doesn't require Beta APIs experiment enabled
- Add-On is now compatible with v1.20.40+

#### Pull Requests

- Add multiple ci workflows by @Hallis1221 in [#44](https://github.com/JaylyDev/terminator/pull/44/)
- v1.4 - November 2023 Update by @JaylyDev in [#50](https://github.com/JaylyDev/terminator/pull/50/)

#### New Contributors

- @Hallis1221 made their first contribution in [#44](https://github.com/JaylyDev/terminator/pull/44/)

**Full Changelog**: https://github.com/JaylyDev/terminator/compare/v1.3.70...v1.4.0

### 1.3.70

#### New features

- add "terminator join the game" text when terminator is spawned
- added custom slim geometry (alex model)
- terminator will not respawn if he dies in the void
- "terminator left the game" text appears when terminator dies
- **Custom Commands**
  Type the commands in chat with prefix `#`
  - Added `#summon` - summons terminator with customizable features such as nametag, regeneration and respawn
    - **Usage**: `#summon <entity: string> <NBT Data: JSON object>`
    - **Example**: `#summon terminator { "nametag": "Terminator", "customskin": false }`
    - Terminator components: https://github.com/JaylyDev/terminator/blob/main/docs/commands/gametest.md#entity-terminator
  - Added documentation for custom commands in GitHub Repository
    - Documentation: https://github.com/JaylyDev/terminator/blob/main/docs/commands/gametest.md
  - Added `#version` - Checks add-on version
    - Added subcommand `#version gametest`
    - Added subcommand `#version module`
  - Added `#help` - help support for custom commands
- A number is added to prevent duplicate name tags to terminator
- Added capes to terminator
  - You can switch cape texture by changing `cape_custom.png`

#### Changes

- removed end portal sound when spawning terminator
- removed lightning bolt when terminator dies
- Removed GameTest compatibility
- Removed device based subpacks

#### Bug fixes

- Fixed several skin-related bugs
- Fixed path limit crash caused in console platform (specifically XBox)
- Updated GameTest API scripting to version 1.19.0
- Fixed translation error in Chinese and Spanish
  **2nd revision updates**
- Fixed GameTest Reference error: Native module error or file not found.
- Fixed failed to find either texture set or image file for terminator entity
- Fixed terminator render geometry controller

**Full Changelog**: https://github.com/JaylyDev/terminator/compare/v1.3.45...v1.3.70
**Discussion here**: https://discord.com/invite/8xzSHD84xv

### 1.3.45

**⚠️ This is a critical patch update for players that installed Terminator v1.3.40 - v1.3.44 on all Minecraft platforms excluding Windows. It's highly recommended to download and update the add-on.**

> For beta testers, there are currently no beta versions that fixed this issue.

#### Changes

This category shows things that existed in previous versions that's modified from the last public release `v1.3.43.2`

- Christmas themed skins of terminator will now only appear starting **December 19 to January 8** every year
- Christmas themed skins are removed from all platforms excluding Windows

#### Bug fix

This category shows bugs that existed in previous release `v1.3.43.2`

- GameTest Framework do not support javascript modules required by the add-on on all Minecraft platforms except Windows, this leads to Minecraft unloads the add-on when starting a world.

#### Installations:

**If you're installing this add-on on Windows 10 & 11:**

You can choose to download either [`terminator.windows_v1.3.45.0.mcaddon`](https://github.com/JaylyDev/terminator/releases/download/v1.3.45/terminator.windows_v1.3.45.0.mcaddon) on this page or [`terminator_v1.3.43.2.mcaddon`](https://github.com/JaylyDev/terminator/releases/download/v1.3.43/terminator_v1.3.43.2.mcaddon) on patch 1.3.43 changelog. There are no changes for Windows platform.

**If you're installing this add-on on other platforms:**

Download [`terminator.non-windows_v1.3.45.0.mcaddon`](https://github.com/JaylyDev/terminator/releases/download/v1.3.45/terminator.non-windows_v1.3.45.0.mcaddon)

#### Setup instructions

This add-on is released for Minecraft version 1.17.30 or above. These are the experimentals options required to be activated:

> This image is taken in Minecraft version 1.18
> ![image](https://user-images.githubusercontent.com/65847850/145708230-c6dde04e-3ee0-4121-9416-8089996f88ef.png)
> IF YOU HOST THIS ADD-ON IN XBOX PLATFORM, READ "Revision update for terminator add-on"

#### For versions below Minecraft version 1.17.30:

> **GameTest Framework will not be supported**, you can thank mojang for that
> ![image](https://user-images.githubusercontent.com/65847850/146677619-d181742f-5c32-4b1b-8f58-ab9b4f6a87d5.png)

- Release 1.3.43 changelog: [Click here](https://github.com/JaylyDev/terminator/releases/tag/v1.3.43)

- Release 1.3.40 changelog: [Click here](https://github.com/JaylyDev/terminator/releases/tag/v1.3.40)

---

#### 1/5/2022 Update:

**Experiments (For Xbox platform):**

Since Xbox do not support GameTest Framework and there have been reports of unable to import `terminator.non-windows_v1.3.45.0.mcaddon` into Minecraft: Try downloading the Windows version of Minecraft, import the add-on and **disable GameTest Framework** in world settings.
Beware: There are also reports of installing Windows version of the add-on to Xbox can cause Minecraft to crash. You must disable **GameTest Framework** when downloading Windows version of terminator add-on.

@JaylyDev is trying to fix this critical issue for Xbox users, please notify him if this works or not.

**If you ran into any issue, please create a bug report here: https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=bug&template=bug_report.md**

#### Changes

- Renamed `terminator.non-windows_v1.3.45.0.mcaddon` to `terminator.mobile_v1.3.45.1.mcaddon`

---

#### 1/6/2022 Update:

This add-on does not support **Beta 1.18.10.20 and beyond** for now, @JaylyDev will implement compatibility in the future

#### 1/10/2022 Update:

The latest beta version of terminator add-on now fixes all critical issues

### 1.3.43.2

**This is an important bug fix update, highly recommend update the add-on if you downloaded terminator v1.3.40 & v1.3.43.1**

#### Bug fix (Important)

This category shows things that existed in previous versions that's modified from the last public release `v1.3.43.1`

- Failed to find texture set for Terminator
  > Image from a report by ornage in Jayly's Discord
  > ![image](/assets/posts/terminator/terminator-textureset-missing.png)

> Image from a developer of Terminator add-on
> ![image](https://user-images.githubusercontent.com/65847850/147706728-e7ca39de-1477-4fa7-8f0e-99356af51c86.png)

> Content log when loading the add-on to Minecraft server
>
> ```
> [Texture][warning]-Failed to find either texture set or image file of name (ms-appx:/data/images/textures/entity/terminator/steve)
>
> [Texture][warning]-Failed to find either texture set or image file of name (ms-appx:/data/images/textures/entity/terminator/alex_xmas)
>
> [Texture][warning]-Failed to find either texture set or image file of name (ms-appx:/data/images/textures/entity/terminator/alex)
>
> [Texture][warning]-Failed to find either texture set or image file of name (ms-appx:/data/images/textures/entity/terminator/steve_xmas)
> ```

### 1.3.43.1

**This is an important bug fix update, highly recommend update the add-on if you downloaded terminator v1.3.40**

#### Bug fix (Important)

This category shows things that existed in previous versions that's modified from the last public release `v1.3.40`

- `/function` commands names are hashed
  > Image from a report by ornage in Jayly's Discord
  > ![image](https://user-images.githubusercontent.com/65847850/147704300-8b5864aa-0398-4b14-9c65-0d96e362cb4f.png)

### Patch 1.3.40.17

#### Bug fixes (Important)

This version fixes 2 important bugs from Revision version 13:

1. Unable to execute javascript files that needs by GameTest Framework

```
[Scripting][error]-Script plugin does not contain main file [scripts/gametests/Main.js].
```

2. Unable to render terminator's skins

```
[Rendering][error]-render_controllers/efa2a22a83688dafef5c8b18e2af2e89.json | render_controllers | controller.render.terminator | arrays | textures | Array.skins | child 'Array.skins' not valid here.

[Geometry][error]-entity:terminator | entity:terminator | Invalid render controller: controller.render.terminator
```

**If more bugs are caused after revision update v13 (v1.3.40.13), please submit a bug report as soon as possible [here](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=bug&template=bug_report.md&title=)**

### Patch 1.3.40.15

#### Bug fix

- Minecraft is not able to translate text (a bug from revision v13)

### Revision Update 1.3.40.13

#### New change (Experimental)

- The filenames in `.mcaddon` file has been 'encrypted'

#### Changes

- Extend expire date for Terminator Christmas themed skin to January 24

### Patch 1.3.40.12

#### New features

This category shows things that added from the last public release `v1.3.20`

- New skins for terminator
  > Christmas skins only display in Minecraft from December 1st to December 25th.
  > The add-on will change their skin back to normal afterwards.
  > ![image](https://user-images.githubusercontent.com/65847850/146676835-714030a5-dc79-4ba2-b4d8-07004d39b98d.png)
- Added 2 function commands on `NBT tags` category
  - `/function terminator/nbt/enableBossbar` - Enables terminator's bossbar
  - `/function terminator/nbt/noregen` - Disables terminator's regeneration when its health is low for the first time
- Added new function terminator category: `debug`
  - `/function terminator/debug/components/*` - Used for developers to debug terminator's properties existance
  - `/function terminator/debug/commands/*` - Used for developers to debug commands related terminator's stuff
- Added `contents.json` for both behavior and resource pack
- Add-on now uses "GameTest Framework" as one of add-on's dependencies
- Entity now spawns with the name tag "Terminator"
- Dimension pathfinding for terminator is now possible with limitation for now
- Add-on is now translated to 29 languages

```jsonc
// File location: data/resource_pack/texts/language_names.json
[
  ["en_US", "English (US)"],
  ["en_GB", "English (UK)"],
  ["de_DE", "Deutsch (Deutschland)"],
  ["es_ES", "Español (España)"],
  ["es_MX", "Español (México)"],
  ["fr_FR", "Français (France)"],
  ["fr_CA", "Français (Canada)"],
  ["it_IT", "Italiano (Italia)"],
  ["ja_JP", "日本語 (日本)"],
  ["ko_KR", "한국어 (대한민국)"],
  ["pt_BR", "Português (Brasil)"],
  ["pt_PT", "Português (Portugal)"],
  ["ru_RU", "Русский (Россия)"],
  ["zh_CN", "简体中文"],
  ["zh_TW", "繁體中文"],
  ["nl_NL", "Nederlands (Nederland)"],
  ["bg_BG", "Български (BG)"],
  ["cs_CZ", "Čeština (Česká republika)"],
  ["da_DK", "Dansk (DA)"],
  ["el_GR", "Ελληνικά (Ελλάδα)"],
  ["fi_FI", "Suomi (Suomi)"],
  ["hu_HU", "Magyar (HU)"],
  ["id_ID", "Bahasa Indonesia (Indonesia)"],
  ["nb_NO", "Norsk bokmål (Norge)"],
  ["pl_PL", "Polski (PL)"],
  ["sk_SK", "Slovensky (SK)"],
  ["sv_SE", "Svenska (Sverige)"],
  ["tr_TR", "Türkçe (Türkiye)"],
  ["uk_UA", "Українська (Україна)"]
]
```

- Added 30 death messages for terminator to display when they die

#### Changes

This category shows things that existed in previous versions that's modified from the last public release `v1.3.20`

- Watermark changed to this
  ![image](https://user-images.githubusercontent.com/65847850/146676739-96134182-4b1d-444d-b314-a9999a578252.png)
- GitHub: Moved `BP` and `RP` folder to `data/behavior_pack` and `data/resource_pack`
- Bossbar now becomes an optional feature (Disabled by default from now on)
- Removed some cache files from behavior and resource pack
  > The files have been moved to `resources` folder

#### Bug fixes

This category shows things that existed in previous versions that's modified from the last public release `v1.3.20`

- Removed glowing obsidian from terminator build block list

#### Installations:

**This add-on is released for Minecraft version 1.17.30 or above**

When you're installing this add-on in Minecraft 1.17.30, these are the experimentals options required to be activated.

![image](https://user-images.githubusercontent.com/65847850/146676644-0265f2a8-3fec-4ef8-bae8-1b25ff944e09.png)

**For versions below Minecraft version 1.17.30:**

> **GameTest Framework will not be supported**, you can thank mojang for that
> ![image](https://user-images.githubusercontent.com/65847850/146677619-d181742f-5c32-4b1b-8f58-ab9b4f6a87d5.png)

**Full Changelog**: https://github.com/JaylyDev/terminator/compare/v1.3.20...v1.3.40

### 1.3.20

#### New features

This category shows things that added from the last release

- Added optimization for terminator break blocks module

  > If there are 5 terminators or less on a 64 blocks area, terminator destroys blocks and drops items
  > If there are more than 5 terminators, terminator will still destroy blocks but will not drop items

- Added the ability to summon terminator with custom made NBT tags

  > Terminator's spawn command with NBT tags:
  >
  > - `/function terminator/invulnerable` - Makes terminator invulnerable to everything except the Void
  > - `/function terminator/nodeathevent` - Disables terminator's death event
  > - `/function terminator/nophysics` - Disables terminator's physics
  > - `/function terminator/norespawn` - Disables terminator's respawn ability

- Added "message.entity.respawn.generic" language tag for future translation update
- Added snowball combat
- Added "minecraft:block_climber"to make it compatible for Minecraft v1.17.10.22 or above
- Added "minecraft:strength"

#### Changes

This category shows things that existed in previous versions that's modified from the last release

- Terminator now belongs to family of 'terminator' and 'player'
- Terminator now deals 1-3 damage to mobs
- Terminator now uses the same death message as Minecraft
- Removed tellraw messages from death event (https://mcpedl.com/mc-terminator-addon-1/#comment-575490)
- Reduced particles from terminator's death event for low-end devices
- Removed camera block from terminator break block list
- Increased HP from 40 to 60 (also suggested by https://mcpedl.com/mc-terminator-addon-1/#comment-585361)

#### Bug fixes

This category shows things that existed in previous versions that's modified from the last release

- Terminator's breathing mechanic is now the same as players
- Terminator now won't stop suddenly in water
- Terminator now has the same movement speed value as the player (https://mcpedl.com/mc-terminator-addon-1/#comment-585556)
- Terminator now avoid more blocks that causes entities to take damage (https://mcpedl.com/mc-terminator-addon-1/#comment-585361)
- Edited github repository links in both packs
- Terminator now has a name tag when terminator respawns

### Release 1.3.0.50

> Release Date: 19/9/2021

Offical release for Minecraft Terminator v1.3.0

#### New features

This category shows things that added from the last release

- Added "AdvancedBuilding" module into animation controller

  > "AdvancedBuilding" module is not used at all in current version of add-on

  > I left cache files there just so people who found those could experiment it

  > The folder has been set to read-only

  > For more info check "README.txt" on "BP/animation_controllers/AdvancedBuilding"

- Updated Terminator's **building module** from v1 to v2 (Build 186)
- Updated Terminator's **break blocks module** from v1 to v2
- **Added various combat method** to terminator
- Added an event that allows terminator to make a nether portal (WIP)

  > Since this event is not possible to be executed by the terminator automatically, this requires players to execute it for the terminator.

  > Execute this command `/event entity @e[family=terminator] terminator:make_nether_portal` to execute this event for terminator

- Added various animations to terminator's property
- Added `/function terminator/nodeathevent`: This summons the terminator that excludes death event
- Added `/function terminator/changelog`: This shows terminator add-on changelog
- Added components related to the association with the terminator and powder snow
- Terminator now avoids TNTs and creepers
- Terminator can now walk in lava
- Terminator can now path from air
- Terminator now avoid lava and flowing lava

##### Combat Changelog

In order for the terminator to use different kinds of combat, they need to pick up the weapon in order to switch combat mechanic.

- Added crossbow into terminator's combat method
  Terminator is now able to use crossbow to shoot arrows
- Added bow into terminator's combat method
  Terminator is now able to use bow to shoot arrows
- Added shield to terminator's combat method

  The shield disables damage cause by:

  - Block explosion
  - Entity attack
  - Entity explosion
  - Projectile

- Speed multiplier for melee combat has been increased to 130%
- Terminator's attack damage has been decreased from 3 damage to 1
- Added crossbow to list of items terminator wants
- Added trident ranged and melee combat into terminator's combat method

#### Changes

This category shows things that existed in previous versions that's modified from the last release

- Changed terminator's movement speed from 0.4-0.5 to 0.4317
- Decreased terminator's health from 100hp to 40hp
- Removed doors and trapdoors from terminator's breakable blocks list
- Bossbar range has decreased from 1024 to 64 blocks radius
- Improved terminator's escape pathfinding
- Modified Terminator's generic pathfinding
- Terminator now attacks tamed wolfs that doesn't have the invisibility effect
- Modified `/function terminator/changelog` format
- Fix a bug related to `/function terminator/kit/*` commands
- Minimum Engine Version has been updated from 1.16.100 to 1.17.0
  Terminator add-on now uses a more recent version of Minecraft.
- Modified Terminator's sitting environment
  Terminator now leaves rideable entities (boat & minecart) when their target is player or iron golem
- Changed terminator spawning loot table
- Terminator is now able to track players within a 2048 blocks radius
- Players now can only feed terminator that does not have full health or a target

#### Bug fixes

<!-- Compare v1.2.23 to v1.3.0 -->

Following bugs have been fixed in this version of add-on:

- Variable 'variable.dummytime' is now handled when terminator's respawn event starts

  [Molang][error]-Error: unhandled request for unknown variable 'variable.dummytime'

  Bug occurs from v1.1.7 to v1.2.23 and v1.2.100

- Terminator spawning sound effect can now only hear by nearby players

  Terminator spawning sound effect was heard all over the world

  Bug occurs from v1.1.0 to v1.2.23 and v1.2.100

- Removed "speed_multiplier" and "ranged_fov" from ranged attack

  Ranged attack is broken

<!-- Compare beta v1.2.11 to v1.2.23 -->

- Entities no longer get damaged by the particles happened in the respawn event

  Bug occurs from v1.1.7 to v1.2.11

- Fixed terminator's building issues
- Fixed terminator's environment sensor
- Fixed terminator's target AI behaviours

### 1.2.10.3

> Release Date: 23/8/2021

#### Changes

- Removed respawn fog after respawn event ends
- Entities now takes damage when they get too close to where the terminator respawn during the respawn event
- Respawn event now only happen once to every terminator
- Terminator respawns almost immediately after the respawn event occured
- Reduced explode power happened in the respawn event
- Terminator now have the ability to load and unload chunks like a player
- Improved terminator's pathfinding when it's low on health
- Increased bossbar range from 64 blocks to 1024 blocks radius
- Fixed the amount of damage done each tick when terminator takes damage by lava
- Removes the limit of terminator's teleportation when it's too far away from nearest player
- Spawning a terminator via function commands will include a nametag on the terminator

### 1.2.0.10

> Release Date: 12/8/2021

- Redesigned the terminator death event
- Fix a bug that causes the terminator to break illegal blocks
- Modified `/function terminator` command
- Changed changelog command from `/function changelog` to `/function terminator/changelog` for compatibility
- Terminator now runs away from players when their health is less than 20 (only happens once every life)
- Terminator now consume the following effects when their health is less than 20 (only happens once every life)

| Effects         | Durations  | Amplifier |
| --------------- | ---------- | --------- |
| Regeneration    | 6 seconds  | 4         |
| Absorption      | 24 seconds | 3         |
| Resistance      | 60 seconds | 0         |
| Fire resistance | 60 seconds | 0         |

- Modified requirements for the terminator to fight entities
  > The following image is the requirement for the terminator to fight one of the entities

![requirements](/assets/posts/terminator/requirements-old.png)

### 1.1.2

> Release Date: 19/7/2021

- Added Terminator crafting recipe by May5Flames
  ![recipe](/assets/posts/terminator/terminator-recipe.png)

- The terminator can now respawn when dies
- Added 2 function commands

`/function terminator/killall`

> This kills every terminator and they will not respawn

`/function terminator`

> This spawns a terminator

- Changed movement speed from 0.55 to 0.4
- Terminator now gives himself regeneration, absorption and resistance when its health is lower than 10hp
- You can now feed the terminator

> Feed the terminator like a horse with the following food:
>
> - Apple
> - Baked Potato
> - Beetroot
> - Beetroot Soup
> - Bread
> - Cake
> - Carrot
> - Cooked Beef
> - Cooked Chicken
> - Cooked Cod
> - Cooked Mutton
> - Cooked Porkchop
> - Cooked Rabbit
> - Cooked Salmon
> - Cookie
> - Dried Kelp
> - Enchanted Golden Apple
> - Golden Apple
> - Glow Berries
> - Golden Carrot
> - Honey Bottle
> - Melon Slice
> - Mushroom Stew
> - Poisonous Potato
> - Potato
> - Pufferfish
> - Pumpkin Pie
> - Rabbit Stew
> - Raw Beef
> - Raw Chicken
> - Raw Cod
> - Raw Mutton
> - Raw Porkchop
> - Raw Rabbit
> - Raw Salmon
> - Rotten Flesh
> - Spider Eye
> - Sweet Berries
> - Tropical Fish

- Terminator is now able to bridge
- Terminator now has a sound effect when spawning
- Mininum engine version has been changed from 1.16.220 to 1.16.100

### 1.0.0

> Release Date: July 06, 2021

Initial Release

## Installation

After downloading the add-on below and import the add-on to Minecraft, **make sure both resource pack and behavior pack are imported** so you do not have the error related to incompatibility when applying the add-on.

**Join my Discord server** or **report to Terminator GitHub Repository** if there are any issues, questions and feedbacks regarding to the add-on's installation or the gameplay.

Terminator entity can cause massive destruction. **Please save a copy of your world** before activating this add-on!

You are allowed to repost this add-on to other websites or make a YouTube video for commercial purposes, provided that you must put the link this post or the MCPEDL post in the description of the video or a webpage and must not have any other direct-download links.

This add-on is compatible with **Minecraft Bedrock v1.20.70 or above**. It won't work on Minecraft Education (unless you're using Preview)

## Downloads

Click the link below and choose a version to download.

- [Download Minecraft Terminator Add-On](/posts/terminator/downloads/)
- [Submit a bug report to improve the add-on](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=)
- [Suggest an idea for this add-on](https://github.com/JaylyDev/terminator/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=)
- [Support Discord Server](https://discord.com/invite/SuhGvZEXb4)
