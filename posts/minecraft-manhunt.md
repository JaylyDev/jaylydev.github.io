---
author: Jayly
title: Minecraft Manhunt
description: Minecraft Manhunt brings many manhunt concepts by Dream from the Java Edition of Minecraft into Minecraft Bedrock Edition. The basic concept of the Add-On is the speedrunner needs to beat Minecraft before the hunter kills the speedrunner.
date: 7/15/2024
image: /assets/posts/minecraft-manhunt/thumbnail-v1.png
---

# Minecraft Manhunt

<iframe width="914" height="514" src="https://www.youtube.com/embed/RQ5CAYMlq_8" title="Minecraft Manhunt (Teaser Trailer)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Minecraft Manhunt is a Bedrock Edition Add-On which brings the infamous skill based competitive game, where players have individual roles, where they can either become a speedrunner or a hunter. It brings many manhunt concept by Dream from the Java Edition of Minecraft into Minecraft: Bedrock Edition. The basic concept of the Add-On gameplay is the speedrunner needs to beat Minecraft before the hunter kills the speedrunner.

> [!WARNING]
> This Add-On has not been updated since November 2021 (Minecraft v1.17.40). Some features might be broken.

## Core Gameplay Concept

![Thumbnail v1](/assets/posts/minecraft-manhunt/thumbnail-v1.png)

### The Speedrunner's goal

Their goal is to beat Minecraft.

If they beat Minecraft or before the timer ends depending on the gamemode you're playing on which you haven't got killed by hunter(s), the speedrunner wins.

If the speedrunner died, they lose instantly.

### The Hunter's goal

Their goal is to kill the speedrunner by the end of beating Minecraft or the timer ends.

Hunter(s) has/have a compass which can track the speedrunner. Remember the compass works only in the overworld dimension, or last location if the speedrunner is in the Nether.

The hunter also has unlimited amount of life (excludes Minecraft Item Randomizer gamemode), the compass the game gives you cannot be moved, dropped, crafted with and the compass is not lost on death.

### Features applied on this Add-on

- This game should have <ins>chosen the one who host the world to become speedrunner</ins>, rest of them are hunters.
- This game requires a **_resource pack_** and a **_behavior pack_** in order to activate, or else Minecraft will pop up an error about incompatibility.
- The Add-on setups the game automatically on a brand new world.

![rp_apply](/assets/posts/minecraft-manhunt/rp_apply.png)

![bp_apply](/assets/posts/minecraft-manhunt/bp_apply.png)

- One of the hunters need to hold the compass in order to track the direction of the speedrunner.
- When hunter dies, only the compass is kept in the inventory.
- Hunters have the compass in order to track the direction of the speedrunner.

> [!IMPORTANT]
> The compass does not work in the nether nor the end dimension.

## Manhunt GameModes

There are 6 concepts included in this Add-on, including:

**Multiplayer game modes** (requires 2+ people to start the game)

- Minecraft Manhunt
- Minecraft Hitmen
- Minecraft Juggernaut
- Minecraft Item Randomizer (Minecraft Random Item Challenge by Dream)
- Minecraft Assassin

**Singleplayer gamemodes** (compatible with multiplayer)

- Terminator Manhunt

### Minecraft Manhunt

![setings manhunt](/assets/posts/minecraft-manhunt/settings-manhunt.png)

- **The speedrunner has to beat the Ender Dragon** before getting killed by the hunters.
- This game requires 2 players or more to start the game.

### Minecraft Hitmen

![setings hitmen](/assets/posts/minecraft-manhunt/settings-hitmen.png)

<center>

![hitmen timer](/assets/posts/minecraft-manhunt/hitmen-timer.png)

</center>

- **The speedrunner has to survive 1 hour** before getting killed by the hunters.
- The speedrunner also win if they beat Minecraft in under an hour.
- This game requires 2 players or more to start the game.
- If you think 1 hour is too long to survive, you can execute this command to change the time:
  ```
  /scoreboard players set @a[tag=host] time_m <count: integer (minutes)>
  ```

### Minecraft Juggernaut

