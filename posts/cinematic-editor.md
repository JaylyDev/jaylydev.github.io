---
author: Jayly
title: Cinematic Editor
description: Control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the /camera command.
date: 3/6/2024
---

# Cinematic Editor

<iframe width="930" height="523" src="https://www.youtube.com/embed/nHYLVo_IvKA" title="I Made An Editor For Minecraft Camera Command" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The Cinematic Editor is a Minecraft editor extension that utilizing the /camera command for changing perspectives and designing cinematic scenes. The editor has the capability to control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the /camera command.

# Cinematic Editor Extension

The Cinematic Editor Extension allows you to control your camera perspective without the use of commands. Which uses Minecraft: Bedrock Editor and the /camera command to allow players to make a Minecraft scene.

## Similarities between ReplayMod

This cinematic editor has a similar concept to ReplayMod from Minecraft: Java Edition.

- You can create multiple keyframes in a scene. With it's simple user interface provided by the Mojang's Minecraft Editor to create camera paths, which the editor can utilize a player's camera to move from one place to another with different transition and time duration.
- cThe editor allows you to adjust the time duration and ease of a keyframe. There are more ease options than the actual ReplayMod!

## Major Differences

However, a major difference between this extension and ReplayMod is that the scene are played in real time since you cannot rewind Minecraft's gameplay footage within the game

## Play a Scene

![play scene](/assets/posts/cinematic-editor/jayly-cinematic-editor_7.png)

Before running a scene, you have to create keyframes so the extension can generate a path for the scene.

The '**Create Keyframe**' button will immediately saves the player's current coordinates and rotation into the extension, which can be viewed within the top part of the extension:

![scene data display](/assets/posts/cinematic-editor/jayly-cinematic-editor_8.png)

When the '**Run Timeline**' button is clicked, the editor extension controls your camera and gets all the keyframes saved to generate a path for the camera to transit from one location to another.

![run timeline](/assets/posts/cinematic-editor/jayly-cinematic-editor_2.png)

> [!NOTE]
> The extension will only take control of the camera to run a scene given by there are data in the stored keyframes dropdown.

![easing](/assets/posts/cinematic-editor/jayly-cinematic-editor_4.png)

The '**Ease Type**' button adjust the ease of a keyframe, different ease type allows the camera can move from one place to another with different motion. Which different ease types allows us to make the transition more natural in some scenes.

The following easing types are supported in the cinematic editor extension:

![easing list](/assets/posts/cinematic-editor/jayly-cinematic-editor--camera-editor_2.png)

> [!TIP]
> The image above is taken from [Easing Functions Cheat Sheet](https://easings.net) (easings.net). Check out the website to learn more about different methods of easing.

![easing selection](/assets/posts/cinematic-editor/jayly-cinematic-editor_5.png)

The '**Ease Time**' adjust the time duration from one key frame to another.

These two options are automatically saved to world, so data will not be deleted when leaving and joining the world.

And finally, the **Export Keyframes** button will transfer the data from Cinematic Editor extension to Cinematic Runtime, meaning you can play a scene outside of editor mode.

# Cinematic Runtime Add-On

The Cinematic Runtime Add-On allows players to play a scene by sending scene data from Cinematic Editor in the release version of Minecraft. This add-on is limited to Minecraft Preview users currently.

This is made possible through exporting the scene data from the editor extension to another add-on. And the data is saved in world storage, so the scene can still be played when rejoining without the need to import the data again.

<iframe width="930" height="523" src="https://www.youtube.com/embed/58P5Yxn7PEc" title="Playing a Minecraft Scene without Minecraft Camera Command" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The video above showcase how you can export keyframes from the editor and import the data and play a scene in a normal Minecraft world. The world inside the video is also available in the Downloads section for demonstration purposes.

To import data to the Cinematic Runtime Add-On:

1. Apply the Cinematic Runtime Add-On in the world
1. Export the data from Cinematic Editor Extension

<iframe width="930" height="523" src="https://www.youtube.com/embed/x3hAOwJrwyk" title="How to install a Minecraft Editor Extension" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This video has infomations of installing this editor extension, and behind the scenes of development of the cinematic editor.

> [!IMPORTANT]
> Cinematic Editor requires Minecraft Preview v1.20.80, and this editor add-on is only available to Windows 10/11 players.
>
> The Cinematic Runtime Add-On also requires Minecraft Preview v1.20.80, but it's available on all devices.

<details>
  <summary><h1>Changelog</h1></summary>

Changelog for Cinematic Editor extension and Cinematic Runtime Add-On

## Cinematic Editor Extension

### 1.1.2

- Module version property is now the same as `header.version`
- Editor extension is now compatible with 1.20.80-preview.21 or above.
- Fix Vector class not exported from '@minecraft/server' module in 1.20.80-preview.21.
- Output files are now bundled.

### 1.1.1

- Editor extension is now compatible with 1.20.80 previews.
- HUD is now hidden when "Run Timeline" is pressed
- When pressing 'Export Keyframes', the keyframe data will automatically transfer to Cinematic Runtime add-on. This requires cinematic runtime add-on to be loaded on editor world.

### 1.0.5

- Fix a critical bug where world hangs when 'Run Timeline' is pressed.

### 1.0.4

- Editor extension is now compatible with 1.20.70 previews

### 1.0.3

- Exported data from Export Keyframes can now be used in Cinematic Runtime Add-On
- Behavior packs and resource packs are now dependent, so when one of the resource or behavior pack is applied to world the other pack is also applied automatically.

### 1.0.2

- Update pack name and description
- Add-on is now compatible with 1.20.60 previews.

### 1.0.1

- Export keyframes now converts keyframes into /camera commands

### 1.0.0

- Added extension icon (icon by Mojang)

### 0.3.0-beta

- Refactor storage system to make it compatible for latest Dynamic Properties changes.
- Fix a bug where Ease Type and Ease Time aren't sync when changing keyframe selection.
- Fix Ease Time not being able to input float numbers.
- Export Content field is now hidden unless 'Export Keyframes' button is pushed.
- Easing values are now saved automatically when changed.

### 0.2.0-beta

- Increase maximum stored keyframes from 9 to 600
- Fix the delay caused by running timeline
- Text pane now disallow user from modifying the export content
- Add easing into cinematic editor

### 0.1.0-beta

- Add tool and pane with no functionality.
- Add export content
- Add player location, rotation

## Cinematic Runtime Add-On

### 0.3.0

- Module version property is now the same as `header.version`
- Editor extension is now compatible with 1.20.80-preview.21 or above.
- Using '@minecraft/math' module instead of Vector class from '@minecraft/server'
- Output files are now bundled.

### 0.2.1

- Pack is now compatible with 1.20.80 previews only

### 0.2.0

- Pack is now compatible with 1.20.70 previews only
- Runtime add-on now requires Beta APIs experiment
- HUD is now hidden when using camera runtime until scene ends

### 0.1.1

- Fix a critical bug where world hangs when 'Run Timeline' is pressed.

### 0.1.0

- Initial Release for Release 1.20.50
- Added input form
- Added an item that plays a scene when used

</details>

# Downloads

- [Download Cinematic Editor Runtime Add-On](https://www.mediafire.com/file/dytexvsxzn27mkk/CinematicRuntime_v0.3.0.mcaddon/file)
- [Download Cinematic Editor Extension](https://www.mediafire.com/file/2legkm7hbwcbcpf/CinematicEditor_v1.1.2.mceditoraddon/file)
