---
author: Jayly
title: Bedrock Switches to GDK for Windows
description: Mojang is moving Minecraft Bedrock development to the Game Development Kit (GDK). Here's what you need to know.
image: /assets/posts/bedrock-gdk/21_u12-gdk-retail-release.png
---

# Bedrock Switches to GDK for Windows

> [!NOTE]
> This change is currently only for the Windows version of Minecraft Bedrock.

Starting from Minecraft Bedrock version 1.21.120, the game switches from UWP the old Universal Windows Platform (UWP) to the Game Development Kit (GDK) on Windows devices. As a result, players will need to reinstall the game from the Microsoft Store to continue playing newer versions.

Here's what you need to know about Minecraft's GDK update, and how to reinstall the game while preserving your worlds and settings.

## Back Up Your Data

Since the GDK Update changes the file location, players will need to back up their worlds and settings before reinstalling, as they are not carried over automatically. Here's how to do it:

1. Open File Explorer and navigate to `%LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang`.
2. Copy the entire `com.mojang` folder to a safe location, such as your Desktop or an external drive.

![Copy com.mojang folder](/assets/posts/bedrock-gdk/backup-com-mojang.png)

## Reinstall Minecraft Bedrock

After backing up your data, you can proceed to reinstall Minecraft Bedrock with GDK support. Here's how:

1. Uninstall the current version of Minecraft Bedrock from your device:

   - Open the Start menu and go to Settings > Apps > Installed Apps.
   - Find "Minecraft" in the list, click on it, and select "Uninstall".

![Uninstall Minecraft](/assets/posts/bedrock-gdk/uninstall-minecraft.png)

To reinstall Minecraft Bedrock with GDK support, follow these steps:

1. Open the Microsoft Store app on your Windows device.
2. Search for "Minecraft" and select "Minecraft for Windows". The download link is available at the following links, or you can use the Minecraft Launcher to install it.
   - [Microsoft Store](https://apps.microsoft.com/detail/9NBLGGH2JHXJ?hl=en-us&gl=US&ocid=pdpshare)
   - Open Minecraft in Xbox App: **msxbox://game/?productId=9NBLGGH2JHXJ**
   - Open Minecraft in Microsoft Store: **ms-windows-store://pdp/?productid=9NBLGGH2JHXJ**
3. Click the "Install" button to download and install the latest version of the game.

![Install Minecraft from Microsoft Store](/assets/posts/bedrock-gdk/install-minecraft.png)

### Reinstall via Minecraft Launcher

If you prefer using the Minecraft Launcher, follow these steps:

1. Open the Minecraft Launcher on your device.
2. Ensure you are logged in with your Microsoft account.
3. In the launcher, select the "Minecraft: Bedrock Edition" on the left sidebar.
4. Click on the "Uninstall" button if available, then click "Install" to download and install the latest version of Minecraft Bedrock with GDK support.

![Install Minecraft via Launcher](/assets/posts/bedrock-gdk/reinstall-via-launcher.png)

## Restore Your Data

After reinstalling Minecraft Bedrock, you will need to restore your worlds and settings from the backup you created earlier. Here's how:

1. Launch Minecraft Bedrock GDK Update to create the necessary folders.
2. Close the game and navigate to the new installation directory: `%AppData%\Minecraft Bedrock\Users\Shared\games\com.mojang`.
3. Copy the following folders in your backed-up `com.mojang` folder into this new directory, replacing any existing files. This is the new place where addons, resource packs, and behavior packs are stored.

   - `behavior_packs`
   - `resource_packs`
   - `development_behavior_packs`
   - `development_resource_packs`
   - `development_skin_packs`

![Copy add-ons to new com.mojang folder](/assets/posts/bedrock-gdk/copy-addons.png)

4. After that, navigate to the `%AppData%\Minecraft Bedrock\Users\<random numbers>\games\com.mojang` directory, and copy the rest of files from your backed-up `com.mojang` folder into this location. This is where your worlds and your settings are now stored.

![Copy player data to new com.mojang folder](/assets/posts/bedrock-gdk/copy-player-data.png)

## Enjoy the GDK Update!

Once you've restored your data, you can launch Minecraft Bedrock GDK Update and enjoy the latest features and performance improvements. Make sure to check for any updates regularly to keep your game up to date.

## Additional Information / References

> [!NOTE]
> For Minecraft Preview players, your addons, worlds and settings files are stored in `%APPDATA%\Minecraft Bedrock Preview\` instead of `%APPDATA%\Minecraft Bedrock\`.

- [GDK Migration on Windows (from Minecraft 1.21.120)](https://learn.microsoft.com/en-us/minecraft/creator/documents/gdkpcprojectfolder)
- [Minecraft - 1.21.120 (Bedrock) Changelog](https://feedback.minecraft.net/hc/en-us/articles/40566672351885-Minecraft-1-21-120-Bedrock#gdk-update-on-windows)
- [Minecraft Beta Preview - 1.21.120.21 Changelog](https://feedback.minecraft.net/hc/en-us/articles/39436905010189-Minecraft-Beta-Preview-1-21-120-21#h_01K4QGFPPN7B4JSXPRH6MMJQAE)
