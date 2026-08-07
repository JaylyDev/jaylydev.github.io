## How to Use Minecraft Manifest Generator?

1. Select which type of manifest you want to generate.

   - Behavior pack
   - Resource pack
   - Add-On (both behavior and resource pack)
   - World template
   - Skin pack

2. Choose the manifest format version, either **V2** or **V3**.

   - V2 is the stable, widely-supported format.
   - V3 is currently in preview and includes support for pack settings (sliders, toggles, dropdowns) and uses "memory_performance_tier" for subpacks.

   > [!NOTE]
   > Manifest V1 is not supported in this generator.

3. Fill in the manifest details.

   For some version input fields, there is a toggle next to the input field that lets you toggle between a Semantic Versioning (SemVer) array (like `[1, 0, 0]`) and a SemVer string (like `"1.0.0"`).
   - In Manifest V2, you can use either SemVer array format or SemVer string format.
   - In Manifest V3, you can only use SemVer string format.

4. Configure modules and Script API dependencies.

   Add `"data"` or `"script"` modules for behavior packs. When you add a script module, the Script API dependency selector becomes available, letting you pick from all native Minecraft modules like `@minecraft/server`, `@minecraft/server-ui`, and more. Versions are updated in real-time.

5. Configure capabilities.

   Capabilities declare special features your pack requires. Add capability identifiers (e.g., `"chemistry"`, `"script_eval"`, `"raytraced"`, `"pbr"`) to the `capabilities` array in your manifest. See the [Capabilities](#capabilities) section for details on each option.

6. Copy or download your generated manifest JSON file.

## What is Minecraft Manifest Generator?

The Minecraft Manifest Generator generates `manifest.json` file for Minecraft Bedrock Add-Ons (behavior and resource pack), world templates or skin packs. This file tells the game essential information about the pack.

## Manifest.json Guide

### Script API Dependencies

When developing behavior packs that contain scripts, you must specify the Minecraft Script API modules your code depends on. Native engine modules like `@minecraft/server` and `@minecraft/server-ui` allow your JavaScript/TypeScript code to interact with the game engine. This generator fetches the latest native module versions from multiple official Minecraft sources, and you can choose your required module and version to declare it under `dependencies` in the manifest.

### Capabilities

Capabilities declare special features your pack requires or supports:

- **Chemistry:** Enables the chemistry features and blocks in the world.
- **Editor Extension:** Declares the pack as an editor extension module.
- **Script Eval:** Required for executing script modules using engine APIs.
- **Raytraced:** Enables raytracing functionality in resource packs for supported devices.
- **PBR:** Enables Vibrant Visuals feature set in resource packs for supported devices.

### Subpacks

Subpacks allow you to select between different add-on 'configurations' in the game settings, with the intention of loading different set of texture resolutions on different memory capacities.

- In **V2**, memory allocation is configured via the `memory_tier` property.
- In **V3**, memory allocation uses the `memory_performance_tier` property.

#### Subpack Folder Structure

The `folder_name` field in each subpack entry specifies the name of the folder to be used for this subpack.

For example, a subpack with `folder_name` set to `subpack_low` will be located in the following path:

```
ResourcePack
├── manifest.json
└── subpacks
      └── subpack_low
          └── textures
```

#### Memory Tier

This creates a requirement on the capacity of memory needed to select the resolution. Each tier increases memory requirement by 256 MB.

The table below shows the memory tier alignment for each platform Minecraft supports:

| Memory Performance Tier | Platform                                        | Memory Tier | Memory Range (GB) |
| :---------------------- | :---------------------------------------------- | :---------- | :---------------- |
| 1                       | Nintendo Switch                                 | &le;11      | 2-4               |
| 2                       | PS4, PS4 Pro, Xbox One, Xbox One S, ~60% Mobile | 12-16       | 4-5               |
| 3                       | Xbox One X, Xbox Series S                       | 18-20       | 6-8               |
| 4                       | Xbox Series X, PS5                              | 24-28       | 8-12              |
| 5                       | PS5 Pro, ~70% PC                                | &ge;32      | >12               |

#### Texture Memory Budgets & Performance Tiers

> [!IMPORTANT]
> This feature is still experimental and requires **manifest V3** to use.

To ensure consistent performance across various platforms, Minecraft Bedrock enforces texture memory budgets measured in texels (1 pixel = 4 bytes of uncompressed memory). Devices automatically select the highest compatible subpack version matching their hardware tier without exceeding the budget limit:

| Memory Performance Tier | Add-On Budget | Resource Pack Budget | World Budget |
| :---------------------- | :------------ | :------------------- | :----------- |
| **Tier 1** (Low-end)    | 150 MB        | 300 MB               | 750 MB       |
| **Tier 2**              | 225 MB        | 450 MB               | 1 GB         |
| **Tier 3**              | 300 MB        | 600 MB               | 1.5 GB       |
| **Tier 4**              | 600 MB        | 1.2 GB               | 3 GB         |
| **Tier 5** (High-end)   | 800 MB        | 1.6 GB               | 4 GB         |

Check out [Minecraft Texture Budgets Documentation & FAQ](https://learn.microsoft.com/en-us/minecraft/creator/documents/texturebudgets) for more information.

### Manifest V3 Settings

Manifest V3 introduces dynamic, configurable in-game settings. Creators can define settings of type:

- **Slider:** A range numeric setting with min, max, and step fields.
- **Toggle:** A simple boolean checkbox.
- **Dropdown:** A selection menu with multiple options.
- **Label:** Simple display text in the settings UI.

Below is a demo of the settings UI in-game:

![Settings UI Demo](https://learn.microsoft.com/en-us/minecraft/creator/documents/media/utilizingsubpacks/subpackgif.gif)

> _In-game settings UI showing slider, toggle, dropdown, and label controls._

#### Pack Settings Queries

> [!NOTE]
> `world.getPackSettings()` doesn't work. Use the Molang queries below to retrieve pack setting values in-game instead.

You can retrieve the value of pack settings in-game using Molang with the following queries:

- `query.get_pack_setting('ns:slider_name')` - Returns the value of a slider
- `query.is_pack_setting_enabled('ns:toggle_name')` - Check if toggle is enabled
- `query.is_pack_setting_selected('ns:dropdown_name', 'dropdown_option_name')` - Check if a dropdown option is selected

For more details, see the official [Minecraft Settings Documentation on Microsoft Learn](https://learn.microsoft.com/en-us/minecraft/creator/documents/buildingsubpacks).
