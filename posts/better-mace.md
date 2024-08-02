---
author: Jayly
title: Better Mace - Minecraft Add-On
description: Make the mace more dramatic via cutscene and particle effects.
date: 8/3/2024
---

# Better Mace

<iframe width="914" height="514" src="https://www.youtube.com/embed/PX9TjVSm5ds" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This Minecraft add-on makes the mace smashing attack very dramatic, through the use of cutscene, achieved using the `/camera` command and a particle effect ported from Unity.

## How To Play

Download the add-on and apply the resource and behavior pack into the world. Trigger the better mace effect by performing a smash attack (which triggers when it is used after the player has fallen 1.5 blocks or more and hits an entity).

## Techincal Documentation

I highly recommend check out that video before looking at this section, otherwise it wouldn't make sense.

Some nerds out here may be a Minecraft Bedrock add-on developer and want to know how this was made from a technical perspective. Also I want to document the process of making that cutscene here since it's too technical to put into that video.

> To be honest you probably can just download the behavior pack and look at the JavaScript code in the scripts directory, why do I have to explain this?

### Cutscene

The cutscene fires when a player hits an entity via listening for `entityHitEntity` event, and requires the player to hold the mace.

From there, I trigger an explosion that's based on player's fall distance, which I have to manually code because Mojang removed that method so thank you for that.

Then I create a camera zoom out and zoom in effect using `EasingType.OutCubic` and `EasingType.InCubic`, some complicated easing timing that I can't explain, and some local coordinates stuff.

In case you (or me in the future) want a local coordinates to absolute coordinate function:

```ts
function getAbsoluteLocationFromViewAnchor(
  anchor: Vector3,
  location: Vector3,
  viewDirection: Vector3
) {
  const dirz = new Vector3Builder(viewDirection);
  const dirx = new Vector3Builder(dirz.z, 0, -dirz.x);
  const diry = Vector3Utils.cross(dirz, dirx);
  const xo = Vector3Utils.scale(dirx, anchor.x);
  const yo = Vector3Utils.scale(diry, anchor.y);
  const zo = Vector3Utils.scale(dirz, anchor.z);

  return new Vector3Builder(location).add(xo).add(yo).add(zo);
}
```

### Particle Effect

I got the spell effect texture from [Unity Asset Store](https://assetstore.unity.com/). Porting the particle effect to Bedrock Edition through Snowstorm. The rest of the settings are configured within Snowstorm. Shout out to JannisX11 for making that.

## Downloads

- [Download Better Mace Add-On](https://github.com/jayly-bot/addons/releases/download/mace/jayly_mace.mcaddon)
