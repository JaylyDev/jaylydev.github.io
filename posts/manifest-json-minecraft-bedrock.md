---
title: Minecraft Manifest.json Generator and Format Guide
description: Complete manifest.json format reference for Minecraft Bedrock (V2/V3). Learn how to declare behavior, resource, skin packs, subpacks, and Script API dependencies.
author: Jayly
---

# Minecraft Manifest.json Generator and Format Guide

The `manifest.json` file is the entry point for every Minecraft Bedrock add-on. It tells the game what your pack is, what version it is, and what other packs it depends on. Without a valid manifest, Minecraft will not recognize or load your content.

This article covers the manifest format for behavior packs, resource packs, add-ons, world templates, and skin packs. It includes a reference for both V2 (stable) and V3 (preview) formats, with full code examples and a tool for generating valid manifests.

## What is `manifest.json`?

The manifest is a JSON file placed at the root of a pack's folder. Every pack must have exactly one manifest. When Minecraft loads a pack, it reads the manifest to:

- Identify the pack by name, UUID, and version
- Determine the pack type (behavior, resource, skin, or world template)
- Check compatibility with the current engine version
- Resolve dependencies on other packs or Script API modules
- Enable optional features (capabilities) declared by the pack

A folder with a correctly formatted manifest is considered a minimal valid pack. Additional content can be added after the manifest is in place.

## Generating `manifest.json`

