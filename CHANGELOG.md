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
  it - ask `client.state.rooms.isJoined(roomId)`.
- Type exports `SearchMessages`, `SearchDate`, `FoundMessages`, `FoundMessage` and `TextRange`.
- **Room preview** - the history of a room the user has not joined (access level 2, the `PreviewRooms` permission).
  `client.state.previewRoom(roomId, {topicId?, around?, spaceId?})` resolves to a `PreviewHistoryWindow`: the same
  window as for joined rooms (`state`, `resetToLatest`, `fetchPrevious`, `fetchNext`, `jumpTo`, `limit`, mirrors,
  `change` events), but without live events - new messages come with `refresh()` - and with `dispose()` to release it.
  It sends only reads: no `Ack`, no unread counters change, the room is not added to the joined ones. Errors are
  `RoomPreviewError` (`code` is the server error code, or `NoTopic`).
- `client.state.rooms.isJoined(roomId)` - whether the user has joined the room.
- `PreviewRooms` (`1 << 24`) and `SearchMessages` (`1 << 25`) permissions in `Permissions.list`, definable on a
  space or a room. `Permissions.has(mask, name)` reads a permission mask; `client.state.permissions.getComputed()`,
  `checkComputed()` and `canPreviewRoom()` use the permissions computed by the server, which work for rooms and
  spaces the user has not joined (`check()` and `calculatePermissions()` still need the membership).
- `RoomSummary.defaultTopicId`: the default topic of the room, given to everyone who may read it (`null` otherwise) -
  the only way to address the history of a room one has not joined.
- `ErrorCode`: the codes of the errors the search and the access produce (`InvalidSearchQueryException`,
  `MessageSearchUnavailableException`, `RoomNotFoundException`, `UserNotFoundException`, `MessageNotFoundException`,
  `TopicNotFoundException`, `CommandRateLimitExceededException`, `AuthenticationException`).

### Changed

- Server `feature/search` semantics, documented in the types: `GetRoomMembers`, `GetMessages` (also `around`),
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
