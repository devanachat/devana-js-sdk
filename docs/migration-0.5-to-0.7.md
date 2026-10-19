# Migrating from `polfan-server-js-client` 0.5.0 to `@devanachat/sdk` 0.7.0

The runtime API is the same as in 0.5.0, with two changes of behaviour for a room or a space you have not joined:
`rooms.messages.getRoomHistory(roomId)` returns a preview history instead of `undefined` (section 5), and
`permissions.check()` / `calculatePermissions()` ask the server instead of throwing. Code that tested
`getRoomHistory()` for `undefined` to tell a joined room apart must use `history.isPreview` or the joined rooms of the
state. Otherwise what changes is the package, the exports map, the types of a few signatures, and what is new. This note is written for the
`pserv-client` application, which moves from the old package in one step.

## 1. The package

```sh
npm uninstall polfan-server-js-client
npm install @devanachat/sdk@^0.7.0
```

Then rename the imports (`"polfan-server-js-client"` -> `"@devanachat/sdk"`); a find-and-replace over `src` does it,
all the names the application imports exist in the new package: `ChatTypes`, `WebSocketChatClient`, `WebApiChatClient`,
`FilesClient`, `File`, `AbstractRestClient`, `IndexedObjectCollection`, `ObservableIndexedObjectCollection`,
`extractUserFromMember`, `Permissions`, `Layer`, `UserStatus`, `UserFeature`, `SpaceFeature`, `SpaceIntent`,
`UiPurpose`, `HistoryRotation`, `NO_LIMIT`, `STORAGE_UNIT_BYTES`.

Quicker, and reversible: keep the imports and install the SDK under the old name,
`npm install polfan-server-js-client@npm:@devanachat/sdk@^0.7.0`. Do the rename later, when convenient.

Also rename the string `polfan-server-js-client` where it is not an import: the client lists it in the
`expo.doctor.reactNativeDirectoryCheck.exclude` array of `package.json` (an installed package missing from the React
Native Directory is excluded from the check by name), and bundler configs may name it too.

## 2. What the toolchain may notice

- **Exports map.** The package has `exports` (`.`, `./umd`, `./package.json`); deep imports such as
  `polfan-server-js-client/build/...` stop resolving. The application imports from the package root only.
  `main` stays a CommonJS bundle, `module` and `exports.import` point to a new ES module build (`build/index.mjs`).
  The client is built with Expo/Metro: if Metro's package-exports resolution is on, it picks `import`; if it is off, it
  uses `main`. Both work, but check a native build and the web build once.
- **The UMD global** is `Devana` instead of `PservClient` (only for `<script>` usage; the application does not use it).
- **Targets.** The output is for modern browsers and Node.js 22+ (about three times smaller). If any target needs older
  syntax, transpile `node_modules/@devanachat/sdk` in the bundler.
- **The `browser` field is gone** from `package.json` (the UMD build is `unpkg`/`jsdelivr` and `./umd`).

## 3. Typings that become stricter (the compiler will tell)

- `client.send()` resolves to `{data, error: null} | {data: null, error}`. After `if (result.error) {...}` TypeScript
  knows `data` is set, so `result.data!` and `result.data?.` after an error check can go. Code that read `result.data`
  *before* checking `error` now gets `data` typed as possibly `null`.
- Event handlers are `(ev: T) => void`, not `(ev?: T) => void`; handlers that declared `ev?:` keep working, handlers
  that guarded `ev` for `undefined` can drop the guard.
- `CommandResult`, `CommandRequest`, `CommandResponse`, `CommandsMap`, `EventsMap`, `EventHandler`,
  `ObservableInterface`, `WebSocketClientOptions`, `WebApiChatClientOptions`, `RestClientOptions` and
  `RestClientResponse` are exported from the package root: replace deep imports and local copies.
- The protocol types are a value/type split: enums-like constants (`UserStatus`, `RoleFlag`, `SpaceFeature`, ...) are
  exported as values, interfaces with `export type`. With `isolatedModules` or `verbatimModuleSyntax` import types
  with `import type`/`import {type X}` where the compiler asks.

## 4. What new in 0.7.0 replaces in the application

The local workarounds of `pserv-client` were written for a library without these. Each row is a deletion or a short
replacement.

