---
author: Jayly
title: Bedrock Statistics Add-On
description: The Bedrock Statistics Add-On tracks player statistics in a Minecraft Bedrock world.
date: 3/25/2025
image: /assets/posts/statistics/thumbnail.png
download: true
---

# Bedrock Statistics Add-On

![stats_promo_art](/assets/posts/statistics/thumbnail.png)

The Bedrock Statistics Add-On tracks player statistics in a Minecraft Bedrock world. This is similar to the Statistics in-game feature presented in Java Edition, where statistics in the form of numerical data, such as time played, number of blocks mined are tracked per world.

## Statistics Screen

Currently, a player's statistics can be seen through the following methods:

1. Function command, available in the main statistics add-on:

```
/function statistics
```

2. The statistics book given when you join the world for the first time. By which a tag (`stats_book_given`) will be assigned as they have been given the book.

3. Custom Commands (requires Minecraft Statistics Extension Pack, downloads separately)

```
/jayly:stats
```

![main screen](/assets/posts/statistics/main-screen-v1.2.0.png)

Similar to the Java Edition statistics' screen, this add-on divides statistics into three sections:

- **General** - Displays generic statistics of an indiviual player.
- **Items** - Displays the number of times different items and blocks have been broken, crafted, used to destroy blocks, picked up and dropped.
- **Mobs** - Shows for each different type of mobs or other living entities (players, armor stands) how many the player has killed, or the number of deaths caused by those mobs.
- **Settings** - Change preference when viewing statistics.

## Item Statistics

Item statistics are viewed by each item type. To view player statistics for a specific item type, go to the **Statistics** screen, tap the **Items** button, then select the button for the desired item type.

![item selection screen](/assets/posts/statistics/item-selection.png)

You'll then see detailed statistics on how players have interacted with that item.

![item statistics screen](/assets/posts/statistics/item-statistics.png)

The following statistic types are recorded for each item type:

| Statistic Type | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| Block Mined    | Tracks how many blocks of a specific type a player has mined.               |
| Item Broken    | Counts when an item breaks due to zero durability while breaking a block.   |
| Item Used      | Increases when a player uses an item or block, including block interactions |
| Item Picked Up | Tracks the number of dropped items a player picked up.                      |
| Item Dropped   | Counts the number of items of a specific type from player's inventory.      |

> [!NOTE]  
> The add-on also records item statistics for custom items, but translation for custom items may not be displayed properly in the items selection form.

## Mob Statistics

Mobs statistics are viewed by each entity type. To view player statistics for a specific mob type, go to the **Statistics** screen, tap the **Mobs** button, then select the button for the desired mob type.

![mobs selection screen](/assets/posts/statistics/mobs-selection.png)

You'll then see detailed statistics on how players have interacted with that mob.

![mobs statistics screen](/assets/posts/statistics/mobs-statistics.png)

This add-on records the following statistics for each mob type:

| Statistic Type                            | Description                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Number of entities killed                 | Tracks the number of entities a player killed. Statistic increases when a player kills an entity of the specified type.               |
| Number of times player killed by entities | Tracks the times of a player is killed by entities. Statistic increases when the player is killed by an entity of the specified type. |

## General Statistics

![general statistics screen](/assets/posts/statistics/general-stats.png)

Known as custom statistics. These statistics includes generic statistics for a player. The following statistics are tracked by the add-on:

### Player Interactions with Cauldrons

Statistics related to a player interacting Minecraft's cauldron block with various items.

| Statistic Name            | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| Armor Pieces Cleaned      | The number of dyed leather armors washed with a cauldron.                    |
| Banners Cleaned           | The number of banner patterns washed with a cauldron.                        |
| Cauldrons Filled          | The number of times the player filled cauldrons with water buckets.          |
| Shulker Boxes Cleaned     | The number of times the player has washed a shulker box with a cauldron.     |
| Water Taken from Cauldron | The number of times the player took water from cauldrons with glass bottles. |

### Player Interactions with Vanilla Blocks

Statistics related to a number of times player has interacted with a vanilla Minecraft block type.

