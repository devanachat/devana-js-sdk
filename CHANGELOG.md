# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[semver](https://semver.org) (`0.x` minor releases may break the API).

## [Unreleased]

### Added

- Typing notifications: the `Type` command and the `Typing` event (`{location, userId}`), for rooms other than
  `ClassicText`. `RoomsManager.typing.get(roomId, topicId)` returns the ids of the users typing in a topic, tracked from
  the first call, each leaving `TYPING_TIMEOUT_MS` after their last notification or with their message.
  `RoomsManager.typing.notify(roomId, topicId)` sends `Type` at most once per `TYPING_INTERVAL_MS`.
- Sticky messages: `Topic.stickyMessage`, `CreateMessage.sticky`, `NewMessage.sticky`, `UpdateTopic.stickyMessageId`
  (a message id sticks it, `null` unsticks it) and the `ManagePins` permission. The topics tracked by `RoomsManager`
  take a new sticky message from `NewMessage` and drop it when it is redacted.
- Role icons: `Role.icon` (`RoleIcon` - an emoji or an emoticon of the space, `{type, value}` like a reaction) and
  `UpdateRole.icon` (an icon sets it, `null` removes it).
- Guests: `Space.guestRole` and `UpdateSpace.guestRole` (a role of the space given to temporary accounts when they
  join, `null` turns it off); `SpacesManager` clears it when the role is deleted. The `SendAttachments` permission
  covers attachments and links in messages.
- `Error.subcode`: an optional refinement of `code`. `ErrorCode.SpaceJoinRestricted` (`JoinSpace` refused) comes with
  `Guests` (the space does not accept temporary accounts) or `Vpn` (it does not accept connections through a VPN or
  Tor).

### Changed

- `LeaveRoom` with `ignore: true` is answered only with `RoomLeft`: like a plain `LeaveRoom`, it requires the membership
  of the room and fails for a closed conversation instead of answering `Ok`.

### Fixed

- After a reconnect, or the first session after a snapshot import, `RoomsManager.getMembers()` of an unchanged
  private conversation sent `GetRoomMembers` instead of using its participants.

## [0.10.0]

### Added

- Group private conversations: a `Pm` room has 1 (notes), 2 or 3-10 participants; `CreateRoom` takes up to 9
  `recipientIds` and, for a new conversation of 3 or more people, a `name`.
- `Room.participants` (`PmParticipant[]`, `null` for rooms of spaces): the users of a private conversation with their
  `flags`; `PmParticipantFlag.IgnoresRoom` marks a participant ignoring it. The members of a private conversation
  (`RoomsManager.getMembers()`) are its participants without the ones ignoring it, rebuilt on `RoomUpdated`, and the
  participants land in `UsersManager.getAvailable()`.
- `isGroupPm(room)` and `getPmPeers(room, meId)` helpers.
- Ignoring a group conversation: `LeaveRoom` takes `ignore: true` (answered with `RoomLeft`, or `Ok` when the
  user was not its member); `JoinRoom` of the ignoring participant stops ignoring it. `GetIgnoredRooms` returns the
  ignored conversations as `IgnoredRooms`. `CreateRoom` for an ignored conversation fails with
  `ErrorCode.RoomIgnored`, its id in `Error.details.roomId`.
- `UpdateRoom` changes the name of a group conversation (only `name` is accepted for a `Pm` room).
- Message type `RoomRename` (content: the new name, empty when the name was removed); `RoomJoin` and `RoomLeave` in a
  group conversation mean stopping and starting to ignore it.

### Changed

- **Breaking:** the members of a private conversation and its users in `UsersManager` come from `Room.participants`,
  so a server that does not send `participants` leaves private conversations without members.
- `STATE_SNAPSHOT_VERSION` is 2 - snapshots of the previous version (rooms without `participants`) are rejected on
  import.

### Deprecated

- `Room.recipients` - use `Room.participants`.

