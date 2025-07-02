---
author: Jayly
title: Bedrock Statistics API
description: This page provides documentation for API endpoints provided by Jayly's Bedrock Statistics Add-On which allows user to query player data and make changes programmatically.
---

# Bedrock Statistics API

This page provides documentation for **API** endpoints provided by Jayly's Bedrock Statistics Add-On which allows user to query player data and make changes programmatically.

In the context of this API, the [Bedrock Statistics Add-On](/posts/statistics) is referred to as **Statistics Add-On**.

## Dependency

This API requires MCBE-IPC (Version [673a99ba74a30fc8745c74f9510e6f57cee86410](https://github.com/OmniacDev/MCBE-IPC/blob/673a99ba74a30fc8745c74f9510e6f57cee86410/src/ipc.ts)) to be installed in your scripts in your behavior pack.

You may also import the protocol definition files for Bedrock Statistics API protocols at https://gist.github.com/JaylyDev/4c40d63f31665084e582a9a91ff633eb

## Request and response

All API endpoints in this section are using `IPC.invoke(channel, ...args)` to send a request and receive a response.

If the request is successful, Statistics Add-On will returns a valid object. Otherwise, if the request fails, the Statistics Add-On throws a `StatsAPIError`.

| Channel ID                | Purpose                             |
| ------------------------- | ----------------------------------- |
| jaylystats:v1/register    | [Register](#register)               |
| jaylystats:v1/version     | [Version](#version)                 |
| jaylystats:v1/menu/show   | [Show Menu](#show-menu)             |
| jaylystats:v1/menu/button | [Add Menu Button](#add-menu-button) |

### Register

Registers extension to Bedrock Statistics Add-On.

**Params:**

- `id`: String

  Unique identifier. Required to make every API request.

**Response**

- `success`: Boolean
- `message`: String

**Backend Types**

```ts
export const RegisterRequest = PROTO.Object({
  id: PROTO.String,
  author: PROTO.String
});
export const RegisterResponse = PROTO.Object({
  success: PROTO.Boolean,
  message: PROTO.String,
});

IPC.handle("jaylystats:v1/register", RegisterRequest, RegisterResponse, ...);
```

### Version

Retrieve infomation about JaylyStats v1 API.

**Params:**

- `id`: String

  Unique identifier.

- `author`: string

  Author of the extension.

**Response**

- `api`: String

  Version for v1 API.

- `core`: String

  Version for the main Bedrock Statistics Add-On.

**Backend Types**

```ts
export const VersionRequest = PROTO.Object({ id: PROTO.String });
export const VersionResponse = PROTO.Object({
  api: PROTO.String,
  core: PROTO.String,
});

IPC.handle('jaylystats:v1/version', VersionRequest, VersionResponse, ...);
```

### Show Menu

Shows statistics menu.

**Params:**

- `id`: String

  Unique identifier.

- `player_id`: String

  Player identifier to show the menu to.

**Backend Types**

```ts
export const MenuShowRequest = PROTO.Object({ id: PROTO.String, player_id: PROTO.String });
export const MenuShowResponse = PROTO.Object({
  success: PROTO.Boolean,
  message: PROTO.Optional(PROTO.String),
});

IPC.handle('jaylystats:v1/menu/show', MenuShowRequest, MenuShowResponse, ...);
```

### Add Menu Button

Add a button to statistics menu.

**Params:**

- `id`: String

  Unique identifier.

- `button`: Object

  ```
  button: {
    name: Optional(String);
    translate: Optional(String);
    icon_path: Optional(String);
  }
  ```

  Infomation about a button. Requires either `name` field or `translate` field.

- `press_event`: String

  Channel ID the IPC sends the event data to when the button is pressed.

**Example:**

```js
IPC.invoke('jaylystats:v1/menu/button', MenuButtonRequest, {
    id: string;
    button: {
        name: string | undefined,
        translate: string | undefined,
        icon_path: string | undefined,
    },
    press_event: 'example_event_name',
}, MenuButtonResponse);

// IPC.send('example_event_name') is called from backend, so use IPC.on() to receive the event data.
IPC.on('example_event_name', MenuButtonPressEvent, (event) => {
  event.player_id
})
```

**Backend Types**

```ts
export const MenuButtonRequest = PROTO.Object({
  id: PROTO.String,
  button: PROTO.Object({
    name: PROTO.Optional(PROTO.String),
    translate: PROTO.Optional(PROTO.String),
    icon_path: PROTO.Optional(PROTO.String)
  }),
  press_event: PROTO.String
});
export const MenuButtonResponse = PROTO.Object({
  success: PROTO.Boolean,
});

IPC.handle('jaylystats:v1/menu/button', MenuButtonRequest, MenuButtonResponse, ...);
```

## Events

All API endpoints in this section are using `IPC.on(channel, ...args)` or `IPC.once(channel, ...args)` to handle an event.

| Channel ID          | Purpose         |
| ------------------- | --------------- |
| jaylystats:v1/ready | [Ready](#ready) |

### Ready

This event fires once extension is connected with the core add-on and is fully activated.

**Backend Types**

```ts
export const ExtensionReadyRule = PROTO.Undefined;

IPC.send("jaylystats:v1/ready", ExtensionReadyRule, undefined);
```

## Summary

This API provides a way to interact with the Bedrock Statistics Add-On programmatically, allowing developers to register their extensions, retrieve version information, show statistics menus, and add custom buttons to those menus. The API will be improved in the future to support more features and functionalities.

For more information about the Bedrock Statistics Add-On, please refer to the [main documentation](/posts/statistics) and [support Discord server](https://discord.gg/SuhGvZEXb4).
