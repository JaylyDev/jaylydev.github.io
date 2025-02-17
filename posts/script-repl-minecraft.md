---
author: Jayly
title: Minecraft Script REPL Add-On
description: Script REPL Add-On is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft.
date: 9/18/2024
image: /assets/posts/script-repl-minecraft/thumbnail.png
download: true
---

# Minecraft Script REPL Add-On

![Thumbnail](/assets/posts/script-repl-minecraft/thumbnail.png)

Script REPL (read-eval-print loop) Add-On is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft: Bedrock Edition. This powerful add-on is great to use for debugging, prototyping, and learning JavaScript and Minecraft's scripting API.

![REPL Form](/assets/posts/script-repl-minecraft/script-interpreter-v12050_2.png)

Currenly JavaScript is the only programming language that allow developers to use Script APIs from within their code.

This add-on allows developers to debug JavaScript code and reports an error condition immediately in Minecraft in-game using this interpreter. This reduces the amount of script errors happened in your code development and time, and allows developers to experiment with the new features available in Script API modules in Minecraft.

## Learning Minecraft's Script API

You are advised to learn JavaScript free from online courses available online before learning how to use Minecraft's Scripting API, such as the following:

- [MDN JavaScript: JavaScript language overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Overview)
- [Codecademy: Introduction to JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
- [freeCodeCamp.org: JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

There are somewhat decent amount of resources available online related to script API. Important links have a ⭐.

- ⭐ [Official Script API Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/) - Microsoft's official documentation of high-level introduction of experimental Script API

- [Jayly's Script API Documentation](https://jaylydev.github.io/scriptapi-docs/latest/) - Jayly's Script API documentation with guides and easy to use and understand API references for programming beginners.

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

### Chat Commands (Beta)

The add-on also provides chat commands that is locked behind Script REPL beta versions.

- `!help`: Help Command
- `!interpreter`: Opens Interpreter
  > This command requires operator permission.
- `!javascript`: Opens a javascript REPL
  > This command requires operator permission.
- `!version`: Displays the version of the interpreter
  > This command requires operator permission.

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
  - `@minecraft/server`: `1.16.0-beta`
  - `@minecraft/server-ui`: `1.4.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
- Script REPL (Latest):
  - `@minecraft/server`: `1.15.0`
  - `@minecraft/server-ui`: `1.3.0`
- Script REPL (Preview + Beta APIs):
  - `@minecraft/server`: `1.17.0-beta`
  - `@minecraft/server-ui`: `1.4.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
- Script REPL (Preview):
  - `@minecraft/server`: `1.16.0`
  - `@minecraft/server-ui`: `1.3.0`
- Script REPL (Preview, Bedrock Server build):
  - `@minecraft/server`: `1.17.0-beta`
  - `@minecraft/server-ui`: `1.4.0-beta`
  - `@minecraft/server-gametest`: `1.0.0-beta`
  - `@minecraft/debug-utilities`: `1.0.0-beta`
  - `@minecraft/server-net`: `1.0.0-beta`
  - `@minecraft/server-admin`: `1.0.0-beta`

> [!NOTE]
> All versions of Script REPL also loads external npm packages such as `@minecraft/vanilla-data` and `@minecraft/math` (using v1.4.0) when executing JavaScript code.

### Bedrock Dedicated Server Build

> [!CAUTION]  
> The Script REPL Add-On support for using Bedrock Dedicated Server exclusive APIs are currently experimental.

> [!IMPORTANT]
> This version of the Script REPL add-on do not function within the Minecraft game client or within Minecraft Realms.

The Bedrock Dedicated Server version of the Script REPL Add-On allows players to access higher levels of Script APIs, specifically the `@minecraft/server-net` module and the `@minecraft/server-admin` module. These modules are exclusive to Bedrock Dedicated Servers.

The `@minecraft/server-net` module can send HTTP requests from the Bedrock server, and inspect Bedrock server packets.

The `@minecraft/server-admin` module can administe a Bedrock Dedicated Server, including transfer players to another Bedrock server.

#### Enable modules in BDS

To use this add-on, you would have to enable some modules in the Bedrock Dedicated Server folder. This allows this version of the add-on to be used.

**Install Bedrock Dedicated Server**

1. If you haven't already, download the Bedrock Dedicated Server package from the Minecraft website.
2. Extract the zip file on a folder.

```
bedrock-server
│  allowlist.json
│  bedrock_server.exe
│  bedrock_server_how_to.html
│  permissions.json
│  release-notes.txt
│  server.properties
│
├─behavior_packs
├─config
│  └─default
│          permissions.json
│
├─definitions
└─resource_packs
```

3. In the permissions.json file, which is located in `config/<pack_id>/permissions.json` or `config/default/permissions.json`, enable `@minecraft/server-net` module, the `@minecraft/server-admin` module and the `@minecraft/debug-utilities` module by adding the following in the allowed_modules key. These module is not enabled by default in the server.

```diff
{
  "allowed_modules": [
    "@minecraft/server-gametest",
    "@minecraft/server",
    "@minecraft/server-ui",
    "@minecraft/server-admin",
+   "@minecraft/server-net",
+   "@minecraft/debug-utilities",
    "@minecraft/server-editor"
  ]
}
```

Full file (`config/default/permissions.json`):

```json
{
  "allowed_modules": [
    "@minecraft/server-gametest",
    "@minecraft/server",
    "@minecraft/server-ui",
    "@minecraft/server-admin",
    "@minecraft/server-net",
    "@minecraft/debug-utilities",
    "@minecraft/server-editor"
  ]
}
```

> [!IMPORTANT]
>
> - Modifying the files in the default config folder allows every add-on with the server-net module to have access to the @minecraft/server-net module.
>
> - It is recommended to assign individual permissions for each script behavior pack.

4. Enable Beta APIs in world settings. It's recommended to enable this setting in Minecraft clients.

![experiments](/assets/posts/script-repl-minecraft/enable-experiments.png)

> Enable **Beta APIs** experiments in world settings. This is needed to run Script REPL with Beta API features.

## Downloads

These download links do not go through Boostellar, so there shouldn't be any malicious links.

### Minecraft: Bedrock Edition Preview

- [Download Script REPL Add-On (v1.21.50 + Beta APIs Experiment)](https://github.com/JaylyDev/interpreter/releases/download/v21.50.0/script_repl_v21.50.0-beta.mcaddon)
- [Download Script REPL Add-On (v1.21.50)](https://github.com/JaylyDev/interpreter/releases/download/v21.50.0/script_repl_v21.50.0.mcaddon)
- [Download Script REPL Add-On (v1.21.50, BDS only)](https://github.com/JaylyDev/interpreter/releases/download/v21.50.0/script_repl_bds_v21.50.0-beta.mcaddon)

### Minecraft: Bedrock Edition

- [Download Script REPL Add-On (v1.21.40 + Beta APIs Experiment)](https://github.com/JaylyDev/interpreter/releases/download/v21.40.1/script_repl_v21.40.1-beta.mcaddon)
- [Download Script REPL Add-On (v1.21.40)](https://github.com/JaylyDev/interpreter/releases/download/v21.40.1/script_repl_v21.40.1.mcaddon)

### Minecraft: Education Edition

> [!IMPORTANT]
>
> To use this add-on in Minecraft: Education Edition, experiments may be required to activate the add-on. The resource pack below allows experiments to be enabled in Education Edition.
>
> - [Download Enable Experiments Resource Pack (for Minecraft Education only)](/posts/enable-experiments/)

- [Download Script REPL Add-On (v1.21.0 + Beta APIs Experiment)](https://github.com/JaylyDev/interpreter/releases/download/v21.0.0/script_repl_v21.0.2-beta.mcaddon)
- [Download Script REPL Add-On (v1.21.0)](https://github.com/JaylyDev/interpreter/releases/download/v21.0.0/script_repl_v21.0.3.mcaddon)

### Other Versions

Click the link below and choose a version of Script REPL add-on that is compatible with your Minecraft version to download.

- [Download Script REPL Add-On](/posts/script-repl-minecraft/downloads/)
