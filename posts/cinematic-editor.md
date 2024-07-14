---
author: Jayly
title: Minecraft Cinematic Editor
description: Control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the /camera command.
date: 5/27/2024
image: /assets/posts/cinematic-editor/thumbnail.png
---

# Minecraft Cinematic Editor

<iframe width="930" height="523" src="https://www.youtube.com/embed/nHYLVo_IvKA" title="I Made An Editor For Minecraft Camera Command" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

> Download links for the add-on is located at the bottom of the page.

The Cinematic Editor is a Minecraft editor extension that utilizing the `/camera` command for changing perspectives and designing cinematic scenes. The editor has the capability to control your camera perspective with Minecraft Bedrock Editor to allow players to make a Minecraft scene, without knowledge to use the `/camera` command.

# Cinematic Editor Extension

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

![scene action](/assets/posts/cinematic-editor/scene-action.png)

The Scene Action section in the extension panel allows creators to either play the scene, export the scene to Cinematic Runtime Add-On, or reset the scene.

**Play Scene**

This will play the scene which is stored in the Cinematic Editor Extension Add-On. To play a scene stored in Cinematic Runtime Add-On, use the Scene Player item.

**Export Scene**

Pressing this button will transfer the scene details from Cinematic Editor Extension to Cinematic Runtime Add-On. This means you can play the scene with the Scene Player item available from Cinematic Runtime Add-On without the Minecraft Editor or the extension.

> [!IMPORTANT]  
> Exporting Scene from extension to the runtime add-on requires both behavior packs activated in the Editor project.
>
> ![loaded packs](/assets/posts/cinematic-editor/cinematic-addons-loaded.png)

**Reset Scene**

This action will reset all data of the camera scene from the Editor extension, and it cannot be undone once the scene is removed. This does not affect the scene in Cinematic Runtime Add-On.

# Cinematic Runtime Add-On

The Cinematic Runtime Add-On allows players to play a scene by sending scene data from Cinematic Editor in the release version of Minecraft.

This is made possible through exporting the scene data from the editor extension to another add-on. And the data is saved in world storage, so the scene can still be played when rejoining without the need to import the data again.

<iframe width="914" height="514" src="https://www.youtube.com/embed/sFjZIkR1pKY" title="This Minecraft Mod Changes Player Perspective" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The video above showcase how you can export keyframes from the editor and import the data and play a scene in a normal Minecraft world.

## Import Scene from Editor to World

In the video, it showcased the extension has the capability to transfer a scene data to the runtime Add-On. Here's how you do it:

1. Apply both Cinematic Editor Extension and Cinematic Runtime Add-On to an Editor project.
2. Create a scene in the Editor UI, then press the **Export Scene** button.
3. Either using **Test World feature** or **export the project as world** in world settings to convert an Editor project to normal world.
4. Enter the world, and type the following command:

   ```
   /function cinematic/editor
   ```

## Creating a Scene

The runtime add-on now supports creating and editing a Minecraft scene without the Editor, by sacrificing the fancy UI given by Minecraft Editor engine.

Start by running the following command:

```
/function cinematic/editor
```

When executed, this form should appear when you have not created a scene:

![Runtime Editor showing Create scene](/assets/posts/cinematic-editor/runtime-editor-create-scene.png)

## Scene Editor Mode

After pressing the create scene button, you will enter Scene Editor mode. There will be 3 items in your hotbar, and your whole inventory will be cleared until you exit scene editor mode:

![Scene editor mode](/assets/posts/cinematic-editor/addon-scene-editor.png)

### Exit without saving scene

Exits scene editor without saving the scene using the **Cancel** item.

### Create keyframe

**Create a keyframe** using the camera item. Not to be confused with Minecraft's camera item.

When using this item a keyframe will be saved temperatory to a scene.

It will also asks you to set values of ease type and ease time, which you can change it later after exiting scene editor mode.

![Scene editor mode create keyframe](/assets/posts/cinematic-editor/addon-create-keyframe.png)

### Saving Scene

Using the **Confirm** item will save the scene to the world.

## Edit Existing Scene

Once you have created an existing scene and when you decide to edit that scene, enter `/function cinematic/editor` command and you will be greeted with different panel:

![Runtime Editor edit scene](/assets/posts/cinematic-editor/runtime-editor-edit-scene.png)