![settings-juggernaut](/assets/posts/minecraft-manhunt/settings-juggernaut.png)

When the game starts, the hunters are spawned with **FULL DIAMOND ARMOR and a compass**, and **the speedrunner has NOTHING**.

![hunters-kit](/assets/posts/minecraft-manhunt/hunters-kit.png)

- The hunters' diamond armor given at the start will keep in inventory when they die unless you dropped them during the game.
- The speedrunner wins by beating Minecraft, just like the original Minecraft Manhunt's concept.
- This game requires 2 players or more to start the game.

### Minecraft Item Randomizer (or Minecraft Random Item Challenge vs Hunters)

![settings-item-randomizer](/assets/posts/minecraft-manhunt/settings-item-randomizer.png)

This gamemode or concept is similar to Minecraft Manhunt - The host becomes the speedrunner and the rest are hunters.

![randomizer-rules](/assets/posts/minecraft-manhunt/randomizer-rules.png)

- **_The hunters and speedrunner have 1 life only_**
- The hunters do not have the compass
- There is a 1000x1000 border across all dimensions, if you are outside of the border the system will teleport back to inside the border.
- Everyone gets a random type of item for every 2 minutes
- Anything dropped on ground disappears instantly (with the exception of a 5 second cooldown after a random type of item was given to everyone).

![random item arrives](/assets/posts/minecraft-manhunt/randomizer-message.png)

- The item dropped on the ground during the cooldown can be collected by anyone unlike the original concept by Dream.
- Everyone has to try and use the item to kill their enemy.
- When the host setups and starts the game, the add-on teleports everyone to 0,0 to make sure they are within the border.

### Minecraft Assassin

![assassin gamemode](/assets/posts/minecraft-manhunt/settings-assassin.png)

- The assassins have the ability to **kill the speedrunner in one hit**.
- When the speedrunner look at the assassin, they will get frozen and will not able to move at all.

### Minecraft Terminator Manhunt

![terminaor gamemode](/assets/posts/minecraft-manhunt/settings-terminator-manhunt.png)

- **This gamemode supports singleplayer!** Which means this game only requires 1 player or more to start the game.
- The terminator add-on in the installation is intended to be compatible with the manhunt Add-on
- All the players joined the game become speedrunners, and the terminator becomes the hunter
- The terminator will be spawned when the host executes `/function start`
- There is a reason of not making the terminator Add-on in this Manhunt Add-on: The terminator has a lot of bugs and glitches which the add-on will be uploaded from time to time and updating both add-on will be a waste of time.

> [!IMPORTANT]
> The terminator is not included in this Add-on, you need to install the Terminator Add-on and the manhunt Add-on in order to activate the Add-on successfully.
>
> Download the terminator add-on here: https://jaylydev.github.io/posts/terminator/

## Additional features

### Multi-speedrunners support

This add-on supports 2 speedrunners or more in a single game.

You need to select all speedrunners before the game starts by executing the following command:

```
/tag <entity:target> add speedrunner
```

### Change Speedrunner

The player who host the world becomes a speedrunner by default.

The host can change themselves to become a hunter by executing the following command before the game starts:

```
/tag <entity:target> add speedrunner
```

This selects other player as a speedrunner and the add-on will automatically change your role.

### Tracking Compass

In order to increase client and server performance, one of the hunters must hold the compass in order to locate speedrunner's direction. The compass will update speedrunner's direction every 1 second.

![tracking compass](/assets/posts/minecraft-manhunt/compass-tracking-showcase.png)

The compass the add-on gives to the hunters cannot be moved, dropped, crafted with and the compass is not lost on death.

![tracking compass tags](/assets/posts/minecraft-manhunt/compass-tags.png)

### Spectator mode

This feature is available when 2+ speedrunners are in the same game.

When one of the speedrunners dies, they will respawn and they will become a spectator.

Spectators have the following effects:

- Spectators cannot deal damages to speedrunner or hunter.
- Spectators has invisibility effect when the game is running.
- Spectator mode disables when the game is ended or in lobby stage.