- Barrels Opened
- Bells Rung
- Cake Slices Eaten
- Chests Opened
- Dispensers Searched
- Droppers Searched
- Ender Chests Opened
- Hoppers Searched
- Interactions with Anvil
- Interactions with Beacon
- Interactions with Blast Furnace
- Interactions with Brewing Stand
- Interactions with Campfire
- Interactions with Cartography Table
- Interactions with Crafting Table
- Interactions with Furnace
- Interactions with Grindstone
- Interactions with Lectern
- Interactions with Loom
- Interactions with Smithing Table
- Interactions with Smoker
- Interactions with Stonecutter
- Trapped Chests Triggered

### Player's Health Statistics

Statistics related to a player hurts another entity, or a player is hurt.

| Statistic Name  | Description                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Damage Absorbed | The amount of damage the player has absorbed in health points (1 heart = 2 health points).                                                       |
| Damage Dealt    | The amount of damage the player has dealt in health points (1 heart = 2 health points).<br>This includes every damage cause dealt by the player. |
| Damage Taken    | The amount of damage the player has taken in health points (1 heart = 2 health points).<br>This includes every damage cause taken by the player. |

### Player's Distance Traveled Statistics

Statistics related to Total distance traveled by a player in the Minecraft world.

| Statistic Name              | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| Distance Climbed            | Total distance player has climbed.                         |
| Distance Flown              | Total distance player has flown.                           |
| Distance Sprinted           | Total distance player has sprinted.                        |
| Distance Swum               | Total distance covered with sprint-swimming.               |
| Distance Walked             | Total distance walked.                                     |
| Distance Walked on Water    | The distance covered while bobbing up and down over water. |
| Distance Walked under Water | Total distance you have walked underwater.                 |
| Distance by Boat            | Total distance traveled by boats.                          |
| Distance by Elytra          | Total distance traveled by elytra.                         |
| Distance by Horse           | Total distance traveled by horses.                         |
| Distance by Minecart        | Total distance traveled by minecarts.                      |
| Distance by Pig             | Total distance traveled by pigs via saddles.               |
| Distance by Strider         | Total distance traveled by striders via saddles.           |

### Various Minecraft Statistics

These statistics are implemented to match Java Edition's existing statistics.

- **Items Dropped**: The number of items dropped. This does not include items dropped upon death. Stacked blocks count as 1.
- **Jumps**: Total number of jumps performed.
- **Mob Kills**: The number of mobs the player killed.
- **Music Discs Played**: The number of music discs played on a jukebox.
- **Note Blocks Played**: The number of note blocks hit.
- **Note Blocks Tuned**: The number of times player has interacted with note blocks.
- **Number of Deaths**: The number of times the player died.
- **Plants Potted**: The number of plants potted onto flower pots.
- **Player Kills**: The number of players the player killed. Indirect kills do not count.
- **Raids Triggered**: The number of times the player has triggered a raid.
- **Raids Won**: The number of times the player has won a raid.
- **Shulker Boxes Opened**: The number of times the player has opened a shulker box.
- **Sneak Time**: The time the player has held down the sneak button.
- **Talked to Villagers**: The number of times player has interacted with villagers (opened the trading GUI).
- **Targets Hit**: The number of times the player has shot a target block.
- **Time Played**: Total amount of time played. If the game is paused, counting does not continue.
- **Time Since Last Death**: The time since the player's last death.
- **Time Since Last Rest**: The time since the player's last rest.
- **Time with World Open**: Total amount of time the world was opened. Unlike Play Time, if the game is paused this number continues to increase, but it does not change visually while the statistics menu is open.
- **Times Slept in a Bed**: The number of times the player has slept in a bed.

## Settings Screen

![settings screen](/assets/posts/statistics/settings-screen.png)

The settings screen allows you to set your own preferences when viewing statistics.

- **Items: Sort by** - Sort the items types in Item Statistics screen.
- **Mobs: Sort by** - Sort the entity types in Mobs Statistics screen.

## Custom Slash Commands

> [!IMPORTANT]
>
> - This feature requires Minecraft Statistics Extension Pack, downloads separately.
>
>   ![Extension pack](/assets/posts/statistics/extension-pack.png)
>
> - You also need to enable Beta APIs experiment to access Custom Command APIs.

### /jayly:stats

**Alt command: /stats** (Available in Minecraft v1.21.90 / StatisticPlus v0.3.0, when this custom command name is only used by this Add-On.)

Opens up the gameplay statistics screen to a player.

**Syntax**

- `jayly:stats`

### /jayly:itemstats

**Alt command: /itemstats** (Available in Minecraft v1.21.90 / StatisticPlus v0.3.0, when this custom command name is only used by this Add-On.)

