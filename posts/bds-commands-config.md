---
author: Jayly
title: Configure Command Permissions on a Minecraft Bedrock Server (BDS)
description: A practical guide to enabling, restricting, or completely disabling Minecraft Bedrock Dedicated Server (BDS) commands by editing the BDS config/commands.json file.
---

# Configure Command Permissions on Minecraft Bedrock Dedicated Server

Minecraft Bedrock Dedicated Server (BDS) lets you fine‑tune who can run which commands by editing a file named `commands.json` inside the server's `config/` folder. This guide shows how to (a) loosen access for trusted players, (b) lock sensitive commands to higher roles, or (c) effectively disable _all_ commands — even `/stop` — with one setting.

> [!IMPORTANT]
> This only applies to self‑hosted Bedrock Dedicated Servers. You cannot upload or use `config/commands.json` on Realms.

## File Location

Inside your BDS directory:

```
config/default/permissions.json
config/commands.json
bedrock_server.exe
server.properties
...other files
```

If `config/commands.json` does not exist yet, you can create it manually (UTF-8, plain text).

## Permission Levels

Each command can be assigned a minimum role required to execute it.

| Level      | Meaning / Scope                                                                        | Typical Use                                                     |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `any`      | Anyone (all connected players)                                                         | Allow benign utility commands (`list`, maybe `me`)              |
| `admin`    | Players listed in `permissions.json` with role `admin` OR higher                       | Standard moderation (`kick`, `tp`, `gamemode`)                  |
| `host`     | Single local host player (used in some LAN/editor contexts) plus `owner`               | Reserve for high-impact world state changes                     |
| `owner`    | Top server operator(s) only (role `owner` in `permissions.json`)                       | Critical operations (`stop`, `op`, structure or debug commands) |
| `internal` | No one. Command is effectively disabled (hidden / blocked for all senders and console) | Disables a command for the world session.                       |

> [!NOTE]
> Setting a command (or the global default) to `internal` blocks _everyone_, including owners, from using it via chat or console. Use with caution, or keep a backup to revert.

## Basic Structure

`commands.json` supports two top-level properties:

```json
{
  "default_permission_level": "admin",
  "permission_levels": {
    "gamemode": "any"
  }
}
```

Explanation:

- `default_permission_level`: Fallback applied to every command _not_ explicitly listed.
- `permission_levels`: Object mapping individual command names (no leading slash) to a specific minimum level.

Anything not overridden inherits the default.

## Recommended Starting Point

If you want a sane, moderately locked server:

```json
{
  "default_permission_level": "admin",
  "permission_levels": {
    "list": "any",
    "me": "any",
    "say": "admin",
    "tell": "any",
    "op": "owner",
    "deop": "owner",
    "stop": "owner"
  }
}
```

## Selectively Tightening High‑Risk Commands

You can progressively lock only the most dangerous ones while leaving utility commands open:

```json
{
  "default_permission_level": "any",
  "permission_levels": {
    "gamemode": "admin",
    "give": "admin",
    "tp": "admin",
    "op": "owner",
    "deop": "owner",
    "stop": "owner"
  }
}
```

## Disabling Specific Commands

Just mark a command as `internal`:

```json
{
  "default_permission_level": "admin",
  "permission_levels": {
    "kick": "internal",
    "whitelist": "owner"
  }
}
```

Here `kick` becomes unusable for everyone; `whitelist` stays restricted to owners.

## Disabling (Almost) All Commands

Set the default to `internal` and then whitelist only the few you still want to function:

```json
{
  "default_permission_level": "internal",
  "permission_levels": {
    "list": "any",
    "tell": "any"
  }
}
```

This permits only `/list` and `/tell`. Everything else (including `/stop`) is blocked.

## Completely Lock Everything (Including /stop)

If you want a "no commands at all" world (e.g., adventure map environment):

```json
{
  "default_permission_level": "internal"
}
```

> [!IMPORTANT]
> With this in place you cannot execute `/stop` from in‑game. You must terminate the server process from the host OS (e.g., closing the console window or killing the process) or restore a previous `commands.json`.

## Example Workflow

1. Stop the server (`/stop` or close the console if still available).
2. Open `config/commands.json` in Visual Studio Code.
3. Adjust default and per‑command levels.
4. Start the server and test with a player.