> [!NOTE]
> This add-on is made before the introduction of the spectator gamemode, the add-on will not put you into actual spectator mode.

### Grace period (Experimental)

> [!CAUTION]
> This feature is an experimental. It may change or removed in future versions.

**This feature only works in the following gamemodes**:

- Minecraft Manhunt
- Minecraft Hitmen
- Minecraft Juggernaut
- Minecraft Item Randomizer
- Minecraft Assassin

![grace period ready](/assets/posts/minecraft-manhunt/grace-period-pvp.png)

![grace period enabled](/assets/posts/minecraft-manhunt/grace-period-pvp-on.png)

- Enabling grace period disables PVP at the start of the game
- If grace period is enabled before the game started, the game will enable PVP in 1 minute after the game started
- Grace period is disabled by default

**Enabling and disabling Grace Period**

![Function commands to toggle grace period](/assets/posts/minecraft-manhunt/grace-period-toggle.png)

Enable grace period through the following command:

```
/function settings/graceperiod/true
```

The game will enable grace period for all the players.

> [!IMPORTANT]
>
> - You must execute this command before starting the game
> - Please make sure the following text appears to make sure you enable grace period

![response](/assets/posts/minecraft-manhunt/grace-period-toggle-on.png)

Disabling grace period through the following command:

```
/function settings/graceperiod/false
```

The game will disable grace period for all the players.

> [!IMPORTANT]
>
> - You must execute this command before starting the game
> - Please make sure the following text appears to make sure you enable grace period

![response off](/assets/posts/minecraft-manhunt/grace-period-toggle-off.png)

## Credits

Game Designer