| Application (`pserv-client`) | SDK 0.7.0 |
|---|---|
| `modules/search/types.ts`: `SearchMessagesRequest`, `FoundMessage`, `FoundMessages`, `SearchTextRange` | `ChatTypes.SearchMessages`, `ChatTypes.FoundMessage`, `ChatTypes.FoundMessages`, `ChatTypes.TextRange` (same shape, no `isMember`) |
| `SearchErrorCode` in `modules/search/types.ts` | `ErrorCode` enum (`InvalidSearchQuery`, `RoomNotFound`, `MessageSearchUnavailable`, `CommandRateLimitExceeded`; same string values) |
| `LOCAL_PERMISSIONS` and the catalog functions in `permissions/utils/permissionCatalog.ts` | `Permissions.list.PreviewRooms` / `SearchMessages`; `Permissions.getNames()`, `getByName()`, `canBeDefinedOnLayer()` include them |
| `useComputedPermissionMask` / `useComputedPermission` (`GetComputedPermissions` by hand) | `client.state.permissions.check([...], location)`: for a room or a space you have not joined it asks the server itself (no `change` event for such locations, so the query keys of the app may stay) |
| `PreviewableRoomSummary` in `previewRoom.ts` | `ChatTypes.RoomSummary.defaultTopicId` |
| `PreviewHistoryWindow`, `PreviewMessagesSource`, `PreviewWindowState`, `usePreviewHistoryWindow` | `rooms.messages.getRoomHistory(roomId)` -> `getMessagesWindow(topicId)`, see section 5 |
| `FoundMessage.isMember` (removed from the server) | your rooms in the state, as the application already does: `(await client.state.rooms.get()).has(roomId)` |

### The search itself

`query` is plain text; the server does not parse modifiers (`from:ania`, `has:file`, `12:30` are words). The client
keeps parsing the user's search syntax and sends the filters as fields:

```ts
const {data, error} = await client.send('SearchMessages', {
    query: 'żółw "ala ma"',
    spaceId,
    privateMessages: true,
    from: [userId], in: [roomId],
    after: ['2026-10-01'], timezone: 'Europe/Warsaw',
    hasFile: true,
    cursor, // From the previous page; null/undefined for the first one
});

if (error?.code === ErrorCode.MessageSearchUnavailable) { /* hide the search */ }
```

Results have no `isMember`: for a result in a room the user is not in, open a preview, otherwise the room.

## 5. Replacing the preview window

The preview is the regular history of the library in a preview mode, so the message list can use one code path for
joined and previewed rooms:

```ts
const history = await client.state!.rooms.messages.getRoomHistory(roomId); // Joined room or preview - the state decides
const topicWindow = await history?.getMessagesWindow(topicId); // summary.defaultTopicId, or a thread
```

- `getRoomHistory(roomId)` returns the regular history for a joined room and a preview history otherwise
  (`history.isPreview`, `topicWindow.isPreview`). The preview history is cached per room, like the regular one.
- The window is a `TopicHistoryWindow`: `state` (`WindowState` enum, the same numbers as `PreviewWindowState`),
  `resetToLatest`, `fetchPrevious`, `fetchNext`, `jumpTo`, `hasLatest`, `hasOldest`, `items`, `limit`, `retainRatio`,
  `isTraverseLocked`, `myReactions` and `createMirror()` - what the message list already reads of a window.
- `refresh()` -> `fetchNext()`: at the latest messages a preview window asks the server for the newer ones (a window
  not fetched yet loads the latest). The
  library does not throttle it; keep the 5 s interval of the app where it calls it (end of the list reached).
- `onChange(listener)` -> `on('change', handler)` / `off('change', handler)`, as for joined rooms.
- No release before -> `client.state.rooms.messages.forgetRoomPreview(roomId)` when the preview is closed. Joining the
  room drops the preview history by itself; `getRoomHistory()` then returns the regular one.
- In a preview `getMessagesWindow(topicId)` always gives a window; without access (no `PreviewRooms`, a room that is
  not available) its fetch methods throw an `Error`, as for joined rooms.
- `includeMyReactions` is off in a preview window (a preview cannot react).
- A preview window does not follow a reconnect; call `fetchNext()` or `resetToLatest(true)` after one.

## 6. Risks

1. **The server in production must be `feature/search`** for the new permissions, `defaultTopicId` and the preview reads.
   Against an older server the summary has no `defaultTopicId` and the reads of a room you have not joined fail.
   `SearchMessages` fails there too; hide the search on any error but a result, as with `MessageSearchUnavailable`.
2. **`FoundMessage.isMember`** is removed from the server (and was never in the SDK types). Code reading it must switch to
   the joined rooms of the state in the same step as the server deploy; the SDK does not give the field.
3. **Strict `data`/`error` typing** can surface existing unchecked reads at compile time; expect a few edits, not a
   behaviour change.
4. **Bundling** (Metro): the exports map and the ES build (section 2). Verify native and web builds.
