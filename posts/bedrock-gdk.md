---
author: Jayly
title: Bedrock Switches to GDK for Windows
description: Mojang is moving Minecraft Bedrock development to the Game Development Kit (GDK). Here's what you need to know.
image: /assets/posts/bedrock-gdk/21_u12-gdk-retail-release.png
---

# Bedrock Switches to GDK for Windows

> [!NOTE]
> This change is currently only for the Windows version of Minecraft Bedrock.

> [!IMPORTANT]
> Please read this guide to learn back up your worlds and settings before updating the game, as the automatic updates may cause files to be moved to the wrong location, or **deleted permanently**.

> [!WARNING]
> If Minecraft is already updated automatically, please follow the "[Restore Your Data](#restore-your-data)" section below to move your worlds and settings back to the correct location **before launching the game**, or worlds or addons may not work properly.
>
> If the files aren't moved to the new location, follow the instructions below to backup your data from the old location.

Starting from Minecraft Bedrock version [1.21.120](https://feedback.minecraft.net/hc/en-us/articles/40566672351885-Minecraft-1-21-120-Bedrock#gdk-update-on-windows), the game switches from UWP the old Universal Windows Platform (UWP) to the Game Development Kit (GDK) on Windows devices. As a result, players will need to reinstall the game from the Microsoft Store to continue playing newer versions.

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
   - [Microsoft Store (Online)](https://apps.microsoft.com/detail/9NBLGGH2JHXJ?hl=en-us&gl=US&ocid=pdpshare)
   - Open Minecraft in Xbox App: <a href="msxbox://game/?productId=9NBLGGH2JHXJ">msxbox://game/?productId=9NBLGGH2JHXJ</a>
   - Open Minecraft in Microsoft Store: <a href="ms-windows-store://pdp/?productid=9NBLGGH2JHXJ">ms-windows-store://pdp/?productid=9NBLGGH2JHXJ</a>
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

### Game File Location Changes

For Minecraft Bedrock:

- Internal game files for Minecraft Bedrock are now stored in either `C:\XboxGames\Minecraft for Windows\Content` or `C:\XboxGames\7792D9CE-355A-493C-AFBD-768F4A77C3B0\Content`, instead of the old UWP location.

For Minecraft Bedrock Preview:

- Your addons, worlds and settings files are stored in `%APPDATA%\Minecraft Bedrock Preview\` instead of `%APPDATA%\Minecraft Bedrock\`.
- Internal game files for Minecraft Bedrock Preview are now stored in either `C:\XboxGames\Minecraft Preview for Windows\Content` or `C:\XboxGames\98BD2335-9B01-4E4C-BD05-CCC01614078B\Content`, instead of the old UWP location.
