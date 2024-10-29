---
author: Jayly
title: Minecraft Statistics
description: Track certain tasks in the form of numerical data in Minecraft Bedrock Edition.
date: 10/23/2024
image: /assets/posts/statistics/thumbnail.png
download: true
---

# Minecraft Statistics

![stats_promo_art](/assets/posts/statistics/thumbnail.png)

The Minecraft Statistics Add-On allows players to track certain tasks in the form of numerical data in a Minecraft: Bedrock Edition world. This is similar to the Statistics in-game feature presented in Java Edition.

## Statistics Screen

Currently, a player's statistics can be seen through the following function command:

```
/function statistics
```

or the statistics book given when you join the world for the first time. By which a tag (`stats_book_given`) will be assigned as they have been given the book.

![main screen](/assets/posts/statistics/main-screen.png)

Similar to the Java Edition statistics' screen, this add-on divides statistics into three sections:

- **General** - The General screen displays a multitude of generic statistics that are listed in the form.
- **Items** - The Items screen displays the number of times different items and blocks have been broken, crafted, used to destroy blocks, picked up and dropped.
- **Mobs** - The Mob screen shows for each different type of mobs or other living entities (players, armor stands) how many the player has killed, or the number of deaths caused by those mobs.

## Item Statistics

![item statistics screen](/assets/posts/statistics/item-statistics.png)

Item statistics are viewed by each item type. The following statistic types are recorded:

| Statistic Type | Description                                                                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Block Mined    | Statistics related to the number of a particiuar block type a player has mined.                                                                                                                                                         |
| Item Broken    | Statistics related to the number of times when a player cause an item's durability to go to negative. Players' statistic increases when `playerBreakBlock` API event fires and the item before breaking a block has durability of zero. |
| Item Used      | Statistics related to the number of block or item used. Players' statistic increases when a player uses a block or item, this includes when the block or item triggers a block interaction (via `itemUseOn` API event).                 |
| Item Picked Up | Statistics related to the number of dropped items a player picked up. Players' statistic increases when the player picks up a dropped item of the specified type.                                                                       |
| Item Dropped   | Statistics related to the number of items that droped. Players' statistic increases when a player drops an item of the specified type from inventory.                                                                                   |

> [!NOTE]  
> The add-on also records item statistics for custom items, but translation for custom items may not be displayed properly in the items selection form.

## Mob Statistics

![mobs statistics screen](/assets/posts/statistics/mobs-statistics.png)

For mob statistics, they are divided into statistics for each entity type. This add-on records the following mob statistics:

| Statistic Type                            | Description                                                                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Number of entities killed                 | Statistics related to the number of entities a player killed. Players' statistic increases when a player kills an entity of the specified type.                  |
| Number of times player killed by entities | Statistics related to the times of a player being killed by entities. Players' statistic increases when the player is killed by an entity of the specified type. |

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

Statistics related to a player interacting with Vanilla Minecraft blocks.

| Statistic Name                      | Description                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Barrels Opened                      | The number of times the player has opened a barrel.                                                                |
| Bells Rung                          | The number of times the player has rung a bell.                                                                    |
| Cake Slices Eaten                   | The number of cake slices eaten.                                                                                   |
| Chests Opened                       | The number of times the player opened chests.<br>This excludes trapped chests, ender chests and other chest types. |
| Dispensers Searched                 | The number of times player has interacted with dispensers.                                                         |
| Droppers Searched                   | The number of times interacted with droppers.                                                                      |
| Ender Chests Opened                 | The number of times the player opened ender chests.                                                                |
| Hoppers Searched                    | The number of times interacted with hoppers.                                                                       |
| Interactions with Anvil             | The number of times interacted with anvils.                                                                        |
| Interactions with Beacon            | The number of times interacted with beacons.                                                                       |
| Interactions with Blast Furnace     | The number of times interacted with blast furnaces.                                                                |
| Interactions with Brewing Stand     | The number of times interacted with brewing stands.                                                                |
| Interactions with Campfire          | The number of times interacted with campfires.                                                                     |
| Interactions with Cartography Table | The number of times interacted with cartography tables.                                                            |
| Interactions with Crafting Table    | The number of times interacted with crafting tables.                                                               |
| Interactions with Furnace           | The number of times interacted with furnaces.                                                                      |
| Interactions with Grindstone        | The number of times interacted with grindstones.                                                                   |
| Interactions with Lectern           | The number of times interacted with lecterns.                                                                      |
| Interactions with Loom              | The number of times interacted with looms.                                                                         |
| Interactions with Smithing Table    | The number of times interacted with smithing tables.                                                               |
| Interactions with Smoker            | The number of times interacted with smokers.                                                                       |
| Interactions with Stonecutter       | The number of times interacted with stonecutters.                                                                  |
| Trapped Chests Triggered            | The number of times the player opened trapped chests.                                                              |

