---
author: Jayly
title: Hide Name Tag Add-On
description: Hide name tags for entities and players via commands in Minecraft.
date: 9/7/2024
image: /assets/posts/hide-nametag/thumbnail.png
---

# Hide Name Tag Add-On

Have you ever wondered hiding name tags for entities and players, this behavior pack can do this task for you! With this add-on, you can hide and show entity name tag with chat command.

![thumbnail](/assets/posts/hide-nametag/thumbnail.png)

## How to use

There are 2 ways to use this add-on, custom command or slash command.

Custom command means every player can run the hide name tag command, and slash command only available to players with operator permission.

Type `/scriptevent jayly:showign false` to hide entity name tags for everyone.
Type `/scriptevent jayly:showign true` to show entity name tags for everyone.

## Entities with hide name tag disabled

![showign true](/assets/posts/hide-nametag/showign-enabled.png)

## Entities with hide name tag enabled

![showign false](/assets/posts/hide-nametag/showign-disabled.png)

## Changelog

### 1.3.0

> Release Date: September 8, 2024

- Download is now hosted on https://jaylydev.github.io/ instead of bstlar
- When setting `showign` game rule to false, the game will continuely hide the name tag for all entities until the game rule is set to true again.
- Fix a bug where entity nametags aren't hidden when they're renamed whilst the show nametag gamerule is disabled.

### 1.2.0

> Release Date: January 02, 2024

Download is now hosted in Mediafire from Discord.

Changed hide nametag method from /gametest or !command to /scriptevent command

Add-on now uses non-experimental Minecraft APIs.

### 1.0.0

> Release Date: June 19, 2022

Initial Release

## Download

- [Download Hide Name Tag Add-On](https://github.com/jayly-bot/addons/releases/download/hide_nametag/hide_nametag_v1.3.0.mcpack)