Manages the updating of item related statistics on scoreboard objectives. This command can be run by game directors / operators.

**Syntax**

- `jayly:itemstats track <targetObjective: string> <itemStatisticType> <itemName: Item>`
- `jayly:itemstats untrack <targetObjective: string>`

**Arguments**

- targetObjective (`track` mode only): Specifies the name of the objective to be updated with the result returned by stat.
- targetObjective (`untrack` mode only): Specifies the name of the objective to not be updated by statistics plus add-on.
- itemStatisticType: Type of statistic to be tracked in targeted scoreboard objective. Accepted values: `jayly:mined`, `jayly:broken`, `jayly:used`, `jayly:picked_up`, `jayly:dropped`
- itemName: Specifies the item to track.

### /jayly:mobstats

**Alt command: /mobstats** (Available in Minecraft v1.21.90 / StatisticPlus v0.3.0, when this custom command name is only used by this Add-On.)

Manages the updating of mob related statistics on scoreboard objectives. This command can be run by game directors / operators.

**Syntax**

- `jayly:mobstats track <targetObjective: string> <mobStatisticType> <entityType: string>`
- `jayly:mobstats untrack <targetObjective: string>`

**Arguments**

- targetObjective (`track` mode only): Specifies the name of the objective to be updated with the result returned by stat.
- targetObjective (`untrack` mode only): Specifies the name of the objective to not be updated by statistics plus add-on.
- mobStatisticType: Type of statistic to be tracked in targeted scoreboard objective. Accepted values: `jayly:killed`, `jayly:killed_by`
- entityType: Specifies the entity to track. Namespace including `minecraft` is required in field, e.g. (`minecraft:zombie`, `creator:entity`)

### /jayly:customstats

**Alt command: /customstats** (Available in Minecraft v1.21.90 / StatisticPlus v0.3.0, when this custom command name is only used by this Add-On.)

Manages the updating of general statistics on scoreboard objectives. This command can be run by game directors / operators.

**Syntax**

- `jayly:customstats track <targetObjective: string> <statisticType> <statistic: enum>`
- `jayly:customstats untrack <targetObjective: string>`

**Arguments**

- targetObjective (`track` mode only): Specifies the name of the objective to be updated with the result returned by stat.
- targetObjective (`untrack` mode only): Specifies the name of the objective to not be updated by statistics plus add-on.
- statisticType: Type of statistic to be tracked in targeted scoreboard objective. Accepted values: `jayly:custom`
- statistic: Specifies the statistic in general tab to track. Accepted values:
  - minecraft:clean_armor
  - minecraft:clean_banner
  - minecraft:open_barrel
  - minecraft:bell_ring
  - minecraft:eat_cake_slice
  - minecraft:fill_cauldron
  - minecraft:open_chest
  - minecraft:damage_dealt
  - minecraft:damage_taken
  - minecraft:inspect_dispenser
  - minecraft:climb_one_cm
  - minecraft:crouch_one_cm
  - minecraft:fall_one_cm
  - minecraft:fly_one_cm
  - minecraft:sprint_one_cm
  - minecraft:swim_one_cm
  - minecraft:walk_one_cm
  - minecraft:walk_on_water_one_cm
  - minecraft:walk_under_water_one_cm
  - minecraft:boat_one_cm
  - minecraft:aviate_one_cm
  - minecraft:horse_one_cm
  - minecraft:minecart_one_cm
  - minecraft:pig_one_cm
  - minecraft:strider_one_cm
  - minecraft:inspect_dropper
  - minecraft:open_enderchest
  - minecraft:fish_caught
  - minecraft:leave_game
  - minecraft:inspect_hopper
  - minecraft:interact_with_anvil
  - minecraft:interact_with_beacon
  - minecraft:interact_with_blast_furnace
  - minecraft:interact_with_brewingstand
  - minecraft:interact_with_campfire
  - minecraft:interact_with_cartography_table
  - minecraft:interact_with_crafting_table
  - minecraft:interact_with_furnace
  - minecraft:interact_with_grindstone
  - minecraft:interact_with_lectern
  - minecraft:interact_with_loom
  - minecraft:interact_with_smithing_table
  - minecraft:interact_with_smoker
  - minecraft:interact_with_stonecutter
  - minecraft:drop
  - minecraft:jump
  - minecraft:mob_kills
  - minecraft:play_record
  - minecraft:play_noteblock
  - minecraft:tune_noteblock
  - minecraft:deaths
  - minecraft:pot_flower
  - minecraft:player_kills
  - minecraft:raid_trigger
  - minecraft:raid_win
  - minecraft:clean_shulker_box
  - minecraft:open_shulker_box
  - minecraft:sneak_time
  - minecraft:talked_to_villager
  - minecraft:target_hit
  - minecraft:play_time
  - minecraft:time_since_death
  - minecraft:time_since_rest
  - minecraft:total_world_time
  - minecraft:sleep_in_bed
  - minecraft:trigger_trapped_chest
  - minecraft:use_cauldron

