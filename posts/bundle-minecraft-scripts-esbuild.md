---
author: Jayly
title: Bundle Minecraft Scripts with ESBuild
description: Merge Minecraft script files through bundling with esbuild.
date: 3/30/2024
---

# Bundle Minecraft Scripts with ESBuild

In this article, you will learn how to bundle to merge your JavaScript or TypeScript code, and external libraries into your script behavior pack's code using esbuild - a JavaScript module bundler and minifier.

## Why esbuild?

You might have seen the tutorial of [bundling scripts with webpack](/posts/scripts-bundle-minecraft). While that method of bundling works, esbuild tend to provide a simple and efficient solution to bundle JavaScript files, _hence Mojang recommends using esbuild for simplicity._

## Prerequisites

Bundling scripts requires installing a few tools and structure a project beforehand. We're setting this project in the behavior pack folder for demostration.

You will need to download and install the following:

- [Node.js](https://nodejs.org/en/): esbuild depends on node.js to bundle files.
- Visual Studio Code (or another similar text editor)
- Minecraft: Bedrock Edition
- A Windows 10 (or higher) computer

## Project Setup

First, open your terminal and install esbuild by running the following command:

```bash
npm install --save-dev esbuild
```

Then, in your behavior pack, move all your currennt script files in your behavior pack from `scripts` folder to another folder (e.g. `src`) to avoid esbuild overwriting source files when bundling.

After that, you can either bundle scripts with the command line through running `esbuild` in terminal, or creating a configuration file.

For this tutorial, we are creating a configuration Node.js script file (e.g. `esbuild.js`) in the behavior pack directory:

```
behavior_pack
│   manifest.json
│   esbuild.js
│
├───scripts
└───src
        main.js
```

esbuild.js

```js
const esbuild = require("esbuild");

const external = [
  "@minecraft/server",
  "@minecraft/server-ui",
  "@minecraft/server-admin",
  "@minecraft/server-gametest",
  "@minecraft/server-net",
  "@minecraft/server-common",
  "@minecraft/server-editor",
  "@minecraft/debug-utilities",
];

esbuild
  .build({
    entryPoints: ["src/index.js"],
    outfile: "scripts/main.js",
    bundle: true,
    minify: true,
    format: "esm",
    external,
  })
  .then(() => {
    console.log("Bundling finished!");
  })
  .catch((error) => {
    console.error(error);
  });
```

Code explaination:

- `entryPoints`: List of entry points (your main JavaScript or TypeScript files in the `src` folder)
- `outfile`: Output file name (the same as the `entry` field in `manifest.json`)
- `bundle`: Enable bundling (default is false)
- `minify`: Optional: Minify output for smaller file size
- `format`: Output file format (it's `esm` for Minecraft)
- `external` array: List of native Minecraft modules. This list may change as more native modules will be added into Minecraft in the future.

## Using external npm packages

With this setup, external npm packages such as `@minecraft/math` and `@minecraft/vanilla-data` in your pack's code.

In this example, we have an example script that uses `@minecraft/vanilla-data` and `@minecraft/math` module, to demostrate how bundling works. The script runs every tick, iterates over all players in the Minecraft world, set the block type to Obsidian in each player's view direction.

For this script, the following dependencies needed to be installed:

```bash
npm i @minecraft/vanilla-data @minecraft/server @minecraft/math
```

> [!IMPORTANT]
> The `@minecraft/math` module requires to be dependent with stable version of `@minecraft/server`. The `overrides` key in `package.json` fixes this locally though by forcibly deduping the dependencies:
>
> package.json
>
> ```json
> {
>   "overrides": {
>     "@minecraft/server": "beta"
>   }
> }
> ```
>
> Please make sure to remove `"@minecraft/server"` key in dependencies field from `package.json`.

src/index.js

```js
import { BlockPermutation, system, world } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { Vector3Builder } from "@minecraft/math";

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const location = new Vector3Builder(player.location);
    const viewDirection = new Vector3Builder(player.getViewDirection())
      .scale(10)
      .add(new Vector3Builder(0, 1, 0));
    const block = player.dimension.getBlock(location.add(viewDirection));
    if (!block) continue;
    block.setPermutation(
      BlockPermutation.resolve(MinecraftBlockTypes.Obsidian)
    );
  }
});
```

## Bundling Process

If you have the configuration file setup, run the following command should bundle your script files:

```bash
node esbuild.js
```

> For further details and advanced options, please refer to the official esbuild documentation [here](https://esbuild.github.io/getting-started/).

This will execute esbuild, process your script, and create the main.js file in the `scripts` directory.

Before running the behavior pack to Minecraft, make sure to set `modules[0].entry` to `scripts/main.js`:

manifest.json

```jsonc
{
  "format_version": 2,
  "header": {
    "description": "My scripting behavior pack!",
    "name": "My Behavior Pack",
    "uuid": "4f75452a-793e-4427-9732-f932ff6afffd",
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 50]
  },
  "modules": [
    {
      "description": "Test Scripting",
      "type": "script",
      "uuid": "92bb9cc8-e286-457d-8988-a4c2f27664f1",
      "version": [1, 0, 0],
      "entry": "scripts/main.js" // loads bundled script file
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.7.0"
    }
  ]
}
```

If successful, when loading this behavior pack to a Minecraft world, obsidian blocks should appear about 10 blocks within your view direction for every player.

## Regolith

Regolith is an Minecraft Bedrock Addon Compiler. It is possible to use the `gametests` filter which uses esbuild to bundle scripts using the following configuration:

1. Install the regolith filter with `regolith install gametests`

2. Setup profile in `config.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/Bedrock-OSS/regolith-schemas/main/config/v1.2.json",
  "author": "Your name",
  "name": "Project name",
  "packs": {
    "behaviorPack": "./packs/BP",
    "resourcePack": "./packs/RP"
  },
  "regolith": {
    "dataPath": "./packs/data",
    "filterDefinitions": {},
    "profiles": {
      "default": {
        "export": {
          "readOnly": false,
          "target": "development"
        },
        "filters": [
          {
            "filter": "gametests",
            "settings": {
              "moduleUUID": null,
              "modules": [
                "@minecraft/server@1.2.0",
                "@minecraft/server-ui@1.0.0"
              ],
              "outfile": "BP/scripts/main.js",
              "manifest": "BP/manifest.json",
              "buildOptions": {
                "entryPoints": ["src/index.ts"],
                "target": "es2020",
                "format": "esm",
                "bundle": true,
                "minify": true
              }
            }
          }
        ]
      }
    }
  }
}
```
