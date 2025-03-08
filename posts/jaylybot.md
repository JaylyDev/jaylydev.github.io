---
author: Jayly
title: JaylyBot
description: JaylyBot is a Discord bot that includes various Minecraft Script API toolings within Discord.
date: 3/8/2025
---

# JaylyBot

JaylyBot is a Discord bot used in over 200 Discord servers which includes various Minecraft Script API toolings, such as a TypeScript debugger for Minecraft scripting, within Discord.

> The invite link to the bot is at the bottom of the post.

## NPM Package Metadata

The type definition files (_declaration files that contain only type information_) for Minecraft modules such as `@minecraft/server` are hosted on [npmjs.com](https://npmjs.com). This bot provides additional infomation on installing specific packages for Minecraft script development, and custom type definition files used in Script API Debugger for reference.

### /docs info

The `/docs info` command returns installation commands for all Minecraft's npm packages tied to specific Minecraft versions. It was made because the Minecraft developers cannot manage to categorise the versions into 4 labels or 'dist-tags' on npm.

![Docs info message](/assets/posts/jaylybot/docs-info-message.png)

**How does it work?**

The npm version infomation are generated through a generator specifically for Script API, which involve parsing version strings with funky regex.

### /docs dump

The `/docs dump` command posts generated custom type definition of a Minecraft module used for Script API debugger. Keep in mind that some of the types may have modified from the original npm package files.

![Docs dump](/assets/posts/jaylybot/docs-dump.png)

## ScriptAPI Examples

JaylyBot retrieves code exmaples from the [ScriptAPI](https://github.com/JaylyDev/ScriptAPI/) repository. Through the `/script get` command, users can search for a script listed in scripts directory in the GitHub repository (in the 'main' branch).

![Script get command](/assets/posts/jaylybot/script-cmd.png)

## Script API Debugger

This Discord bot can mainly debug your Minecraft scripts, for both Stable and Preview version of Minecraft. It is made possible through integrating TypeScript compiler into Discord.

![Script Debugger message type](/assets/posts/jaylybot/debugger-message.png)

Before debugging your scripts, make sure send your scripts with code blocks, with language type in `js` or `ts`:

````
```js
console.log("Hello World");
```
````

or with JavaScript / TypeScript files:

![Debug files](/assets/posts/jaylybot/debug-files.png)

### Using Debugger (PC)

![How to debug in PC](/assets/posts/jaylybot/how-to-debug-pc.png)

1. Right click the message
2. Go to Apps
3. Select **Debug Scripts**

Upon selecting the action, this dropdown appears for you to choose the Minecraft version your script is run in.

![Select debugger in PC](/assets/posts/jaylybot/select-debugger-pc.png)

- Latest APIs: Debug scripts using non-experimental APIs for Minecraft release builds.

- Latest Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft release builds.

- Preview APIs: Debug scripts using non-experimental APIs for Minecraft Preview builds.

- Preview Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft Preview builds.

### Using Debugger (Mobile)

![How to debug in mobile](/assets/posts/jaylybot/how-to-debug-mobile.png)

1. Long press the message
2. Go to Apps
3. Select **Debug Scripts**

Upon selecting the action, this dropdown appears for you to choose the Minecraft version your script is run in.

![Select debugger in mobile](/assets/posts/jaylybot/select-debugger-mobile.png)

- Latest APIs: Debug scripts using non-experimental APIs for Minecraft release builds.

- Latest Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft release builds.

- Preview APIs: Debug scripts using non-experimental APIs for Minecraft Preview builds.

- Preview Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft Preview builds.

### Important Notes for Script Debugger

- JaylyBot doesn't run JavaScript or TypeScript code remotely. The code is only parsed by TypeScript compiler.
- JavaScript or TypeScript code or files are only stored temporarily for debugging purposes and removed permanently after the bot responds with debug result.
- This is a debugger for Minecraft Script API only. Addons JSON is not supported.
- This is not to be confused with Mojang's [Minecraft Scripting Debugger extension](https://aka.ms/vscodescriptdebugger) for VSCode.

## Invite the Bot

This Discord bot is public for everyone to invite to their Discord server, check it out:

- [Invite JaylyBot](https://discord.com/api/oauth2/authorize?client_id=948686094986264716&permissions=277025516544&scope=bot)