### Fixed

- `RoomMemberUpdated` of a member missing from the room's collection threw instead of being skipped.

## [0.9.0]

### Added

- `Permissions.list.UseExternalEmoticons` (`1 << 26`, space and room layer): using emoticons of other spaces.
- `UserFeature.ExternalEmoticons` (`user.external_emoticons`): the account may use emoticons outside their spaces.
- `MessageReaction.name` and `ToggledReaction.name`: the emoticon name of an `Emoticon` reaction.
- `GetEmoticons` takes `ids` (up to 100) and returns those of the emoticons the user may see - the ones of the spaces
  they belong to and of the spaces that let their emoticons be used outside (space flag `1 << 2`, `spaceId` and `user`
  null for a space the user does not belong to); the rest is left out. The response has `location: null` and does not
  change the collections returned by `EmoticonsManager.get()`.

### Changed

- **Breaking:** there are no global emoticons any more. `EmoticonsManager.get()` requires a `spaceId`,
  `CreateEmoticon.spaceId` and `EmoticonDeleted.spaceId` are required, and `EmoticonsSnapshot.spaceId` is a string -
  global emoticons kept in an older snapshot are dropped on import.
- **Breaking:** `Emoticon.tag` (emoticon categories) is gone. `Emoticon.spaceId` and `Emoticon.user` (the author) are
  `null` for an emoticon of a space the user does not belong to.
- **Breaking (protocol):** an `Emoticon` reaction (`React`, `Unreact`, `GetReactionDetails`, reactions of a message,
  poll options) is identified by the emoticon id in `value` instead of its name. Servers before this change send the
  name in `value` and no `name` - an application that has to work with both tells them apart by the length of `value`
  (a name has at most 20 characters, an id 22).

### Fixed

