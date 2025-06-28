---
author: Jayly
title: JaylyBot - Script Debugger Discord Bot
description: JaylyBot provides a collection of utilities and tools for Minecraft Script APIs on Discord.
---

# JaylyBot

JaylyBot provides a collection of utilities and tools for Minecraft Script APIs on Discord. It is a Discord bot used in over 350 servers to enhance your Minecraft Add-On development with Script API.

This bot uses [TypeScript compiler](https://www.typescriptlang.org/), [discord.js](https://discord.js.org/), [Minecraft Scripting Libraries](https://github.com/Mojang/minecraft-scripting-libraries/) and type definitions for Minecraft Bedrock Script APIs, available through npm at [npmjs.com](https://npmjs.com/).

## Invite the Bot

You can invite the bot to your Discord server using [this invite link](https://discord.com/api/oauth2/authorize?client_id=948686094986264716&permissions=277025516544&scope=bot).

## Running Script API Debugger

![Script Debugger message type](/assets/posts/jaylybot/debugger-message.png)

To debug your Minecraft scripts in Discord, you have to send a message in a text channel which includes samples of code with fenced code blocks with syntax highlighting.

In your fenced code blocks, you must also add a language identifier to clarify which language you are using.

For example, to syntax highlight JavaScript code:

````
```javascript
console.log("Hello World");
```
````

The bot currently supports the following language identifiers, any other will not work:

- `javascript` or `js`
- `typescript` or `ts`

> [!TIP]
> Use lower-case language identifiers, otherwise the bot's debugger may not work.

Another option is to upload a file, with file names end in `.js` or `.ts` to debug the file. This is useful when your code size is greater than the character limit for messages of 2000 characters.

You can also upload multiple script files in a single message, which the debugger creates a sandboxed environment with all the files in the directory to debug your scripts.

For example, to upload a JavaScript file named `message.js`:

![Debug files](/assets/posts/jaylybot/debug-files.png)

### Using Debugger on Desktop

Here's a step-by-step instruction on running the debugger on Discord through the desktop app or on browser.

1. Right click the message
2. Go to Apps
3. Select **Debug Scripts**

Example image on selecting **Debug Scripts** on desktop app:

![How to debug on Discord desktop](/assets/posts/jaylybot/how-to-debug-pc.png)

Upon selecting the action, this dropdown appears for you to choose the Minecraft version your script is run in.

![Select debugger in PC](/assets/posts/jaylybot/select-debugger-pc.png)

- Latest APIs: Debug scripts using stable APIs for Minecraft Bedrock Edition.

- Latest Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft Bedrock Edition.

- Preview APIs: Debug scripts using stable (release candidate) APIs for Minecraft Preview.

- Preview Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft Preview.

### Using Debugger on Mobile

Here's a step-by-step instruction on running the debugger on Discord through the mobile app.

1. Long press the message
2. Go to Apps
3. Select **Debug Scripts**

Example image on selecting **Debug Scripts** on mobile app:

![How to debug in mobile](/assets/posts/jaylybot/how-to-debug-mobile.png)

Upon selecting the action, this dropdown appears for you to choose the Minecraft version your script is run in.

![Select debugger in mobile](/assets/posts/jaylybot/select-debugger-mobile.png)

- Latest APIs: Debug scripts using stable APIs for Minecraft Bedrock Edition.

- Latest Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft Bedrock Edition.

- Preview APIs: Debug scripts using stable (release candidate) APIs for Minecraft Preview.

- Preview Beta APIs: Debug scripts that requires Beta APIs experimental enabled for Minecraft Preview.

## Additional Features

JaylyBot also provides additional tools and utilities for Minecraft Script API. These features are available as part of Discord's slash commands.

To access slash commands, all you have to do is type `/` in chat and you're ready to use JaylyBot!

![JaylyBot's slash commands list.](/assets/posts/jaylybot/jaylybot-slash-commands.png)

### Type Definitions for Minecraft Bedrock Script APIs

You can access Minecraft Bedrock Script APIs through JaylyBot using the following commands:

- `/docs info`

  This command prints instructions for installing type definition for each Minecraft script modules using [npm](https://npmjs.com). The infomation is updated as soon as Minecraft or Minecraft Preview updates.

  Example result of running `/docs info @minecraft/server` command:

  ![Docs info command result](/assets/posts/jaylybot/docs-info-v2.png)

- `/docs dump`

  This utility command is used to send type definition files used in [Script API debugger](#running-script-api-debugger).

  Example result of running `/docs dump latest @minecraft/server` command:

  ![Docs dump command result](/assets/posts/jaylybot/docs-dump.png)

### Script API Examples

JaylyBot can retrieve Minecraft script exmaples from the [ScriptAPI](https://github.com/JaylyDev/ScriptAPI/) repository. Through the `/script get` command, users can search for a script listed in scripts directory in the GitHub repository.

Example image of running the `/script get` command:

![Script get search](/assets/posts/jaylybot/script-get-search.png)

Once the bot found a script example you desire, it will output the following message:

![Script get command](/assets/posts/jaylybot/script-cmd.png)

### Utility Commands

- `/issue`

  A command to report any issues with the Discord bot.

  An image preview of issue modal form:

  ![Issue modal](/assets/posts/jaylybot/issue.png)

- `/runtime debug`

  Retrieves engine infomation of the bot for debugging purposes.

- `/uptime`

  Retrieves the period of time the bot has been continuously working and available. This command is for debugging purposes.
