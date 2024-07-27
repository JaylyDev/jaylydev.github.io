---
author: Jayly
title: Minecraft Cinematic Editor
description: Control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the /camera command.
date: 7/14/2024
image: /assets/posts/cinematic-editor/thumbnail.png
download: true
---

# Minecraft Cinematic Editor Extension

> [!IMPORTANT]
> This article is about the Minecraft Editor extension that is currently exclusive to the Windows version of Bedrock Edition Preview.
> For the Cinematic add-on with cross-platform support, see [Cinematic Runtime](/posts/cinematic-runtime).

<iframe width="930" height="523" src="https://www.youtube.com/embed/nHYLVo_IvKA" title="I Made An Editor For Minecraft Camera Command" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

> Download links for the add-on is located at the bottom of the page.

The Cinematic Editor is a Minecraft editor extension that utilizing the `/camera` command for changing perspectives and designing cinematic scenes. The editor has the capability to control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the `/camera` command.

![Cinematic Editor v1.4 Thumbnail](/assets/posts/cinematic-editor/cinematic-editor-thumbnail-2.png)

> Deferred Lighting Pack used: [Poggy's Luminous Dreams](https://mcpedl.com/poggy-s-luminous-dreams-deferred-renderer-shader-pack-beta/)

The Cinematic Editor Extension allows you to control your camera perspective without the use of commands. Which uses Minecraft: Bedrock Editor and the `/camera` command to allow players to make a Minecraft scene.

## Similarities between ReplayMod

This cinematic editor has a similar concept to ReplayMod from Minecraft: Java Edition.

- You can create multiple keyframes in a scene. With it's simple user interface provided by the Mojang's Minecraft Editor to create camera paths, which the editor can utilize a player's camera to move from one place to another with different transition and time duration.
- cThe editor allows you to adjust the time duration and ease of a keyframe. There are more ease options than the actual ReplayMod!

## Major Differences

However, a major difference between this extension and ReplayMod is that the scene are played in real time since you cannot rewind Minecraft's gameplay footage within the game.

## Creating a Scene

![Create a scene with extension](/assets/posts/cinematic-editor/create-a-scene.png)

To create a scene with the editor extension, first click on the camera icon on the left. The cinematic editor panel will pop up on the right, scroll down to the **Stored Keyframes** section. This is where you will create a keyframe and a scene.

The '**Create Keyframe**' button will immediately saves the player's current coordinates and rotation into the extension, which can be viewed within the top part of the extension:

![scene data display](/assets/posts/cinematic-editor/jayly-cinematic-editor_8.png)

When the button is clicked, the keyframes dropdown will have an item with the location the keyframe is captured in. Doing this multiple times allows you to create a scene. The keyframes order are shown in the dropdown:

![keyframes dropdown](/assets/posts/cinematic-editor/keyframes-dropdown.png)

When the '**Play Scene**' button is clicked, the editor extension controls your camera and gets all the keyframes saved to generate a path for the camera to transit from one location to another.

![keyframes dropdown](/assets/posts/cinematic-editor/scene-running.png)

> [!NOTE]
> The extension will only take control of the camera to run a scene given by there are data in the stored keyframes dropdown.

## Camera Transition (Easing)

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

## Modifying Existing Keyframes

If you want to change the keyframe's ease, you can select a keyframe from the Keyframes dropdown. The panel will show easing details for the selected keyframe.

You can modify the ease type and the ease time for the keyframe. However you cannot modify it's position and rotation. You would have to delete the keyframe using the 'Delete Keyframe' button, then create a keyframe again.

## Scene Action

![scene action](/assets/posts/cinematic-editor/scene-action-updated.png)

The Scene Action section in the extension panel allows creators to either play the scene, export the scene to Cinematic Runtime Add-On, or reset the scene.

### Play Scene

This will play the scene which is stored in the Cinematic Editor Extension Add-On. To play a scene stored in Cinematic Runtime Add-On, use the Scene Player item.

### Export Scene

Pressing this button will transfer the scene details from Cinematic Editor Extension to Cinematic Runtime Add-On. This means you can play the scene with the Scene Player item available from Cinematic Runtime Add-On without the Minecraft Editor or the extension.

> [!IMPORTANT]  
> Exporting Scene from extension to the runtime add-on requires both behavior packs activated in the Editor project.
>
> ![loaded packs](/assets/posts/cinematic-editor/cinematic-addons-loaded.png)

### Reset Scene

This action will reset all data of the camera scene from the Editor extension, and it cannot be undone once the scene is removed. This does not affect the scene in Cinematic Runtime Add-On.

### Hud Elements Visibility

> [!CAUTION]
> This feature is in pre-release and not compatible with Cinematic Runtime add-on yet. It may change in the future.

There are multiple toggles under the action buttons which indicates the HUD elements to display when playing a scene.

- `Show Hunger` - Shows hunger bar element.
- `Show Paper Doll` - Shows'paper doll' on-screen representation of the player.
- `Show Armor` - Shows armor element on the HUD.
- `Show Tool Tips` - Shows tool tip elements of the HUD.
- `Show Touch Controls` - Shows touch controls elements of the HUD. Depending on the players' platform, these elements may never show up.
- `Show Cross Hair` - Shows cross-hair section of the HUD.
- `Show Hotbar` - Shows hotbar inventory area element of the HUD.
- `Show Health` - Shows health element of the HUD.
- `Show Progress Bar` - Shows progress bar element of the HUD.
- `Show Air Bubbles` - Shows air bubble status element of the HUD.
- `Show Horse Health` - Shows visual representation of the players' ride element of the HUD.
- `Show Status Effects` - Shows status effects element of the HUD.
- `Show Item Text` - Shows item text element.

# Changelog

Changelog for Cinematic Editor extension and Cinematic Runtime Add-On

### 1.3.2

- Fix an issue with HUD elements not displaying when toggled on.
- When playing the scene the following HUD elements can be shown if toggled on: ProgressBar, Hunger, AirBubbles, HorseHealth, StatusEffects, ItemText
- Updated manifest
- Resource pack now requires the same minimum engine version as behavior pack.

### 1.3.1

- Cinematic Editor extension is compatible with Minecraft Preview 1.21.20
- Fix an issue with missing strings caused by editor API change
- [Experimental] Add toggles for showing specific HUD elements

### 1.3.0

- Editor extension now requires Minecraft v1.21.10 Previews to run
- Renamed 'Run Timeline' to 'Play Scene' - Plays the scene which is stored in editor extension storage.
- Renamed 'Export Keyframes' to 'Export Scene' - Export the scene from editor extension storage to Cinematic Editor Runtime Add-On, which can be played through Scene Player item.
- Group Export Scene and Play Scene button into 'Scene Action' pane
- Added 'Reset Scene' button - Reset editor extension camera scene.
- Updated Add-On Manifest metadata, changing license from MIT to All Rights Reserved.

### 1.2.0

- Module version property is now the same as `header.version`
- Editor extension is now compatible with 1.20.80-preview.21 or above.
- Fix Vector class not exported from '@minecraft/server' module in 1.20.80-preview.21.
- Output files are now bundled.

### 1.1.1

- Editor extension is now compatible with 1.20.80 previews.
- HUD is now hidden when 'Run Timeline' is pressed
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

# Installation

<iframe width="930" height="523" src="https://www.youtube.com/embed/x3hAOwJrwyk" title="How to install a Minecraft Editor Extension" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This video has infomations of installing this editor extension, and behind the scenes of development of the cinematic editor.

> [!IMPORTANT]
>
> - Cinematic Editor Extension requires Bedrock Editor mode to be enabled, which the engine is only available to Windows 10/11 players. Check out [this article](https://learn.microsoft.com/en-us/minecraft/creator/documents/editorinstallation) to get access to the Editor.
>
> - You are allowed to repost this add-on to other websites or make a YouTube video for commercial purposes, provided that you must put the link this post https://jaylydev.github.io/posts/cinematic-editor/ in the description of the video or a webpage and must not have any other direct-download links.

# Downloads

Click the link below and choose a version to download.

- [Download Cinematic Editor Extension](/posts/cinematic-editor/downloads/)
