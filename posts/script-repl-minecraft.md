---
author: Jayly
title: Minecraft Script REPL Add-On
description: Script REPL Add-On is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft.
date: 3/4/2024
---

# Minecraft Script REPL Add-On

Script REPL (read–eval–print loop) Add-On is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft: Bedrock Edition. This powerful add-on is great to use for debugging, prototyping, and learning JavaScript and Minecraft's scripting API.

![REPL Form](/assets/posts/script-repl-minecraft/script-interpreter-v12050_2.png)

Currenly JavaScript is the only programming language that allow developers to use Script APIs from within their code.

To learn more about Minecraft's Script API, please visit [Microsoft's Script API Documentation](https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/)..

**Here are some examples executing JavaScript in-game:**

1. This script makes the world / script engine say "running"

![Example 1 code](/assets/posts/script-repl-minecraft/script-interpreter-v12050_3.png)

![Example 1 result](/assets/posts/script-repl-minecraft/script-interpreter-v12050_4.png)

2. This script shows the script has error.

![Example 2 code](/assets/posts/script-repl-minecraft/script-interpreter-v12050_5.png)

![Example 2 result](/assets/posts/script-repl-minecraft/script-interpreter-v12050_6.png)

> Get it? Cause Aether dimension does not exist in Minecraft.

**To get started:**

![repl item](/assets/posts/script-repl-minecraft/script-interpreter-v12050_7.png)

1. You can get the `JavaScript REPL [Use]` item through chat command `!javascript` (available on all interpreter builds) or script event command `/scriptevent interpreter:js` (available on non-experimental interpreter builds)
2. Use the enchantment book with the name `JavaScript REPL [Use]` to open the interpreter
3. Type your javascript code in the form. Best thing is this form has multi-line supported, meaning you can write multiple lines of code here.
4. Press **Submit** button to start executing your code

In case you want to disable your code, you have to run `/reload` command which requires operator permission to execute the command.

## Script Block

> [!NOTE]  
> This feature is only available behind beta versions of interpreter only.

<div align="center">
<image src="/assets/posts/script-repl-minecraft/script-interpreter-v12050_8.png"/>
</div>

If you want to have multiple JavaScript code stored in the world, script block helps you store the JavaScript code similar to a command block. However the code can only be executed from the player who interacted and press 'Submit' button in the form.

The code data will not be lost from the block moving with pistons, unless the block is destroyed from explosion or breaking blocks.

## Trailer

This is a very old showcase video of the add-on, fun fact the video includes the ability to run TypeScript code because this add-on used to be able to run TypeScript code.

<iframe width="930" height="523" src="https://www.youtube.com/embed/niZAVbf0I8w" title="I Coded JavaScript &amp; TypeScript In Minecraft..." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# Installation

First you go to the download section and click **"Download Script REPL" (with or without experimentals)**.

You will be redirected to Mediafire, then the add-on will be downloaded to your device.

### Using Interpreter with Beta API features

Import the add-on to Minecraft.

> [!IMPORTANT]  
> Enable **Holiday Creator Features** and **Beta APIs** experiments in world settings. These experiments are needed to run Script REPL with Beta API features.

![experiments](/assets/posts/script-repl-minecraft/script-interpreter-v12050_9.png)

> Enable Experiments in New Create World Screen

### Using Interpreter without Beta API features

No experimental toggles needed to be enabled.

## What APIs the REPL supports

Each invidiual version of Script REPL supports various fields of the APIs. Each version of script REPL have the latest version of script modules as the dependency on their channels:

- Script REPL (Latest + Beta APIs):
  - `@minecraft/server`: `1.10.0-beta`
  - `@minecraft/server-ui`: `1.2.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
- Script REPL (Latest):
  - `@minecraft/server`: `1.9.0`
  - `@minecraft/server-ui`: `1.1.0`
- Script REPL (Preview + Beta APIs):
  - `@minecraft/server`: `1.11.0-beta`
  - `@minecraft/server-ui`: `1.2.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
- Script REPL (Preview):
  - `@minecraft/server`: `1.10.0`
  - `@minecraft/server-ui`: `1.1.0`

> [!NOTE]
> All versions of Script REPL also loads external npm packages such as `@minecraft/vanilla-data` and `@minecraft/math` when executing JavaScript code.

## Downloads

These download links do not go through Boostellar, so there shouldn't be any malicious links.

- [Download Script REPL (Latest + Beta APIs)](https://www.mediafire.com/file/ib5jb632e0oay3l/interpreter-20.7.0-beta.mcaddon/file)

- [Download Script REPL (Latest)](https://www.mediafire.com/file/8q9tebnd72qr0sx/interpreter-20.7.0.mcaddon/file)

- [Download Script REPL (Preview + Beta APIs)](https://www.mediafire.com/file/cdlh4gqwzxgskyr/interpreter-20.8.0-beta.mcaddon/file)

- [Download Script REPL (Preview)](https://www.mediafire.com/file/bhjcw3c6dgype35/interpreter-20.8.2.mcaddon/file)