## Upcoming Releases

**Statistics Plus Add-On - v0.3.0**

> **This is an upcoming Release for Minecraft v1.21.90, release date is unknown.**

- Statistics Plus Add-On v0.3.0 requires Minecraft v1.21.90
- Following custom commands can execute without cheats enabled: `/jayly:stats`, `/stats`.
- Add-on now attempts to add custom slash commands without namespace, such as `/stats`, `/itemstats`, `/mobstats`, `/customstats`, `/liststats`. This is only possible if the custom command name is not used by another behavior pack, otherwise those command names will not be created and a content log warning will appear.

## Changelog

### v1.3.0

> Release Date: May 9th, 2025

- Texture update: Image icon support for vanilla items, blocks and entities in Item statistics and Mobs statistics selection menu.
- Custom UI texture for 'Next page' and 'Previous Page' buttons in Item statistics and Mobs statistics selection menu.

**Statistics Plus Add-On - v0.2.0**

- Renamed 'Statistics Extension pack' behavior pack to 'Statistics Plus Add-On', this doesn't mean it's locked behind a paywall.
- Add-On now requires Minecraft v1.21.80
- Added slash command `/jayly:stats` - A replacement for `/function statistics` command to view your gameplay statistics. This command can be run by any players.
- Added slash command `/jayly:itemstats` - Manages the updating of item related statistics on scoreboard objectives. This command can be run by game directors / operators.
- Added slash command `/jayly:mobstats` - Manages the updating of mobs related statistics on scoreboard objectives. This command can be run by game directors / operators.
- Added slash command `/jayly:customstats` - Manages the updating of general statistics on scoreboard objectives. This command can be run by game directors / operators.
- Added slash command `/jayly:liststats` - List available in-game statistics. This command can be run by game directors / operators.

### Previous Releases

Changelog for previous releases are available [here](/posts/statistics-changelog/).

## Installation

1. Download the add-on from the link below.
2. Import the pack, then activate the add-on in world settings.

   ![enable pack](/assets/posts/statistics/enable-pack.png)

3. Enable Beta APIs experiment, if you're using StatisticPlus pack.

   ![enable experiments](/assets/posts/script-repl-minecraft/enable-experiments.png)

After activating both resource pack and behavior pack, you will see one of the following messages when loading the world with the pack activated correctly:

- The pack is activated correctly on a brand new world

  ```
  [Scripting][inform]-[Statistics] Add-On starts collecting statistics.
  ```

- The pack is activated correctly on an existing world

  ```
  [Scripting][warning]-[Statistics] Add-On starts collecting statistics on existing worlds. Please be aware that statistics prior to this moment are not collected.
  ```

4. View your gameplay statistics [using these methods](#statistics-screen).

## Credits

- [Minecraft Wiki](https://minecraft.wiki/w/Statistics)
- [Minecraft Bedrock Dedicated Server API metadata](https://github.com/bedrock-apis/bds-docs/)
- [Bedrock Samples](https://github.com/Mojang/bedrock-samples/)
- Minecraft: Java Edition - Statistics translations

## Downloads

> [!IMPORTANT]
>
> - If you're on Minecraft Education, 'Beta APIs' experiment is required to use this add-on.
> - This add-on can only be used in latest version of either Minecraft or Minecraft Education.

- [Download Bedrock Statistics on CurseForge](https://www.curseforge.com/minecraft-bedrock/addons/minecraft-statistics/download/6512391)
- [Download Statistics Plus on CurseForge](https://www.curseforge.com/minecraft-bedrock/addons/minecraft-statistics/download/6512390)
- [All Releases & Downloads](/posts/statistics/downloads/)
