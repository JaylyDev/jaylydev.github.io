---
author: Jayly
title: Minecraft Cinematic Editor
description: Control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the /camera command.
image: /assets/posts/cinematic-editor/MCPEDL_Preview.png
download: true
---

# Minecraft Cinematic Editor Extension

> [!IMPORTANT]
> This article is about the Minecraft Editor extension that is currently exclusive to the Windows version of Minecraft Bedrock.
>
> For the Cinematic add-on with cross-platform support, see [Cinematic Runtime](/posts/cinematic-runtime).

![Cinematic Editor v2 Thumbnail](/assets/posts/cinematic-editor/thumbnail-2025-v2-preview-mcpedl.png)

> Vibrant Visuals Pack used: [Prizma Visuals](https://mcpedl.com/prizma-pbr-deferred-pack/)

Cinematic Editor is a Bedrock editor extension that utilizing the `/camera` command for changing perspectives and designing cinematic scenes.

The editor controls your camera perspective with Minecraft Editor to allow players to make a Minecraft scene, without knowledge to use the `/camera` command.

The Cinematic Editor Extension allows you to control your camera perspective without the use of commands. Which uses Minecraft: Bedrock Editor and the `/camera` command to allow players to make a Minecraft scene.

## Supported features

The following is a brief overview of the features supported by the Cinematic Editor:

- Create and manage keyframes
- Adjust camera position and rotation
- Control camera transitions (easing)
- Control camera interpolation (linear and hermite)
- Add keyframe effects (fade in/out)
- Export keyframes for use in the Cinematic Runtime Add-On (Currently not supported for Cinematic Editor V2)

## What's Next

Looking ahead, here's a list of features I wanted to include in future releases.

- Play multiple sequences one after the other until the scene is finished
- Change camera FOV support
- Export keyframes for use in the Cinematic Runtime Add-On
- Manage scene using Custom Commands API

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

## Camera Transition

The camera can move between keyframes with easing snd interpolation.

### Easing

Easing is a specific method of controlling the rate and curve of that interpolation, typically to create natural-looking motion between 2 keyframes.

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

### Interpolation

Interpolation is the general process of generating values between two points or keyframes. This can create natural-looking motion between multiple keyframes.

Currently, the editor supports these interpolation methods:

- **Linear / Line**: The simplest method of getting values at positions in between the data points.

- **Hermite**: Creates subdivision between multiple positions to create smooth, controlled camera paths.

## Keyframe Effects

In Cinematic Editor V2, you can find, apply, adjust fade effects, and run commands using the Effects panel.

Multiple effects can be added to a keyframe by pressing the add button, and remove it by pressing the delete button.

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

The toggles controls the HUD visibility when playing a scene using the extension. There are multiple toggles under the action buttons which indicates the HUD elements to display when playing a scene.

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