- Dream: [YouTube](https://youtube.com/@dream), [Twitter](https://x.com/dreamwastaken)
- GeorgeNotFound: [YouTube](https://youtube.com/@GeorgeNotFound), [Twitter](https://x.com/georgenotfound)

Add-On Developer

- JaylyMC: [YouTube](https://youtube.com/@jaylymc)
- r4isen1920: [MCPEDL](https://mcpedl.com/user/r4isen1920/)

Logo Designer

- ItsMeJacob21

## Changelog

### 1.8.0

> Release Date: Soon

#### Add-on changes

- Behavior pack is updated to be fully compatible with Minecraft v1.21.20 or above.
- The add-on now does not require Holiday Creator Features or Upcoming Creator Features experiments to be enabled.
- The add-on now requires minimum Minecraft version v1.20.60.

#### Gameplay Changes

- Compass now supports tracking players in the nether and the end dimension too.
- Fix a bug where players can hit entities before the game starts.

### 1.7.1

> Release Date: 8/11/2021

1st public release for Minecraft Manhunt v1.7

> No, **v1.7.1.15** is not the same as **v1.7.1.5**

#### Changelog

##### Minecraft Manhunt

- Added grace period setting

##### Minecraft Hitmen

- Added grace period setting

##### Minecraft Juggernaut

- Added grace period setting

##### Minecraft Assassin

- Added Minecraft Speedrunner vs Assassin (Minecraft Assassin).
- Added grace period setting
- Hunters are now called "Assassin"
- Assassin is now able to kill speedrunner in one hit

##### Terminator Manhunt

- Gamemode name has been changed for future updates
- Removed regeneration effect from the terminator due to its ability of respawning.
- Manhunt is now incompatible with Terminator add-on **version 1.0 or below**
- Fixed tellraw errors

##### Minecraft Item Randomizer

- Added grace period setting
- Fixed a critical bug
- Added slow falling if players are spawned in the air

#### Installations:

This Add-On is released for Minecraft version 1.17

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

- Holiday Creator Features
- Upcoming Creator Features

### 1.7.0-beta.2

> Release Date: 3/8/2021

1st beta release for Manhunt v1.7

#### Download:

[Manhunt v1.7.0](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt_v1.7.0.2.mcaddon)

#### Changelog

#### Minecraft Assassin

Added Minecraft Speedrunner vs Assassin (Minecraft Assassin).

> Added a feature that hunter freezes when speedrunner is looking at them

> Assassins are still called as "hunters" which will be fixed in the future

> Hunters currenly are not able to kill the speedrunner in one punch which will be fixed in the future

#### Minecraft Terminator

Terminator stops regenerating due to its ability of respawning.

> Manhunt is now incompatible with Terminator add-on **version 1.0 or below**

#### Installations:

This Add-On is released for Minecraft version 1.17

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

- Holiday Creator Features
- Upcoming Creator Features

### 1.6.6

> Release Date: July 26, 2021

Patch release for Manhunt v1.6.0

#### Changelog

- Added multi-speedrunners support to all gamemodes
- The add-on does not require Additional Modding Capibilities to activate
- Issue about compass will not appear in inventory when activating in Minecraft Juggernaut has been fixed
- Fixed spectator role across all gamemodes
- Added a changelog command. It is used when a small patch release without updating the MCPEDL forum

#### Installations:

This Add-On is released for Minecraft version 1.17

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

- Holiday Creator Features
- Upcoming Creator Features

### 1.6.5-beta.6

> Release Date: 25/7/2021

5th beta release for Manhunt v1.6

#### Download:

[Manhunt v1.6.5](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt_v1.6.5.6.mcaddon)

#### Changelog

- Added multi-speedrunners support to all gamemodes

#### Installations:

This Add-On is released for Minecraft version 1.17

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

- Holiday Creator Features
- Upcoming Creator Features

### 1.6.4-beta.13

> Release Date: 23/7/2021

4th beta release for Manhunt v1.6

#### Download:

[Manhunt v1.6.4](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-v1.6.4.13.mcaddon)

#### Changelog

##### Minecraft Terminator

- Fixed multiple or more speedrunners support
- Fixed spectating issue after a speedrunner dies in a multiple or more speedrunners situration

#### Installations:

This Add-On is released for Minecraft version 1.17

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

- Holiday Creator Features
- Upcoming Creator Features

### 1.6.3-beta

> Release Date: 21/7/2021

3rd beta release for Manhunt v1.6

#### Download:

[Manhunt v1.6.3](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-v1.6.3.mcaddon)

#### Changelog

- You can now change speedrunner in every gamemode excludes terminator mode
  > Method: (DO BEFORE START THE GAME)
  > `/tag [player] add speedrunner`
- The add-on does not require Additional Modding Capibilities to activate
- Issue about compass will not appear in inventory when activating in Minecraft Juggernaut has been fixed

#### Installations:

This Add-On is released for Minecraft version 1.17, but there is a chance of it being compatible for Minecraft version 1.16.220+

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

- Holiday Creator Features
- Upcoming Creator Features

### 1.6.2

> Release Date: 12/7/2021

Patch release for Manhunt v1.6.1

#### Download:

[Manhunt v1.6.2](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-v1.6.2.mcaddon)

#### Changelog

- Fixed an issue related to changing speedrunner
  > This change only applies to default gamemode (Minecraft Manhunt)
  > Method: (DO BEFORE START THE GAME)
  > `/tag [player] add speedrunner`

#### Installations:

This Add-On is released for Minecraft version 1.17, but there is a chance of it being compatible for Minecraft version 1.16.220+

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.6.1-beta

> Release Date: 11/7/2021

The 1st BETA release for Minecraft Manhunt 1.6

#### Download:

[Manhunt v1.6.1](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-v1.6.1.mcaddon)

#### Changelog

- You can now change the player to become speedrunner instead of the host
  > This change only applies to default gamemode (Minecraft Manhunt)
  > Method: (DO BEFORE START THE GAME)
  > `/tag [player] add speedrunner`
- Minecraft Manhunt would now be the default gamemode when activate the add-on instead of random item gamemode.
- Updated error messages to make developers easier to analyse

#### Installations:

This Add-On is released for Minecraft version 1.17, but there is a chance of it being compatible for Minecraft version 1.16.220+

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.6.0

> Release Date: July 2021

The first release for Minecraft Manhunt 1.6

#### Download:

[Manhunt v1.6.0](https://bit.ly/mcmh160)
[Terminator v1.0.0](https://bit.ly/mcrobot100)

#### Changelog

- The game is now harder for players to break the Add-On easily
- Better performance for the server and the client
- The Add-On now has a resource pack, you must import both behavior pack and resource pack in order to activate or else it will popup an error about incompatibility
- Added "Minecraft Item Randomizer" gamemode, which is simliar to Dream's Minecraft Random-item Challenge but with a little bit of tweaking due to Minecraft Bedrock Edition limitation
- Added "Minecraft Terminator" gamemode, a gamemode for people do not have friends to play with. This features all players become speedrunners and the terminator becomes the hunter. For more info please check the Terminator Add-On
- Added Minecraft Hitmen gamemode and removed timer function from default gamemode
- Added Minecraft Juggernaut gamemode
- The Add-On now has a timer shown in the actionbar when playing Minecraft Hitmen
- Removed Competitive gamemode from previous Manhunt
- Removed settings from the Add-On and replaced with resolutions in Add-On settings with different gamemodes
- Removed scoreboard, healing and warmup function
- Compass now need to be activated by holding it with your hand, and display speedrunner's direction every 5 seconds
- The game will not end when the speedrunner or all hunters left the game because of client's connection (get disconnected), but the game will still run during this time
- You now do not need to activate education edition in order to run the Add-On

#### Installations:

This Add-On is released for Minecraft version 1.17, but there is a chance of it being compatible for Minecraft version 1.16.220+

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.5.11

> Release Date: 26/6/2021

11th Patch release for Manhunt Beta 1.5

#### Download:

[Manhunt v1.5.10](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-pr-1-beta-1.5.10.mcaddon)
[Terminator v0.0.84](https://github.com/jayly-bot/addons/releases/download/terminator_old/terminator-v0.0.84.mcaddon)

#### Changelog

- World spawn now set to current host's coordinate
- When all speedrunners killed by terminator the game ends.

#### Installations:

This Add-On is released for Minecraft version 1.17, but there is a chance of it being compatible for Minecraft version 1.16.200+

When you're installing this Add-On in Minecraft 1.17, these are the experimentals options required to be activated.

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.5.5

#### Download

[Manhunt v1.5.5](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-beta-1.5.5.mcpack)

#### Changelog

> Release Date: 18/6/2021

5th Patch release for Manhunt version 1.5 [BETA]

- Added Minecraft Hitmen and Minecraft Juggernaut back (Finally)
- Various bug fixes

If you're running this addon in version 1.17, you now need to activate these 3 experimental options when applying addon

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.5.4

#### Download

[Manhunt v1.5.4](https://github.com/jayly-bot/addons/releases/download/manhunt_old/Beta_1.5.4.mcpack)

#### Changelog

> Release Date: 12/6/2021

4th Patch release for Manhunt version 1.5 [BETA]

- Hunter's death message will not display to everyone.
- Error message now shows up when executing `/function start` after finishing the game

If plan goes accordingly, I'll start adding more gamemodes to the addon in an attempt to maintain performance.

If you're running this addon in version 1.17, you now need to activate these 3 experimental options when applying addon

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.5.3

#### Download

[Manhunt v1.5.3](https://github.com/jayly-bot/addons/releases/download/manhunt_old/manhunt-beta-1.5.3.mcpack)

#### Changelog

> Release Date: 12/6/2021

3rd Patch release for Manhunt version 1.5 [BETA]

- Fixed compass `hand_equipped` thingy
- Fixed the bug that you were able to start the game again after finishing playing
- Added compass cooldown
- Fixed `/function start`

If plan goes accordingly, I'll start adding more gamemodes to the addon in an attempt to maintain performance.

If you're running this addon in version 1.17, you now need to activate these 3 experimental options when applying addon

![image](/assets/posts/minecraft-manhunt/experimental-1.5.3-beta.png)

### 1.5.0

**Post Changelog:**

- Updated URLs on installation details

**Add-on Changelog:**

- The game is now harder for players to break the Add-On easily
- Better performance for the server and the client
- The Add-On now has a resource pack, you must import both behavior pack and resource pack in order to activate or else it will popup an error about incompatibility - Added "Minecraft Item Randomizer" gamemode, which is simliar to Dream's Minecraft Random-item Challenge but with a little bit of tweaking due to Minecraft Bedrock Edition limitation
- Added "Minecraft Terminator" gamemode, a gamemode for people do not have friends to play with. This features all players become speedrunners and the terminator becomes the hunter. For more info please check the Terminator Add-on
- Added Minecraft Hitmen gamemode and removed timer function from default gamemode
- Added Minecraft Juggernaut gamemode
- The Add-On now has a timer shown in the actionbar when playing Minecraft Hitmen
- Removed Competitive gamemode from previous Manhunt
- Removed settings from the Add-On and replaced with resolutions in Add-On settings with different gamemodes
- Removed scoreboard, healing and warmup function
- Compass now need to be activated by holding it with your hand, and display speedrunner's direction every 5 seconds
- The game will not end when the speedrunner or all hunters left the game because of client's connection (get disconnected), but the game will still run during this time
- You now do not need to activate education edition in order to run the Add-On

### 1.4.0

Addon infomation - Pack icon is changed

Both - Instead of using /tag [player] add speedrunner to track the speedrunner at the game, we replaced it with /tag [player] add track

Both - Added Ender Dragon death event

Both - Tellraw messages are changed. Featuring when timer goes to 0, after you beat the ender dragon etc

Both - Better setup instruction ingame

Both - Shows debug message on actionbar when you did not turn on EDU edition to play this addon

Competitive - The resolution is playable now.

Competitive - Hunter respawn cooldown: Fixed.

Competitive - If speedrunner goes to the nether, the hunter will respawn in the same dimension as the speedrunner + 30 seconds cooldown.

Competitive - Improved the spectating system, throwing the block "allow" from spectator's inventory will result a teleportation to the speedrunner.

Normal - Removed guide option in order to improve the performance

Normal - The 2 speedrunners glitch is fixed (meaning the game won't start executing if you do /function start)

### 1.3.0

**Fixed 2 bugs we have discovered:**

Hunters don't have a compass when the game starts in v2.2 and it's fixed.

Zero speedrunners at one game and it has been fixed.

**Featuring in both resolutions:**

Limited to only 1 speedrunner at the game while the other one gets disqualified.

### 1.2.0

**Featuring in both resolutions:**

Changed player format version from 1.8 to 1.13

You can track players manually by doing /tag [player] add track

Updated death messages

When the game setup you will stay where you at

Give people better instructions to start the game

> [!NOTE]
> We updated this addon only can runs on or above 1.16
>
> You cannot track more than one person in this version, if you track multiple players, the game will select from one of them.

### 1.1.0

**Featuring in both resolutions:**

Added timer - Disable / Enable timer (30 or 60 minutes)

function help command - description changed

**Only in Normal Minecraft Manhunt:**

Hunter spawnpoint fixed - Respawning feature is not locked at 0,0

**Only in Competitive Manhunt:**

Health - Hunter: 20hp, Speedrunner: 40 hp

Hunters' starter kit is added into this version.

### 1.0.0

Initial Release

## Important infomation

The add-on is licensed under the MIT license. As long as you have stated license and copyright notice, you have permission for commercial use, modification, distribution and private use of the add-on. This excludes liability and warranty.

When you are uploading a video about the add-on, you must credit the add-on by leaving a link (https://jaylydev.github.io/posts/minecraft-manhunt) in the description and do not use the thumbnail on the add-on post or on the trailer as your video thumbnail.

We are not accepting bug reports or feedback to the Minecraft Manhunt add-on currently.

## Installation

This game requires a resource pack and a behavior pack in order to activate, or else Minecraft will pop up an error about incompatibility.

After downloading the Add-on from the link below and importing the Add-On to Minecraft, make sure both resource pack and behavior pack are imported so you do not have the error related to incompatible when applying the Add-on.

The Add-on setups the game automatically on a brand new world.

## Downloads

Click the link below and choose a version to download.

- [Download Minecraft Manhunt Add-On](/posts/minecraft-manhunt/downloads/)