- Withdrawing the last own reaction from a message (`Reacted` with `isAdded: false`) left it in
  `TopicHistoryWindow.myReactions` in apps built with Babel's loose object rest transform (e.g. `babel-preset-expo` on
  web) - it dropped the message ID from the exclusion list (babel/babel#18196).

## [0.8.1]

### Added

- History gaps: `TopicHistoryWindow.gaps` lists the IDs of the messages with a gap in front of them - the message above
  in the window is not the real predecessor, an unknown number of messages in between was never fetched. A marker
  disappears with its message (deleted, trimmed, the window replaced by `resetToLatest()` or `jumpTo()`) and is closed
  once the messages before it are fetched (`fetchPrevious()` from it, or a later page reaching over it).
- `TopicHistoryWindow.resyncToLatest()` - the latest page merged on top of the loaded messages instead of replacing
  them (a message in both is taken from the page); a full page that does not reach the loaded messages marks a gap.

### Changed

- On a reconnect the `LATEST` windows of rooms with a time-limited history (`MaxAge`) keep the loaded messages and get
  the missed ones with `resyncToLatest()` - the server may no longer serve the older ones. Full history rooms are still
  reset to the latest page, ephemeral ones are left untouched.
- A snapshot of a window with a gap saves only the messages below the newest gap.

### Fixed

- `TopicHistoryWindow.jumpTo()` asked for while another fetch of the window runs (e.g. the reset of a reconnect, or an
  earlier jump) waits for it to end and then jumps, instead of returning at once without loading anything - a caller
  checking `has(id)` afterwards took the message for missing.

## [0.8.0]

### Added

- **State snapshot** - restore the tracked state at the start of an application, before the connection is
  established: `client.state.exportSnapshot()` gives a plain, JSON-serializable `StateSnapshot` (or `null` before the
  first session), `client.state.importSnapshot(snapshot)` restores it into a new client. The snapshot holds the current
  user, the joined spaces (with roles) and rooms (with the default topics, PM recipients), and the lists already
  loaded: rooms of spaces, followed topics (unread counters), emoticons and relationships. Presence is left out (every
  user is saved as `Offline`), as are members of spaces and rooms, message histories, permission overwrites and other
  topics.
  The import emits the usual change events of the collections and resolves the getters waiting for the session. The
  first `Session` then replaces the restored state like on a reconnect (removed spaces and rooms dropped, together with
  their followed topics and emoticons; the rest updated in place; the lazily loaded lists refetched on next access).
  A snapshot of another `version` (`STATE_SNAPSHOT_VERSION`, now `1`) or malformed data is rejected with `false`,
  without changing the state and without throwing; so is an import after the first `Session` or a second import.
- Message histories in the snapshot: `exportSnapshot(intent)` takes a `StateSnapshotIntent` -
  `histories: [{roomId, topicId?}]` (no `topicId` for the default topic of the room), `historyLimit` (messages per
  topic, never fewer than the window's `fetchLimit`, 50 by default) and `roomMembersLimit` (members of the rooms of the
  histories, saved when loaded and not more than that; 0 by default). Only a window holding the latest messages
  (`LATEST`) of a room that is not ephemeral is saved, with the reactions of the user and the topics the messages refer
  to. The import restores the window in the `LATEST` state, so it is shown without a request; the first `Session`
  fetches it anew (as on a reconnect) and fetches the restored topics other than the default ones.
- Type exports `StateSnapshot`, `StateSnapshotIntent`, `TopicHistorySnapshot`, `RoomMembersSnapshot`,
  `SpaceRoomsSnapshot`, `RoomFollowedTopicsSnapshot`, `EmoticonsSnapshot` and the `STATE_SNAPSHOT_VERSION` constant.
## [0.7.0]

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
  `isPreview` set, whose
  `getMessagesWindow(topicId)` gives the usual `TopicHistoryWindow` (`resetToLatest`, `fetchPrevious`, `fetchNext`,
  `jumpTo`, mirrors, `change`). No events reach such windows; at the latest messages `fetchNext()` fetches the newer
  ones (and loads the latest in a window not fetched yet). It sends only reads - no `Ack`, no change of the unread counters, the room is not added to your rooms. Release it
  with `forgetRoomPreview(roomId)`; joining the room replaces it with the regular history. The default topic is
  `RoomSummary.defaultTopicId`.
- `PreviewRooms` (`1 << 24`) and `SearchMessages` (`1 << 25`) permissions in `Permissions.list`, definable on a space or
  a room.
- `RoomSummary.defaultTopicId`: the default topic of the room, given to everyone who may read it (`null` otherwise).
- `ErrorCode` enum with the codes worth telling apart (`InvalidSearchQueryException`,
  `MessageSearchUnavailableException`, `RoomNotFoundException`, `UserNotFoundException`, ...).

### Changed

- `rooms.messages.getRoomHistory(roomId)` never resolves to `undefined`: for a room you have not joined (also one you
  have left, or an unknown id) it gives the preview history, whose fetch methods throw an `Error`
  without access. Tell a joined room by `history.isPreview` or by your rooms.
- `permissions.check()` and `calculatePermissions()` work for a room or a space you have not joined: they ask the server
  (`GetComputedPermissions`) instead of throwing.
- Server `feature/search` semantics: `GetRoomMembers`, `GetMessages` (also `around`),
  `GetTopics` and `GetReactionDetails` accept a non-member with `PreviewRooms`; `GetPermissionOverwriteTargets`
  always returns the former members of a room (their overwrites still apply); `GetComputedPermissions`,
  `GetPermissionOverwrites` and `GetOwners` can be read in a room by a user with `ManagePermissions` who is not a
  member. Commands of participation (`CreateMessage`, `React`, `Ack`, ...) still need the membership
  (`UserNotFoundException`).

Migrating from `polfan-server-js-client` 0.5.0: see [docs/migration-0.5-to-0.7.md](docs/migration-0.5-to-0.7.md).

## [0.6.0]

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
