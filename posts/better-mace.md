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

I highly recommend check out that video before looking at this section, otherwise it may not make sense.

Some nerds out here may be a Minecraft Bedrock add-on developer and want to know how this was made from a technical perspective. Also I want to document the process of making that cutscene here since it's too technical to put into that video.

### Project / Add-On Structure

The resource pack consist of particle infomation and the particle texture. Particle Information contains the particles name, basic render parameters and a set of components.

The behavior pack modifies the behavior of the Minecraft mace item. The codebase is in TypeScript, transformed into one JavaScript file. The file involves using external packages from [npmjs.com](https://npmjs.com/).

### Detecting The Mace's Smash Attack

In Minecraft, there isn't an event that fires whenever that happens directly. So I have to make my own listener.

The listener / event fires when a player hits an entity via listening for `entityHitEntity` event, and requires the player to hold the mace.

It also detects that player **was** falling before the smash attack is triggered, because when that happens fall distance resets to zero.

```js
var fallDistanceMap = /* @__PURE__ */ new Map();
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    if (player.isFalling) {
      const fallDist = fallDistanceMap.get(player) ?? 0;
      fallDistanceMap.set(player, fallDist + player.getVelocity().y);
    } else {
      system.run(() => fallDistanceMap.set(player, 0));
    }
  }
});
```

Here's the system that controls whether the player has fallen greater 1.5 blocks before using the mace. This system is not perfect, since I can't actually use this code in my other add-ons without breaking for some reason. I would not advise anyone using this code.

### Cutscene

Whenever the event above fires, I trigger an explosion that's based on player's fall distance, which I have to manually code because Mojang removed that method so thank you for that.

Then I create a camera zoom out and zoom in effect using `EasingType.OutCubic` and `EasingType.InCubic`, some complicated easing timing that I can't explain, and some local coordinates stuff.

In this add-on, the camera moves backward from player's rotation and location to create a zoom out effect. The demostration below is visualised using Mine-Imator app.

![Snowstorm Prototype](/assets/posts/better-mace/cutscene-demo.png)

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

I got the spell effect texture from [Unity Asset Store](https://assetstore.unity.com/). Porting the particle effect to Bedrock Edition through Snowstorm. The rest of the settings are configured within Snowstorm (https://snowstorm.app/). Shout out to JannisX11 for making that.

![Snowstorm Prototype](/assets/posts/better-mace/particle-snowstorm-prototype.png)

The image of Making of the particle effect in Snowstorm. Note that this is not the final version of the particle effect.

I then used Snowstorm to export the particle infomation and its assets into Minecraft.

![Minecraft particle](/assets/posts/better-mace/particle-mc-prototype.png)

> Both images are extracted from from 'Making The Minecraft Mace More Dramatic' YouTube video.

## Downloads

- [Download Better Mace Add-On](https://github.com/jayly-bot/addons/releases/download/mace/jayly_mace.mcaddon)
