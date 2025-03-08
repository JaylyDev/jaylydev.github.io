---
author: Jayly
title: Minecraft Script Interpreter
description: Script Interpreter allows user to run JavaScript code within Minecraft.
date: 3/8/2025
image: /assets/posts/script-repl-minecraft/thumbnail.png
download: true
---

# Minecraft Script Interpreter

![Thumbnail](/assets/posts/script-repl-minecraft/thumbnail.png)

Script Interpreter is a debugging tool for Minecraft Scripting. It is a Bedrock add-on allows user to run JavaScript code in Minecraft Bedrock. This is great to use for debugging, prototyping, and learning JavaScript and Minecraft's scripting API.

## What is Scripting / Script API

Minecraft scripting involves using the JavaScript (or TypeScript) programming language to create interactive experiences and gameplay mechanics in Minecraft. It is one of the ways to mod Minecraft with Add-Ons.

If you're new to JavaScript development, you are advised to learn JavaScript free from online courses available online before writing scripts for Minecraft, such as the following:

- [Beginner's Series to JavaScript from Microsoft](https://learn.microsoft.com/en-us/shows/beginners-series-to-javascript/)
- [MDN JavaScript: JavaScript language overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Overview)
- [Codecademy: Introduction to JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
- [freeCodeCamp.org: JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

You are also advised to learn how to write scripts using Minecraft's Script API before using this add-on, as this add-on is not a tutorial to Script API. Check out [Introduction to Scripting in Minecraft](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptingintroduction) for more information.

## Introduction to Script Interpreter

![Script Interpreter Form](/assets/posts/script-repl-minecraft/script-interpreter-v12050_2.png)

This add-on allows developers to debug JavaScript code and reports an error condition immediately in Minecraft in-game using this interpreter. This reduces the amount of script errors happened in your code development and time, and allows developers to experiment with the new features available in Script API modules in Minecraft.

However you can only run JavaScript code in this add-on, because the scripting engine only supports JavaScript.

**Here are some examples executing JavaScript in-game:**

1. This script makes the world / script engine say "running"

![Example 1 code](/assets/posts/script-repl-minecraft/script-interpreter-v12050_3.png)

![Example 1 result](/assets/posts/script-repl-minecraft/script-interpreter-v12050_4.png)

2. This script shows the script has error.

![Example 2 code](/assets/posts/script-repl-minecraft/script-interpreter-v12050_5.png)

![Example 2 result](/assets/posts/script-repl-minecraft/script-interpreter-v12050_6.png)

> Get it? Cause Aether dimension does not exist in Minecraft.

## Script Interpreter Item

![repl item](/assets/posts/script-repl-minecraft/script-interpreter-v12050_7.png)

1. You can get the `JavaScript Interpreter [Use]` item through the following methods:

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

2. Use the enchantment book with the name `JavaScript Interpreter [Use]` to open the interpreter
3. Type your javascript code in the form. Best thing is that this form has multi-line supported, meaning you can write multiple lines of code here.
4. Press **Submit** button to start executing your code.

In case you want to disable your code, you have to run `/reload` command which requires operator permission to execute the command.

## Script Block

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

When finished inputing JavaScript code, save the code into the script block by pressing 'Save' button. Upon pressing the button it will not immediately execute scripts unlike the Script Interpreter item.

## Startup Scripts

![Startup script form](/assets/posts/script-interpreter/startup-scripts.png)

This add-on allows you to add scripts to run automatically when Minecraft loads the add-on. Here's how:

1. Open Startup Scripts form by typing `/function repl/startup`, and hitting Enter.

2. Click on 'Create New' button on the form.

3. A new form appears with an input field, give your task a name (e.g., "Run Block Filling Procedure") and check Add Script Code to write scripts for the task.

4. press 'Add Script Code', which redirects you to write some scripts for the task.

5. After writing the script, Click 'Save Scripts' to finish setting it up.

This should automatically launch the task when you load the add-on.

## Chat Commands (Beta)

The add-on also provides chat commands that is locked behind Script Interpreter beta versions.

- `!help`: Help Command
- `!interpreter`: Opens Interpreter
  > This command requires operator permission.
- `!javascript`: Opens a javascript Interpreter
  > This command requires operator permission.
- `!version`: Displays the version of the interpreter
  > This command requires operator permission.

## Shutdown Scripts (Beta)

> ![IMPORTANT]
> This feature is only available to interpreters v1.21.70-beta or above.

![shutdown script form](/assets/posts/script-interpreter/shutdown-scripts.png)

This add-on allows you to add scripts to run automatically when Minecraft is shutting down. Here's how:

1. Open shutdown Scripts form by typing `/function repl/shutdown`, and hitting Enter.

2. Click on 'Create New' button on the form.

3. A new form appears with an input field, give your task a name (e.g., "Run Cleanup Procedure") and check Add Script Code to write scripts for the task.

4. press 'Add Script Code', which redirects you to write some scripts for the task.

5. After writing the script, Click 'Save Scripts' to finish setting it up.

This should automatically launch the task when the world shuts, or when before shutdown event is called.

## Trailer

This is a very old showcase video of the add-on, fun fact the video includes the ability to run TypeScript code because this add-on used to be able to run TypeScript code.

<iframe width="930" height="523" src="https://www.youtube.com/embed/niZAVbf0I8w" title="I Coded JavaScript &amp; TypeScript In Minecraft..." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Installation

First you go to the download section and click **"Download Script Interpreter" (with or without experimentals)**, then the add-on will be downloaded to your device.

### Using Interpreter with Beta API features

Import the add-on to Minecraft.

> [!IMPORTANT]  
> Enable **Beta APIs** experiments in world settings. These experiments are needed to run Script Interpreter with Beta API features.

![experiments](/assets/posts/script-repl-minecraft/enable-experiments.png)

> Enable Experiments in New Create World Screen

### Using Interpreter without Beta API features

No experimental toggles needed to be enabled.

### Enable Script Modules

Some script modules are not enabled by the add-on by default. You can enable the following modules through modifying the behavior pack's manifest.json file.

The add-on enables the following modules by default:

**Stable API Pack**

- `@minecraft/server` (Cannot be removed)
- `@minecraft/server-ui` (Cannot be removed)

**Beta API Pack**

- `@minecraft/server` (Cannot be removed)
- `@minecraft/server-ui` (Cannot be removed)
- `@minecraft/server-gametest`
- `@minecraft/debug-utilities`
- `@minecraft/server-admin`

**Optional Modules**

- Editor API:

  > [!IMPORTANT]
  > Editor API can only be used in Editor projects.

  Add the following to manifest dependencies list:

  ```json
  {
    "module_name": "@minecraft/server-editor",
    "version": "0.1.0-beta"
  }
  ```

  > Check [Editor API Reference](https://jaylydev.github.io/scriptapi-docs/latest/modules/_minecraft_server-editor.html) for latest manifest details

- `@minecraft/server-net` module:

  > [!IMPORTANT]
  > The `@minecraft/server-net` module can only be used in Bedrock Dedicated Server.

  Add the following to manifest dependencies list:

  ```json
  {
    "module_name": "@minecraft/server-net",
    "version": "0.1.0-beta"
  }
  ```

  > Check [`@minecraft/server-net` Reference](https://jaylydev.github.io/scriptapi-docs/latest/modules/_minecraft_server-net.html) for latest manifest details

- `@minecraft/diagnostics` module (Preview only):

  > [!IMPORTANT]
  > The `@minecraft/diagnostics` module can only be used in Bedrock Dedicated Server.

  Add the following to manifest dependencies list:

  ```json
  {
    "module_name": "@minecraft/diagnostics",
    "version": "1.0.0-beta"
  }
  ```

  > Check [`@minecraft/diagnostics` Reference](https://jaylydev.github.io/scriptapi-docs/preview/modules/_minecraft_diagnostics.html) for latest manifest details

### Using Script Interpreter in Bedrock Dedicated Servers

The Bedrock Dedicated Server version of the Script Interpreter Add-On allows players to access higher levels of Script APIs. The following modules are exclusive to Bedrock Dedicated Servers:

- `@minecraft/server-net` module - Can send HTTP requests from the Bedrock server, and inspect Bedrock server packets.
- `@minecraft/diagnostics` module - Contains diagnostics functionality for reporting bugs to [Sentry](https://sentry.io/).
- `@minecraft/debug-utilities` module - It's enabled on Minecraft clients but not Bedrock Dedicated Servers or Minecraft Realms by default.

#### Enable modules in Bedrock Dedicated Servers

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

3. In the permissions.json file, which is located in `config/<pack_id>/permissions.json` or `config/default/permissions.json`, enable `@minecraft/server-net` module, the `@minecraft/diagnostics` module and the `@minecraft/debug-utilities` module by adding the following in the allowed_modules key. These module is not enabled by default in the server.

```diff
{
  "allowed_modules": [
    "@minecraft/server-gametest",
    "@minecraft/server",
    "@minecraft/server-ui",
    "@minecraft/server-admin",
+   "@minecraft/server-net",
+   "@minecraft/debug-utilities",
+   "@minecraft/diagnostics",
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
    "@minecraft/diagnostics",
    "@minecraft/server-editor"
  ]
}
```

> [!IMPORTANT]
>
> - Modifying the files in the default config folder allows every add-on with the server-net module to have access to the @minecraft/server-net module.
> - It is recommended to assign individual permissions for each script behavior pack.

4. Enable Beta APIs in world settings. It's recommended to enable this setting in Minecraft clients.

![experiments](/assets/posts/script-repl-minecraft/enable-experiments.png)

> Enable **Beta APIs** experiments in world settings. This is needed to run Script Interpreter with Beta API features.

## Downloads

These download links do not go through Boostellar, so there shouldn't be any malicious links.

### Minecraft Bedrock Preview

- [Download Script Interpreter Add-On (v1.21.70 + Beta APIs Experiment)](https://github.com/JaylyDev/interpreter/releases/download/v21.70.0/interpreter_v21.70.0-beta.mcaddon)
- [Download Script Interpreter Add-On (v1.21.70)](https://github.com/JaylyDev/interpreter/releases/download/v21.70.0/interpreter_v21.70.0.mcaddon)

### Minecraft Bedrock

- [Download Script Interpreter Add-On (v1.21.60 + Beta APIs Experiment)](https://github.com/JaylyDev/interpreter/releases/download/v21.60.0/interpreter_v21.60.0-beta.mcaddon)
- [Download Script Interpreter Add-On (v1.21.60)](https://github.com/JaylyDev/interpreter/releases/download/v21.60.0/interpreter_v21.60.0.mcaddon)

### Minecraft Education Edition

> [!IMPORTANT]
>
> To use this add-on in Minecraft Education Edition, experiments may be required to activate the add-on. The resource pack below allows experiments to be enabled in Education Edition.
>
> - [Download Enable Experiments Resource Pack (for Minecraft Education only)](/posts/enable-experiments/)

- [Download Script Interpreter Add-On (v1.21.0 + Beta APIs Experiment)](https://github.com/JaylyDev/interpreter/releases/download/v21.0.0/script_repl_v21.0.2-beta.mcaddon)
- [Download Script Interpreter Add-On (v1.21.0)](https://github.com/JaylyDev/interpreter/releases/download/v21.0.0/script_repl_v21.0.3.mcaddon)

### Other Versions

Click the link below and choose a version of Script Interpreter add-on that is compatible with your Minecraft version to download.

- [Download Script Interpreter Add-On](/posts/script-interpreter/downloads/)