Select a keyframe then select **Edit Keyframe**, which brings you back to the form seen in [Create Keyframe](#create-keyframe).

You can also delete a keyframe from existing scene.

![edit keyframe](/assets/posts/cinematic-editor/addon-edit-keyframe.png)

# Changelog

Changelog for Cinematic Editor extension and Cinematic Runtime Add-On

## Cinematic Editor Extension

### 1.3.0

- Editor extension now requires Minecraft v1.21.10 Previews to run
- Renamed 'Run Timeline' to 'Play Scene' - Plays the scene which is stored in editor extension storage.
- Renamed 'Export Keyframes' to 'Export Scene' - Export the scene from editor extension storage to Cinematic Editor Runtime Add-On, which can be played through Scene Player item.
- Group Export Scene and Play Scene button into 'Scene Action' pane
- Added 'Reset Scene' button - Reset editor extension camera scene.
- Updated Add-On Manifest metadata, changing license from MIT to All Rights Reserved.

### 1.2.0

<details>

- Module version property is now the same as `header.version`
- Editor extension is now compatible with 1.20.80-preview.21 or above.
- Fix Vector class not exported from '@minecraft/server' module in 1.20.80-preview.21.
- Output files are now bundled.

</details>

### 1.1.1

<details>

- Editor extension is now compatible with 1.20.80 previews.
- HUD is now hidden when 'Run Timeline' is pressed
- When pressing 'Export Keyframes', the keyframe data will automatically transfer to Cinematic Runtime add-on. This requires cinematic runtime add-on to be loaded on editor world.

</details>

### 1.0.5

<details>

- Fix a critical bug where world hangs when 'Run Timeline' is pressed.

</details>

### 1.0.4

<details>

- Editor extension is now compatible with 1.20.70 previews

</details>

### 1.0.3

<details>

- Exported data from Export Keyframes can now be used in Cinematic Runtime Add-On
- Behavior packs and resource packs are now dependent, so when one of the resource or behavior pack is applied to world the other pack is also applied automatically.

</details>

### 1.0.2

<details>

- Update pack name and description
- Add-on is now compatible with 1.20.60 previews.

</details>

### 1.0.1

<details>

- Export keyframes now converts keyframes into /camera commands

</details>

### 1.0.0

<details>

- Added extension icon (icon by Mojang)

</details>

### 0.3.0-beta

<details>

- Refactor storage system to make it compatible for latest Dynamic Properties changes.
- Fix a bug where Ease Type and Ease Time aren't sync when changing keyframe selection.
- Fix Ease Time not being able to input float numbers.
- Export Content field is now hidden unless 'Export Keyframes' button is pushed.
- Easing values are now saved automatically when changed.

</details>

### 0.2.0-beta

<details>

- Increase maximum stored keyframes from 9 to 600
- Fix the delay caused by running timeline
- Text pane now disallow user from modifying the export content
- Add easing into cinematic editor

</details>

### 0.1.0-beta

<details>

- Add tool and pane with no functionality.
- Add export content
- Add player location, rotation

</details>

## Cinematic Runtime Add-On

### 0.4.0

- You can now create and modify the scene within the Cinematic Runtime Add-On, alternative to Cinematic Editor Extension.

  > [!NOTE]
  >
  > - This feature is made mainly to support creators without Minecraft for Windows to make a scene.
  > - For detailed usage of this feature, please check the post.

- Added `/function cinematic/editor` command - Opens an editor for creating and modifying a Minecraft scene.
- Renamed 'Camera Runtime' item to 'Scene Player'
- Updated Add-On Manifest metadata, changing license from MIT to All Rights Reserved.
- Add-On now supports Minecraft v1.20.80, v1.21.0 and v1.21.10

### 0.3.0

<details>

- Module version property is now the same as `header.version`
- Editor extension is now compatible with 1.20.80-preview.21 or above.
- Using '@minecraft/math' module instead of Vector class from '@minecraft/server'
- Output files are now bundled.

</details>

### 0.2.1

<details>

- Pack is now compatible with 1.20.80 previews only

</details>

### 0.2.0

<details>

- Pack is now compatible with 1.20.70 previews only
- Runtime add-on now requires Beta APIs experiment
- HUD is now hidden when using camera runtime until scene ends

</details>

### 0.1.1

<details>

- Fix a critical bug where world hangs when 'Run Timeline' is pressed.

</details>

### 0.1.0

<details>

- Initial Release for Release 1.20.50
- Added input form
- Added an item that plays a scene when used

</details>

# Downloads

<iframe width="930" height="523" src="https://www.youtube.com/embed/x3hAOwJrwyk" title="How to install a Minecraft Editor Extension" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This video has infomations of installing this editor extension, and behind the scenes of development of the cinematic editor.

> [!IMPORTANT]
>
> - Cinematic Editor Extension requires Bedrock Editor mode to be enabled, which the engine is only available to Windows 10/11 players. Check out [this article](https://learn.microsoft.com/en-us/minecraft/creator/documents/editorinstallation) to get access to the Editor.
>
> - Cinematic Editor Runtime Add-On requires **Beta APIs** experiment enabled.
>
>   ![beta api enabled](/assets/posts/cinematic-editor/beta-api-enabled.png)
>
> - You are allowed to repost this add-on to other websites or make a YouTube video for commercial purposes, provided that you must put the link this post https://jaylydev.github.io/posts/cinematic-editor/ in the description of the video or a webpage and must not have any other direct-download links.

- [Download Cinematic Editor Extension (Minecraft Preview v1.21.10)](https://github.com/jayly-bot/addons/releases/download/cinematic-editor_v1.3.0/CinematicEditor_v1.3.0.mceditoraddon)
- [Download Cinematic Runtime Add-On (Minecraft v1.20.80)](https://github.com/jayly-bot/addons/releases/download/cinematic-runtime_v0.4.0/CinematicRuntime_v0.4.0+1.20.80.mcaddon)
- [Download Cinematic Runtime Add-On (Minecraft v1.21.0)](https://github.com/jayly-bot/addons/releases/download/cinematic-runtime_v0.4.0/CinematicRuntime_v0.4.0+1.21.0.mcaddon)
- [Download Cinematic Runtime Add-On (Minecraft v1.21.10)](https://github.com/jayly-bot/addons/releases/download/cinematic-runtime_v0.4.0/CinematicRuntime_v0.4.0+1.21.10.mcaddon)
