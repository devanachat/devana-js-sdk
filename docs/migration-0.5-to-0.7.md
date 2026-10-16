# Migrating from `polfan-server-js-client` 0.5.0 to `@devanachat/sdk` 0.7.0

The runtime API did not change between 0.5.0 and 0.7.0: the state tracker, the history windows, the permissions and
the clients behave as before (`git diff` of `src/` shows no behavioural change outside the typings). What changes is
the package, the exports map, the types of a few signatures, and what is new. This note is written for the
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

Everything under "Local workarounds" in `pserv-client` was written for a library without these. Each row is a deletion
or a one-line replacement.

| Application (`pserv-client`) | SDK 0.7.0 |
|---|---|
| `modules/search/types.ts`: `SearchMessagesRequest`, `FoundMessage`, `FoundMessages`, `SearchTextRange` | `ChatTypes.SearchMessages`, `ChatTypes.FoundMessage`, `ChatTypes.FoundMessages`, `ChatTypes.TextRange` (identical shape; `isMember` is not in `FoundMessage`, see below) |
| `SearchErrorCode` in `modules/search/types.ts` | `ErrorCode` (`InvalidSearchQuery`, `RoomNotFound`, `MessageSearchUnavailable`, `CommandRateLimitExceeded`; the string values are the same) |
| `LOCAL_PERMISSIONS`, `LocalPermissionName`, `getPermissionNames()`, `getPermissionDefinition()` in `permissions/utils/permissionCatalog.ts` | `Permissions.list.PreviewRooms` / `SearchMessages` (`1 << 24`, `1 << 25`, `maxLayer: Layer.Room`); `Permissions.getNames()`, `getByName()`, `canBeDefinedOnLayer()` already include them. The catalog can become a thin re-export |
| `useComputedPermissionMask` + `(mask & getPermissionDefinition(name).value)` | `await client.state.permissions.getComputed(location)` and `Permissions.has(mask, name)`; or `checkComputed([...names], location)` / `canPreviewRoom(roomId, spaceId)` (all go to `GetComputedPermissions`, so they work without the membership) |
| `PreviewableRoomSummary` (`RoomSummary & {defaultTopicId?}`) in `previewRoom.ts` | `ChatTypes.RoomSummary` has `defaultTopicId?: string \| null` |
| `PreviewHistoryWindow`, `PreviewMessagesSource`, `PreviewWindowState`, `usePreviewHistoryWindow.ts`'s `createSource` | `client.state.previewRoom(roomId, {topicId, around})`, see section 5 |
| `FoundMessage.isMember` (server field, being removed) | the joined rooms of the state, as the application already does: `(await client.state.rooms.get()).has(roomId)` |
| The `GetRoomSummary` + `GetTopics` plumbing of `useRoomPreview` | done inside `previewRoom()`; `canPreviewRoom()` answers the permission part |

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

```ts
const joined = (await client.state!.rooms.get()).has(roomId); // The existing way

if (!joined && await client.state!.permissions.canPreviewRoom(roomId, spaceId)) {
    const preview = await client.state!.previewRoom(roomId, {topicId /* optional */, around: messageId /* optional */});
    // preview.summary is the room summary; preview.topicId the topic it reads
}
```

`PreviewHistoryWindow` (SDK) vs the application's:

| Application | SDK |
|---|---|
| `new PreviewHistoryWindow(source)`, `window.resetToLatest()` | `await previewRoom(...)` already fills it (latest, or around `around`) |
| `fetchPrevious()`, `fetchNext()`, `jumpTo(id)`, `hasLatest`, `hasOldest`, `has(id)`, `items`, `length`, `state`, `limit`, `retainRatio` | same names, same meaning (it is the `TopicHistoryWindow` machinery). `items` is the array property of the collection |
| `window.items` (a plain getter) | `window.items` |
| `refresh()` (5 s interval) | `refresh()`; the interval is `window.refreshInterval` (default 5000 ms) |
| `onChange(listener)` returning an unsubscribe function | `window.on('change', handler)` / `window.off('change', handler)`; the event carries `{setItems?, deletedItems?}` |
| `createMirror()` per change, as React state | `createMirror()` returns a new object over the same data, as before: `on('change', () => setMirror(window.createMirror()))` |
| `gaps`, `isTraverseLocked`, `myReactions`, `WindowState` | `isTraverseLocked` (false), `myReactions` (empty), `WindowState` (enum `LIVE=0, LATEST=1, PAST=2, OLDEST=3`, same numbers); `gaps` does not exist (nothing used it) |
| no release | `dispose()`: drops the messages and makes the window inert. Call it when the preview view closes, and when the user joins the room and the regular `rooms.messages.getRoomHistory()` takes over |

Differences to keep in mind:

- `PreviewWindowState` was a constants object; the SDK window uses the `WindowState` enum (exported through the window as
  `window.WindowState`). The numeric values match.
- The state after `fetchPrevious()`/`jumpTo()` is computed from `GetTopics` (`lastMessage`) of the previewed topic, as
  the application did with `fetchLastMessageId`; nothing is cached in the tracker for rooms the user is not in.
- Errors are thrown as `RoomPreviewError` (`code` = server error code, e.g. `UserNotFoundException` when `PreviewRooms`
  is missing or the room is not available, `NoTopic` when the server gives no default topic); `previewRoom()` rejects, the
  fetch methods of the window reject with the same class.
- A window does not follow a reconnect: after one, call `refresh()` (or `resetToLatest(true)`).

## 6. Risks

1. **The server in production must be `feature/search`** for the new permissions, `defaultTopicId` and the preview reads.
   Against an older server `previewRoom()` rejects (`defaultTopicId` is missing -> `NoTopic`; reads -> `UserNotFoundException`).
   `SearchMessages` fails there too; hide the search on any error but a result, as with `MessageSearchUnavailable`.
2. **`FoundMessage.isMember`** is removed from the server (and was never in the SDK types). Code reading it must switch to
   the joined rooms of the state in the same step as the server deploy; the SDK does not give the field.
3. **Strict `data`/`error` typing** can surface existing unchecked reads at compile time; expect a few edits, not a
   behaviour change.
4. **Bundling** (Metro): the exports map and the ES build (section 2). Verify native and web builds.
