---
author: Jayly
title: Bedrock Statistics Changelog
description: This is the complete release history for Bedrock Statistics Add-On.
---

# Bedrock Statistics Changelog

This is the complete release history for [Bedrock Statistics](/posts/statistics/) Add-On.

### v1.3.10

> Release Date: July 2nd, 2025

- Added Distance by Happy Ghast stat
- Fixed Dried Ghast texture
- Added Music Disc Tears
- Added JaylyStats API v1 support. Dependency: MCBE-IPC (Version [673a99ba74a30fc8745c74f9510e6f57cee86410](https://github.com/OmniacDev/MCBE-IPC/blob/673a99ba74a30fc8745c74f9510e6f57cee86410/src/ipc.ts))

**Statistics Plus Add-On - v0.2.3**

- Fixed a bug where overriding statistics to track on an objective causes crashes.
- Following custom commands can execute without cheats enabled: `/jayly:stats`, `/stats`.
- Add-on now attempts to add custom slash commands without namespace, such as `/stats`, `/itemstats`, `/mobstats`, `/customstats`, `/liststats`. This is only possible if the custom command name is not used by another behavior pack, otherwise those command names will not be created and a content log warning will appear.

### v1.3.1

> Release Date: June 24th, 2025

- Fixed a bug where pack versions aren't incremented after minor changes.

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

### v1.2.2

> Release Date: May 4th, 2025

- Removed Mojang's vanilla data modules from source to improve performance.
- Add-On runtime: Reduced load times and performance improvement.
- Fixed a bug where mobs sort label displays 'Item: Sort by' instead of 'Mobs: Sort by'

### v1.2.0

> Release Date: March 23rd, 2025

- Add-On now tracks the following statistics: Distance by Boat, Distance by Elytra, Distance by Horse, Distance by Minecart, Distance by Pig, and Distance by Strider
- Fully added translations for all languages Minecraft Bedrock supports
- Players can access statistics through `!stats` and `!statistics` (Requires Minecraft Statistics Extension Pack, downloads separately).
- Added settings form: Current you can choose to sort items and mobs statistics.
- Performance improvement.
- Added support for item and entity translations in selection screens.
- Fix an issue which throws LocationOutOfWorldBoundariesError when jumping.
- Fix an issue with Add-On not detecting item breaking properly.

### v1.1.1

> Release Date: November 23rd, 2024

- This Add-On works for any Minecraft Bedrock version above v1.21.50
- Experimental toggles are not required to play this Add-On.
- Updated item and block transitions to be compatible with Minecraft v1.21.50
- Improved load times when retrieving item statistics.
- Removed `!statistics` prototype chat command.
- Fixed a bug where music disc track name are not visible, in the selection menu for item statistics.

### v1.1.0

> Release Date: October 23rd, 2024

- Added Minecraft Education support
- Added Minecraft v1.21.40 support
- Update item and block translation to be compatible with Minecraft v1.21.40
- Add-on now uses the correct version of `@minecraft/vanilla-data` which correlates to Minecraft's version.

### v1.0.0

> Release Date: October 1st, 2024

Initial release.
