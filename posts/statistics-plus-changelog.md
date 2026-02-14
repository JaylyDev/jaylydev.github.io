---
author: Jayly
title: Statistics Plus Changelog
description: This is the complete release history for Bedrock Statistics Add-On.
---

# Statistics Plus Changelog

This is the complete release history for [Bedrock Statistics](/posts/statistics/) Add-On.

### v1.1.0

- Now depends on **@minecraft/server-ui** module v2.1.0-beta or above.
- Now depends on Minecraft v26.10 or above.
- Added a search screen for statistics, which can be accessed by clicking the search button in the statistics menu.

  Start searching by item or entity type ids, or custom statistic ids.

  ![Search button in statistics menu](/assets/posts/statistics/statsplus-v110-search-beta.png)

  ![Search bar in statistics menu](/assets/posts/statistics/statsplus-v110-search-bar-beta.png)

  ![Search results in statistics menu](/assets/posts/statistics/statsplus-v110-search-results-beta.png)

### v1.0.0

- Initial V1 release.
- Now depends on Bedrock Statistics Add-On v1.6.0 or above.
- Now depends on MCBE-IPC v3.2.1 or above.
- Added **jayly:addstatsboard** command to add a scoreboard objective that tracks a statistic of your choice.
  **Note**: You can only track vanilla statistics with this command, custom statistics added by other add-ons cannot be tracked using this command.
- Added **jayly:removestatsboard** command to remove a scoreboard objective that tracks a statistic of your choice.
- Removed **jayly:stats** command from this add-on, now it's only available in the core statistics pack.
- Removed **jayly:customstats** command in favor of **jayly:addstatsboard** command.
- Removed **jayly:itemstats** command in favor of **jayly:addstatsboard** command.
- Removed **jayly:mobstats** command in favor of **jayly:addstatsboard** command.
- Removed **jayly:liststats** command in favor of autocomplete feature within the **jayly:addstatsboard** command.
