---
author: Jayly
title: Bundle Minecraft Scripts with Webpack
description: Use webpack to combine your script files into one for Minecraft Script API.
date: 3/1/2024
---

# Bundle Minecraft Scripts with Webpack

Here, you will learn how to combine your JavaScript or TypeScript files into one script file for usage in Minecraft Scripting, along with Minecraft's Script API using Webpack, a JavaScript module bundler.

The main reason to use bundling in your Minecraft scripts so that it's easier to use external modules and libraries, mainly node modules from npm. This reduce issues related to managing dependencies.

## Prerequisites

Before you begin, make sure your behavior pack folder is structured. We're setting this project in the behavior pack folder for demostration.

You will also need to download and install the following:

- [Node.js](https://nodejs.org/en/): This allows the use of webpack to bundle script files.
- Visual Studio Code (or another similar text editor)
- Minecraft: Bedrock Edition
- A Windows 10 (or higher) computer

## JavaScript Project Setup

> [!IMPORTANT]  
> This project setup is only for bundling JavaScript files. For TypeScript project setup please visit below.

First, open your terminal and navigate to your behvaior pack directory and initialize a new npm project using `npm init -y` in your terminal. A new file named `package.json` should appear in your behavior pack directory. This stores metadata about the npm packages installed in this directory.

```
behavior_pack
│   manifest.json
│   package.json
│
└───scripts
```

Next, install webpack using npm: `npm install webpack --save-dev`.

After that, create a file named `webpack.config.js`. This setups configuration for bundling scripts into an environment for Minecraft scripting with webpack.

```
behavior_pack
│   manifest.json
│   package.json
│   webpack.config.js
│
└───scripts
```

Open the `webpack.config.js` file using Visual Studio Code (or another similar text editor), then add the following basic configuration to the file:

```js
const path = require("path");
const scriptEntry = "src/index.js"; // Entry point of your script

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.resolve(__dirname, scriptEntry),
  mode: "production",
  target: ["es2020"],
  optimization: {
    minimize: true,
  },
  output: {
    filename: "main.js", // Output filename for the bundled code
    path: path.resolve(__dirname, "scripts"),
  },
  experiments: {
    outputModule: true,
  },
  externalsType: "module",
  externals: {
    "@minecraft/server": "@minecraft/server",
    "@minecraft/server-ui": "@minecraft/server-ui",
    "@minecraft/server-admin": "@minecraft/server-admin",
    "@minecraft/server-gametest": "@minecraft/server-gametest",
    "@minecraft/server-net": "@minecraft/server-net",
    "@minecraft/server-common": "@minecraft/server-common",
    "@minecraft/debug-utilities": "@minecraft/debug-utilities",
  },
};
```

**Explanation:**

- `entry`: This specifies the entry point, the starting point for your application (usually `index.js` in the `src` directory).
- `mode`: This enables code optimizations for production when set to `"production"`.
- `target`: This defines the JavaScript language version for emitted JavaScript and include compatible library declarations. Version `es2020` works for Minecraft script engine.
- `output`: This defines the output configuration:
  - `filename`: Name of the bundled file (here, `main.js`).
  - `path`: Absolute path to the output directory where the bundle will be saved. Use `path.resolve` to ensure compatibility across different environments.
    After that, move your JavaScript source files from `scripts` to `src` folder. Make sure `scripts` folder is empty as webpack will generate a bundled JavaScript file there.
- `experiments.outputModule` and `externalsType`: This allows webpack to output javascript files as module source type for Minecraft to run.
- `externals`: Specify dependencies that is part of native Minecraft scripting modules and shouldn't be resolved by webpack.

If you're setting this project on your existing behavior pack, be sure to copy all the JavaScript source files from `scripts` folder to `src` folder, and rename entry file to `index.js`.

By now, this should be your behavior pack folder structure

```
behavior_pack
│   manifest.json
│   package.json
│   webpack.config.js
|
└───src
|       index.js
│
└───scripts
```

### Using external npm packages

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

Finally, save this file to `src/index.js`. In your terminal, run the following command to build your project:

```bash
npx webpack
```

This will execute webpack, process your script, and create the main.js file in the `scripts` directory.

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

## TypeScript Project Setup

> [!IMPORTANT]
> This project setup is only for bundling TypeScript files. For JavaScript project setup please visit above.

First, open your terminal and navigate to your behvaior pack directory and initialize a new npm project using `npm init -y` in your terminal. A new file named `package.json` should appear in your behavior pack directory. This stores metadata about the npm packages installed in this directory.

```
behavior_pack
│   manifest.json
│   tsconfig.json
│   package.json
│
├───scripts
└───src
        index.ts
```

Next, install required tools to bundle TypeScript files using npm:

```bash
npm install webpack ts-loader typescript --save-dev
```

After that, create a file named `webpack.config.js`. This setups configuration for bundling scripts into an environment for Minecraft scripting with webpack.

```
behavior_pack
│   manifest.json
│   tsconfig.json
│   package.json
│   webpack.config.js
│
├───scripts
└───src
        index.ts
```

Open the `webpack.config.js` file using Visual Studio Code (or another similar text editor), then add the following basic configuration to the file:

```js
const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"), // Entry point of your script
  mode: "production",
  target: ["es2020"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  output: {
    filename: "main.js", // Output filename for the bundled code
    path: path.resolve(__dirname, "scripts"),
  },
  experiments: {
    outputModule: true,
  },
  externalsType: "module",
  externals: {
    "@minecraft/server": "@minecraft/server",
    "@minecraft/server-ui": "@minecraft/server-ui",
    "@minecraft/server-admin": "@minecraft/server-admin",
    "@minecraft/server-gametest": "@minecraft/server-gametest",
    "@minecraft/server-net": "@minecraft/server-net",
    "@minecraft/server-common": "@minecraft/server-common",
    "@minecraft/debug-utilities": "@minecraft/debug-utilities",
  },
};
```

**Explanation:**

- `entry`: This specifies the entry point, the starting point for your application (usually `index.ts` in the `src` directory).
- `mode`: This enables code optimizations for production when set to `"production"`.
- `module`: This allows the use of `ts-loader`, which compiles TypeScript files into bundled JavaScript files.
- `target`: This defines the JavaScript language version for emitted JavaScript and include compatible library declarations. Version `es2020` works for Minecraft script engine.
- `output`: This defines the output configuration:
  - `filename`: Name of the bundled file (here, `main.js`).
  - `path`: Absolute path to the output directory where the bundle will be saved. Use `path.resolve` to ensure compatibility across different environments.
    After that, move your JavaScript source files from `scripts` to `src` folder. Make sure `scripts` folder is empty as webpack will generate a bundled JavaScript file there.
- `experiments.outputModule` and `externalsType`: This allows webpack to output javascript files as module source type for Minecraft to run.
- `externals`: Specify dependencies that is part of native Minecraft scripting modules and shouldn't be resolved by webpack.

If you haven't already, you also need to setup `tsconfig.json`:

tsconfig.json

```json
{
  "compilerOptions": {
    "module": "es2020",
    "target": "es2021",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./scripts"
  },
  "exclude": ["node_modules"],
  "include": ["src"]
}
```

### Using external npm packages

In this example, we have an example script that uses `@minecraft/vanilla-data` and `@minecraft/math` module, to demostrate how bundling works. The script runs every tick, iterates over all players in the Minecraft world, set the block type to Obsidian in each player's view direction.

Since webpack integrates TypeScript through `ts-loader`, installing type definitions for external npm modules are required:

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

src/index.ts

```ts
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

Finally, save this file to `src/index.ts`. In your terminal, run the following command to build your project:

```bash
npx webpack
```

This will execute webpack, process your script, and create the main.js file in the `scripts` directory.

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

And now, you can now use third party libraries from npm easier than ever!