### Player's Health Statistics

Statistics related to a player hurts another entity, or a player is hurt.

| Statistic Name  | Description                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Damage Absorbed | The amount of damage the player has absorbed in health points (1 heart = 2 health points).                                                       |
| Damage Dealt    | The amount of damage the player has dealt in health points (1 heart = 2 health points).<br>This includes every damage cause dealt by the player. |
| Damage Taken    | The amount of damage the player has taken in health points (1 heart = 2 health points).<br>This includes every damage cause taken by the player. |

### Player's Distance Traveled Statistics

Statistics related to the total distance traveled by a player in the Minecraft world.

| Statistic Name              | Description                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Distance Climbed            | The total distance traveled up ladders or vines.<br>The statistic increments when `Player::isClimbing` is true.                                                 |
| Distance Flown              | Distance traveled upward and forward at the same time, while more than one block above the ground.<br>The statistic increments when `Player::isFlying` is true. |
| Distance Sprinted           | The total distance sprinted.<br>The statistic increments when `Player::isSprinting` is true.                                                                    |
| Distance Swum               | The total distance covered with sprint-swimming.                                                                                                                |
| Distance Walked             | The total distance walked.                                                                                                                                      |
| Distance Walked on Water    | The distance covered while bobbing up and down over water.                                                                                                      |
| Distance Walked under Water | The total distance you have walked underwater.                                                                                                                  |

### Items Dropped

The number of items dropped. This does not include items dropped upon death. Stacked blocks count as 1.

### Jumps

The total number of jumps performed.

### Mob Kills

The number of mobs the player killed.

### Music Discs Played

The number of music discs played on a jukebox.

### Note Blocks Played

The number of note blocks hit.

### Note Blocks Tuned

The number of times interacted with note blocks.

### Number of Deaths

The number of times the player died.

### Plants Potted

The number of plants potted onto flower pots.

### Player Kills

The number of players the player killed. Indirect kills do not count.

### Raids Triggered

The number of times the player has triggered a raid.

### Raids Won

The number of times the player has won a raid.

### Shulker Boxes Opened

The number of times the player has opened a shulker box.

### Sneak Time

The time the player has held down the sneak button (tracked in ticks).

### Talked to Villagers

The number of times interacted with villagers (opened the trading GUI).

### Targets Hit

The number of times the player has shot a target block.

### Time Played

The total amount of time played (tracked in ticks). If the game is paused, counting does not continue.[note 1]

### Time Since Last Death

The time since the player's last death (tracked in ticks).

### Time Since Last Rest

The time since the player's last rest (tracked in ticks). If this value is greater than 1.00h (3 days ingame), phantoms can spawn.

### Time with World Open

The total amount of time the world was opened (tracked in ticks). Unlike Play Time, if the game is paused this number continues to increase, but it does not change visually while the statistics menu is open.

### Times Slept in a Bed

The number of times the player has slept in a bed.

## Changelog

### v1.1.0

> Release Date: October 23rd, 2024

- Added Minecraft Education support
- Added Minecraft v1.21.40 support
- Update item and block translation to be compatible with Minecraft v1.21.40
- Add-on now uses the correct version of `@minecraft/vanilla-data` which correlates to Minecraft's version.

### v1.0.0

> Release Date: October 1st, 2024

Initial release.

## Installation

1. Download the add-on from the link below.
2. Import the pack, then activate the add-on in world settings.

   ![enable pack](/assets/posts/statistics/enable-pack.png)

3. Enable Beta APIs experiment.

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

4. View your gameplay statistics through `/function statistics` command or the `Statistics [Use Item]` book.

## Credits

- [Minecraft Wiki](https://minecraft.wiki/w/Statistics)
- [Minecraft Bedrock Dedicated Server API metadata](https://github.com/bedrock-apis/bds-docs/)
- [Bedrock Samples](https://github.com/Mojang/bedrock-samples/)
- Minecraft: Java Edition - Statistics translations

## Downloads

> [!IMPORTANT]
>
> - 'Beta APIs' experiment is required to use this add-on.
> - This add-on can only be used in latest version of either Minecraft or Minecraft Education.

- [Download Minecraft Statistics Add-On](/posts/statistics/downloads)
