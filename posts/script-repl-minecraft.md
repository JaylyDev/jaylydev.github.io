---
author: Jayly
title: Minecraft Script REPL Add-On
description: Script REPL Add-On is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft.
date: 7/27/2024
image: /assets/posts/script-repl-minecraft/thumbnail.png
download: true
---

# Minecraft Script REPL Add-On

![Thumbnail](/assets/posts/script-repl-minecraft/thumbnail.png)

Script REPL (read–eval–print loop) Add-On is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft: Bedrock Edition. This powerful add-on is great to use for debugging, prototyping, and learning JavaScript and Minecraft's scripting API.

![REPL Form](/assets/posts/script-repl-minecraft/script-interpreter-v12050_2.png)

Currenly JavaScript is the only programming language that allow developers to use Script APIs from within their code.

This add-on allows developers to debug JavaScript code and reports an error condition immediately in Minecraft in-game using this interpreter. This reduces the amount of script errors happened in your code development and time, and allows developers to experiment with the new features available in Script API modules in Minecraft.

## Learning Minecraft's Script API

You are advised to learn JavaScript free from online courses available online before learning how to use Minecraft's Scripting API, such as the following:

- [MDN JavaScript: JavaScript language overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Overview)
- [Codecademy: Introduction to JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
- [freeCodeCamp.org: JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

There are somewhat decent amount of resources available online related to script API. Important links have a ⭐.

- ⭐ [Sample GameTests from Microsoft](https://github.com/microsoft/minecraft-gametests) - Sample GameTest behavior files for Minecraft Bedrock Edition. Minecraft supports GameTests - a combination of JavaScript + MCStructures - for validating facets of Minecraft behavior.

- ⭐ [Official Script API Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/) - Microsoft's official documentation of high-level introduction of experimental Script API

- [Jayly's Script API Documentation](https://jaylydev.github.io/scriptapi-docs/) - Jayly's Script API documentation with guides and easy to use and understand API references for programming beginners.

- [Script API Examples](https://github.com/JaylyDev/ScriptAPI) - JavaScript code snippets that uses Script API modules only

> [Click here](https://jaylydev.github.io/scriptapi-docs/meta/resource-links.html) for a list of links related to resources for Minecraft Script API.

## Add-On Usage Examples

**Here are some examples executing JavaScript in-game:**

1. This script makes the world / script engine say "running"

![Example 1 code](/assets/posts/script-repl-minecraft/script-interpreter-v12050_3.png)

![Example 1 result](/assets/posts/script-repl-minecraft/script-interpreter-v12050_4.png)

2. This script shows the script has error.

![Example 2 code](/assets/posts/script-repl-minecraft/script-interpreter-v12050_5.png)

![Example 2 result](/assets/posts/script-repl-minecraft/script-interpreter-v12050_6.png)

> Get it? Cause Aether dimension does not exist in Minecraft.

## Script REPL Item

![repl item](/assets/posts/script-repl-minecraft/script-interpreter-v12050_7.png)

1. You can get the `JavaScript REPL [Use]` item through the following methods:

- Script event command
  ```
  /scriptevent interpreter:js
  ```
- Chat Command
  ```
  !javascript
  ```
  > [!IMPORTANT]  
  > This feature is only available behind beta versions of interpreter only.

2. Use the enchantment book with the name `JavaScript REPL [Use]` to open the interpreter
3. Type your javascript code in the form. Best thing is that this form has multi-line supported, meaning you can write multiple lines of code here.
4. Press **Submit** button to start executing your code.

In case you want to disable your code, you have to run `/reload` command which requires operator permission to execute the command.

## Script Block

> [!NOTE]
> This feature is not available to Script REPL v1.21.0 without Beta APIs experiment.

<div align="center">
<image src="/assets/posts/script-repl-minecraft/script-interpreter-v12050_8.png"/>
</div>

The Script Block can store and execute JavaScript code in a Minecraft world. It cannot be obtained or used in Survival mode without cheats.

### Obtaining

The script blocks can either be obtained by using various commands, such as `/give @s interpreter:script_block` or `/setblock ~ ~ ~ interpreter:script_block`, or by pressing the pick block control on an existing script block.

Script blocks are not flammable, and have the same blast resistance as bedrock. They cannot cannot be mined in Survival mode, however they can be pushed with pistons and sticky pistons and the data inside the block persists.

### Script Block Usage

A script block can execute JavaScript code when activated by pressure plates and buttons currently. Script output is displayed when player activates the script block.

### Modification

To enter command or modify the script block, players must interact with the script block. The scripts can be entered in the text input within the modal form. The text limit for scripts in a script block is 32,767 characters, you can scroll through lines of code just like the NPC text prompt UI.

Scripts in a script block do not need to be prefixed with imports (e.g. `import { world } from "@minecraft/server"`) as they do in the actual JavaScript files.

When finished inputing JavaScript code, save the code into the script block by pressing 'Save' button. Upon pressing the button it will not immediately execute scripts unlike the Script REPL item.

## Trailer

This is a very old showcase video of the add-on, fun fact the video includes the ability to run TypeScript code because this add-on used to be able to run TypeScript code.

<iframe width="930" height="523" src="https://www.youtube.com/embed/niZAVbf0I8w" title="I Coded JavaScript &amp; TypeScript In Minecraft..." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Installation

First you go to the download section and click **"Download Script REPL" (with or without experimentals)**, then the add-on will be downloaded to your device.

### Using Interpreter with Beta API features

Import the add-on to Minecraft.

> [!IMPORTANT]  
> Enable **Beta APIs** experiments in world settings. These experiments are needed to run Script REPL with Beta API features.

![experiments](/assets/posts/script-repl-minecraft/enable-experiments.png)

> Enable Experiments in New Create World Screen

### Using Interpreter without Beta API features

No experimental toggles needed to be enabled.

## What APIs the REPL supports

Each invidiual version of Script REPL supports various fields of the APIs. Each version of script REPL have the latest version of script modules as the dependency on their channels:

- Script REPL (Latest + Beta APIs):
  - `@minecraft/server`: `1.12.0-beta`
  - `@minecraft/server-ui`: `1.2.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
- Script REPL (Latest):
  - `@minecraft/server`: `1.11.0`
  - `@minecraft/server-ui`: `1.1.0`
- Script REPL (Preview + Beta APIs):
  - `@minecraft/server`: `1.14.0-beta`
  - `@minecraft/server-ui`: `1.3.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
- Script REPL (Preview):
  - `@minecraft/server`: `1.13.0`
  - `@minecraft/server-ui`: `1.2.0`

> [!NOTE]
> All versions of Script REPL also loads external npm packages such as `@minecraft/vanilla-data` and `@minecraft/math` when executing JavaScript code.

## Downloads

These download links do not go through Boostellar, so there shouldn't be any malicious links.

Click the link below and choose a version of Script REPL add-on that is compatible with your Minecraft version to download.

- [Download Script REPL Add-On](/posts/script-repl-minecraft/downloads/)

- [Download Enable Experiments Resource Pack (for Minecraft Education only)](/posts/enable-experiments/)