The [Minecraft Bedrock Manifest Generator](https://jaylydev.github.io/manifest-generator/) produces valid `manifest.json` files for behavior packs, resource packs, add-ons, world templates, and skin packs.

### Features

- **V2 and V3 format support** — toggle between stable V2 and preview V3

  ![Manifest version selector](/assets/posts/manifest-json-minecraft-bedrock/manifest-selector.png)

- **Script API dependency picker** — select from native engine modules (`@minecraft/server`, `@minecraft/server-ui`, etc.) with version lookup from official sources

  ![Script API dependency picker](/assets/posts/manifest-json-minecraft-bedrock/script-dependency-picker.png)

- **UUID generation** — generate correct UUID v4 strings for pack and module identifiers
- **SemVer format toggle** — switch between array format `[1, 0, 0]` and string format `"1.0.0"` per field

  ![SemVer input fields for manifest v2](/assets/posts/manifest-json-minecraft-bedrock/semver-input-fields-v2.png)

  Input fields for manifest V3, with support for proxy objects, are also available.

  ![SemVer input fields for manifest v3](/assets/posts/manifest-json-minecraft-bedrock/semver-input-fields-v3.png)

- **Pack settings builder** — create slider, toggle, dropdown, and label settings for V3 manifests

  ![Pack settings builder](/assets/posts/manifest-json-minecraft-bedrock/pack-settings-builder.png)

  Leading to results like this:

  ![Pack settings in Minecraft](/assets/posts/manifest-json-minecraft-bedrock/pack-settings-minecraft.png)

- **Subpack configuration** — configure memory tiers for texture quality levels

### Usage

1. Select the pack type (behavior, resource, add-on, world template, or skin pack)
2. Choose the manifest version (V2 or V3)
3. Fill in the header fields and add modules
4. Configure dependencies, capabilities, and metadata
5. Copy or download the generated `manifest.json`

## Manifest Format Versions

Two format versions are currently available:

| Feature         | V2 (Stable)                           | V3 (Preview)                     |
| --------------- | ------------------------------------- | -------------------------------- |
| Status          | Stable, widely supported              | Preview                          |
| Version format  | Array `[1, 0, 0]` or string `"1.0.0"` | String `"1.0.0"` or proxy object |
| Pack settings   | Not supported                         | Slider, toggle, dropdown, label  |
| Subpack memory  | `memory_tier`                         | `memory_performance_tier`        |
| Texture budgets | Not supported                         | Tier-based budgets               |
| `pack_scope`    | Header-level only                     | Header-level only                |

V1 is deprecated and only applies to skin packs. This article covers V2 and V3.

## Core Properties

### `format_version`

Declares the manifest format version.

```json
{
  "format_version": 3
}
```

### `header`

Contains the pack's identity.

```json
{
  "header": {
    "name": "My Pack",
    "description": "A sample behavior pack",
    "uuid": "55b6a7c8-1d2e-4f3a-9b0c-6d7e8f9a0b1c",
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 0]
  }
}
```

| Property                    | Type            | Description                                                                                                     |
| --------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| `name`                      | String          | Display name shown in pack UI                                                                                   |
| `description`               | String          | Short description shown under the name                                                                          |
| `uuid`                      | String          | Unique identifier for the pack (36-char, base-16, case-insensitive)                                             |
| `version`                   | Array or String | Pack version. V2 accepts arrays `[a, b, c]` or strings `"a.b.c"`. V3 accepts strings `"a.b.c"` or proxy objects |
| `min_engine_version`        | Array or String | Minimum Minecraft engine version required                                                                       |
| `pack_scope`                | String          | For resource packs: `"world"`, `"global"`, or `"any"`. Default is `"any"`                                       |
| `allow_random_seed`         | Boolean         | Whether the world can use a custom seed                                                                         |
| `base_game_version`         | String          | Target base game version                                                                                        |
| `platform_locked`           | Boolean         | Restricts pack to specific platforms                                                                            |
| `lock_template_options`     | Boolean         | Locks template options in world settings                                                                        |
| `pack_optimization_version` | Object          | Pack optimization settings                                                                                      |

### `modules`

Declares the contents of the pack. Each module is an entry in the array.

**Behavior pack module:**

```json
{
  "modules": [
    {
      "type": "data",
      "uuid": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
      "version": [1, 0, 0]
    }
  ]
}
```

**Resource pack module:**

```json
{
  "modules": [
    {
      "type": "resources",
      "uuid": "b2c3d4e5-f6a7-8901-bc23-de45fa678901",
      "version": [1, 0, 0]
    }
  ]
}
```

**Script module (V2):**

```json
{
  "modules": [
    {
      "type": "script",
      "uuid": "c3d4e5f6-a7b8-9012-cd34-ef56ab789012",
      "version": [1, 0, 0],
      "language": "javascript"
    }
  ]
}
```

| Property      | Type                     | Description                                                                       |
| ------------- | ------------------------ | --------------------------------------------------------------------------------- |
| `type`        | String                   | `"data"` (behavior), `"resources"` (resource), `"script"` (JavaScript/TypeScript) |
| `uuid`        | String                   | Unique identifier for the module                                                  |
| `version`     | Array, String, or Object | Module version                                                                    |
| `description` | String                   | Module description                                                                |
| `language`    | String                   | For script modules: `"javascript"` or `"typescript"`                              |
| `entry`       | String                   | For script modules: path to the entry file (V3)                                   |

### `dependencies`

Declares packs or modules this pack depends on.

**Dependency by UUID:**

```json
{
  "dependencies": [
    {
      "uuid": "12345678-1234-1234-1234-123456789abc",
      "version": [1, 0, 0]
    }
  ]
}
```

**Dependency by module name (Script API):**

```json
{
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.13.0"
    }
  ]
}
```

Do not use both `uuid` and `module_name` in the same dependency entry. Pick one.

### `capabilities`

Declares special engine features the pack requires.

```json
{
  "capabilities": ["chemistry", "script_eval", "raytraced"]
}
```

| Capability        | Effect                                              |
| ----------------- | --------------------------------------------------- |
| `chemistry`       | Enables chemistry features and blocks               |
| `editorExtension` | Declares the pack as an editor extension module     |
| `script_eval`     | Enables `eval()` and `Function()` in script modules |
| `raytraced`       | Enables raytracing in resource packs                |
| `pbr`             | Enables Vibrant Visuals in resource packs           |

### `metadata`

Contains optional pack metadata.

```json
{
  "metadata": {
    "authors": ["Jayly"],
    "license": "MIT",
    "url": "https://jaylydev.github.io/manifest-generator",
    "product_type": "addon"
  }
}
```

| Property         | Type             | Description                                                |
| ---------------- | ---------------- | ---------------------------------------------------------- |
| `authors`        | Array of strings | Pack author names                                          |
| `license`        | String           | License identifier                                         |
| `url`            | String           | Pack homepage URL                                          |
| `product_type`   | String           | `"addon"` indicates the pack is intended for player worlds |
| `generated_with` | Object           | Tracks tools used to generate the manifest                 |

## Script API Dependencies

Behavior packs that use JavaScript or TypeScript must declare their Script API module dependencies. Native engine modules like `@minecraft/server` and `@minecraft/server-ui` provide access to game APIs.

**Required setup:**

1. Add a `script` module in `modules`
2. Add the corresponding `module_name` dependency

```json
{
  "modules": [
    {
      "type": "script",
      "uuid": "c3d4e5f6-a7b8-9012-cd34-ef56ab789012",
      "version": [1, 0, 0],
      "language": "javascript"
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.13.0"
    },
    {
      "module_name": "@minecraft/server-ui",
      "version": "2.0.0"
    }
  ]
}
```

Available native modules and their UUIDs:

| Module                       | UUID                                   |
| ---------------------------- | -------------------------------------- |
| `@minecraft/common`          | `77ec12b4-1b2b-4c98-8d34-d1cd63f849d5` |
| `@minecraft/debug-utilities` | `1796ea86-0daf-4409-99ee-fd6467cf1203` |
| `@minecraft/server`          | `b26a4d4c-afdf-4690-88f8-931846312678` |
| `@minecraft/server-ui`       | `2bd50a27-ab5f-4f40-a596-3641627c635e` |
| `@minecraft/server-gametest` | `6f4b6893-1bb6-42fd-b458-7fa3d0c89616` |
| `@minecraft/server-net`      | `777b1798-13a6-401c-9cba-0cf17e31a81b` |
| `@minecraft/server-admin`    | `53d7f2bf-bf9c-49c4-ad1f-7c803d947920` |
| `@minecraft/server-editor`   | `1d565354-296d-11ed-a261-0242ac120002` |

## Subpacks

Subpacks allow players to select between different pack configurations in world settings, such as HD vs SD texture sets. Each subpack maps to a memory tier.

**V2 subpacks:**

```json
{
  "subpacks": [
    {
      "folder_name": "textures_sd",
      "name": "SD Textures",
      "memory_tier": 1
    },
    {
      "folder_name": "textures_hd",
      "name": "HD Textures",
      "memory_tier": 3
    }
  ]
}
```

**V3 subpacks:**

```json
{
  "subpacks": [
    {
      "folder_name": "textures_sd",
      "name": "SD Textures",
      "memory_performance_tier": 1
    },
    {
      "folder_name": "textures_hd",
      "name": "HD Textures",
      "memory_performance_tier": 3
    }
  ]
}
```

| Property                                            | Type    | Description                         |
| --------------------------------------------------- | ------- | ----------------------------------- |
| `folder_name`                                       | String  | Name of the subpack's source folder |
| `name`                                              | String  | Display name in pack settings       |
| `memory_tier` (V2) / `memory_performance_tier` (V3) | Integer | Minimum memory tier required        |

### Memory Tier Alignment

Each tier increases memory requirements by 256 MB.

| Memory Performance Tier | Platform                            | Memory Range |
| ----------------------- | ----------------------------------- | ------------ |
| 1                       | Nintendo Switch                     | 2-4 GB       |
| 2                       | PS4, PS4 Pro, Xbox One, ~60% Mobile | 4-5 GB       |
| 3                       | Xbox One X, Xbox Series S           | 6-8 GB       |
| 4                       | Xbox Series X, PS5                  | 8-12 GB      |
| 5                       | PS5 Pro, ~70% PC                    | >12 GB       |

### Texture Memory Budgets (V3 Only)

Minecraft Bedrock enforces texture memory budgets measured in texels (1 pixel = 4 bytes). Devices automatically select the highest compatible subpack without exceeding the budget.

| Tier         | Add-On Budget | Resource Pack Budget | World Budget |
| ------------ | ------------- | -------------------- | ------------ |
| 1 (Low-end)  | 150 MB        | 300 MB               | 750 MB       |
| 2            | 225 MB        | 450 MB               | 1 GB         |
| 3            | 300 MB        | 600 MB               | 1.5 GB       |
| 4            | 600 MB        | 1.2 GB               | 3 GB         |
| 5 (High-end) | 800 MB        | 1.6 GB               | 4 GB         |

## Manifest V3 Pack Settings

V3 introduces dynamic in-game settings that players can configure. Supported types:

- **Slider** — numeric range with `min`, `max`, `step`
- **Toggle** — boolean checkbox
- **Dropdown** — selection menu with options
- **Label** — display text only

**Example pack settings:**

```json
{
  "format_version": 3,
  "header": {
    "name": "My Pack",
    "uuid": "55b6a7c8-1d2e-4f3a-9b0c-6d7e8f9a0b1c",
    "version": "1.0.0",
    "min_engine_version": "1.21.0"
  },
  "modules": [
    {
      "type": "data",
      "uuid": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
      "version": "1.0.0"
    }
  ],
  "settings": [
    {
      "name": "enable_feature",
      "type": "toggle",
      "default": false,
      "label": "Enable Feature"
    },
    {
      "name": "damage_amount",
      "type": "slider",
      "default": 5,
      "min": 1,
      "max": 100,
      "step": 1,
      "label": "Damage Amount"
    },
    {
      "name": "difficulty",
      "type": "dropdown",
      "options": {
        "easy": "Easy",
        "normal": "Normal",
        "hard": "Hard"
      },
      "default": "normal",
      "label": "Difficulty"
    },
    {
      "name": "info_label",
      "type": "label",
      "text": "Advanced settings below"
    }
  ]
}
```

### Querying Pack Settings In-Game

Use Molang queries to read pack setting values:

- `query.get_pack_setting('ns:slider_name')` — returns slider value
- `query.is_pack_setting_enabled('ns:toggle_name')` — checks toggle state
- `query.is_pack_setting_selected('ns:dropdown_name', 'dropdown_option_name')` — checks dropdown selection

## Complete Examples

### Minimal Behavior Pack (V2)

```json
{
  "format_version": 2,
  "header": {
    "name": "My Behavior Pack",
    "description": "A minimal behavior pack",
    "uuid": "55b6a7c8-1d2e-4f3a-9b0c-6d7e8f9a0b1c",
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 0]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
      "version": [1, 0, 0]
    }
  ],
  "metadata": {
    "authors": ["Jayly"]
  }
}
```

### Add-On with Script API (V2)

```json
{
  "format_version": 2,
  "header": {
    "name": "My Add-On",
    "description": "An add-on with Script API",
    "uuid": "55b6a7c8-1d2e-4f3a-9b0c-6d7e8f9a0b1c",
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 0]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
      "version": [1, 0, 0]
    },
    {
      "type": "script",
      "uuid": "c3d4e5f6-a7b8-9012-cd34-ef56ab789012",
      "version": [1, 0, 0],
      "language": "javascript"
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.13.0"
    }
  ],
  "capabilities": ["script_eval"],
  "metadata": {
    "authors": ["Jayly"],
    "product_type": "addon"
  }
}
```

### Add-On with V3 Pack Settings

```json
{
  "format_version": 3,
  "header": {
    "name": "My V3 Pack",
    "description": "A pack using manifest V3",
    "uuid": "55b6a7c8-1d2e-4f3a-9b0c-6d7e8f9a0b1c",
    "version": "1.0.0",
    "min_engine_version": "1.21.0"
  },
  "modules": [
    {
      "type": "data",
      "uuid": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
      "version": "1.0.0"
    }
  ],
  "subpacks": [
    {
      "folder_name": "subpack_sd",
      "name": "SD",
      "memory_performance_tier": 1
    },
    {
      "folder_name": "subpack_hd",
      "name": "HD",
      "memory_performance_tier": 3
    }
  ],
  "settings": [
    {
      "name": "feature_toggle",
      "type": "toggle",
      "default": true,
      "label": "Enable Feature"
    }
  ],
  "metadata": {
    "authors": ["Jayly"],
    "product_type": "addon"
  }
}
```
