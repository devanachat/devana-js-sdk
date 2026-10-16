# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[semver](https://semver.org) (`0.x` minor releases may break the API).

## [0.7.0] - Unreleased

### Added

- `SearchMessages` command (answered with `FoundMessages` or an `Error`), typed end to end:
  `client.send('SearchMessages', {query, spaceId, privateMessages, from, in, before, after, during, hasFile, timezone, cursor})`.
  `query` is plain text (words and `"phrases"`, the last word is a prefix); the server recognises no modifiers, so
  the filters (`from`, `in`, `before`, `after`, `during`, `hasFile`) are fields of the command, and parsing a search
  syntax such as `from:ania` is up to the application.
  Results come newest first in pages of 25; pass the returned `cursor` to get the next page (`null` means the end).
  Each result carries the `message`, its `spaceId` and `ranges` of the matches (`{start, end}` in UTF-16 units,
  `end` exclusive, so `content.slice(start, end)` works). Whether the user is in the room of a result is not part of
  it - check your rooms: `(await client.state.rooms.get()).has(roomId)`.
- Type exports `SearchMessages`, `SearchDate`, `FoundMessages`, `FoundMessage` and `TextRange`.
- **Room preview** - the history of a room you have not joined (the `PreviewRooms` permission):
  `client.state.rooms.messages.getRoomHistory(roomId)` of a room you have not joined returns a `RoomMessagesHistory` with
  `isPreview` set (instead of `undefined`), whose
  `getMessagesWindow(topicId)` gives the usual `TopicHistoryWindow` (`resetToLatest`, `fetchPrevious`, `fetchNext`,
  `jumpTo`, mirrors, `change`). No events reach such windows; at the latest messages `fetchNext()` fetches the newer
  ones. It sends only reads - no `Ack`, no change of the unread counters, the room is not added to your rooms. Release it
  with `forgetRoomPreview(roomId)`; joining the room replaces it with the regular history. The default topic is
  `RoomSummary.defaultTopicId`.
- `PreviewRooms` (`1 << 24`) and `SearchMessages` (`1 << 25`) permissions in `Permissions.list`, definable on a space or
  a room.
- `RoomSummary.defaultTopicId`: the default topic of the room, given to everyone who may read it (`null` otherwise).
- `ErrorCode` enum with the codes worth telling apart (`InvalidSearchQueryException`,
  `MessageSearchUnavailableException`, `RoomNotFoundException`, `UserNotFoundException`, ...).

### Changed

- `permissions.check()` and `calculatePermissions()` work for a room or a space you have not joined: they ask the server
  (`GetComputedPermissions`) instead of throwing.
- Server `feature/search` semantics: `GetRoomMembers`, `GetMessages` (also `around`),
  `GetTopics` and `GetReactionDetails` accept a non-member with `PreviewRooms`; `GetPermissionOverwriteTargets`
  always returns the former members of a room (their overwrites still apply); `GetComputedPermissions`,
  `GetPermissionOverwrites` and `GetOwners` can be read in a room by a user with `ManagePermissions` who is not a
  member. Commands of participation (`CreateMessage`, `React`, `Ack`, ...) still need the membership
  (`UserNotFoundException`).

Migrating from `polfan-server-js-client` 0.5.0: see [docs/migration-0.5-to-0.7.md](docs/migration-0.5-to-0.7.md).

## [0.6.0] - Unreleased

The first release under the new name. Earlier versions were published as `polfan-server-js-client`.

### Changed

- **Renamed the package to `@devanachat/sdk`** and moved the repository to
  [devanachat/devana-js-sdk](https://github.com/devanachat/devana-js-sdk).
  To keep existing imports while migrating, install it under an alias:
  `npm install polfan-server-js-client@npm:@devanachat/sdk`.
- The UMD build exposes the global `Devana` (previously `PservClient`).
- The protocol types (formerly the `pserv-ts-types` git submodule) are now part of this repository, under
  `src/protocol`.
- Bundlers resolve the new ES module build instead of the UMD one. The output targets modern browsers and
  Node.js 22+, which makes the bundles about three times smaller.

- `send()` resolves to a discriminated union, `{data, error: null} | {data: null, error}`: after checking `error`,
  TypeScript knows that `data` is set.
- Event handlers receive a non-optional payload (`(ev: T) => void`), so destructuring it compiles in strict mode.

### Added

- ES module build (`build/index.mjs`).
- Type exports from the package root: `CommandResult`, `CommandRequest`, `CommandResponse`, `CommandsMap`,
  `EventsMap`, client option types, `EventHandler` and `ObservableInterface` - no more deep imports from `build/`.

### Fixed

- Bundlers no longer report missing re-exports for the protocol types.
- The npm package contains only the build output (it used to include sources and tests).
- `terser-webpack-plugin` is no longer installed as a runtime dependency.
