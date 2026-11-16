# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[semver](https://semver.org) (`0.x` minor releases may break the API).

## [Unreleased]

### Added

- Editing messages: the `UpdateMessage` command (`{messageId, content?, embed?}` - a field left out stays, `embed: null`
  removes the embed and hides a link preview for good; resolves with `MessageUpdated` or `Ok` when nothing changed), the `MessageUpdated` event carrying the whole message,
  `Message.editedAt` (set only by an edit of the content) and the `EditMessages` permission (`1 << 29`, topic layer).
  History windows replace the loaded message, also where they keep it as a replied one; the topics tracked by
  `RoomsManager` replace it when it is their last or sticky message or the original message of a side topic.
- Replies: `CreateMessage.replyTo` and `Message.replyTo` (the id of the replied message). The replied messages come
  beside the replies: in `Messages.repliedMessages` when `GetMessages.includeRepliedMessages` is set, and in
  `NewMessage.repliedMessage`. History windows fetch them by default (`includeRepliedMessages`), keep them up to date
  and return them with `getRepliedMessage(message)` - `null` once the replied message is deleted, `undefined` in a
  window without `includeRepliedMessages` when the replied message is not loaded.
- Embeds: `Message.embed` (`MessageEmbed` - `type` `Link`, `Video`, `Gif` or `Rich`, a `root` list of components and
  `flags`, see `MessageEmbedFlag`). The server builds `Link`, `Video` and `Gif` from the first link of a message and
  attaches them with `MessageUpdated`; bots send `Rich` ones with `CreateMessage.embed` / `UpdateMessage.embed`
  (`SendableEmbed`). `UpdateMessage` with `embed: null` hides a generated embed.
- Embed interactions: the `Interact` command (`{messageId, actionId, value?}`, resolves with `Interacted`
  carrying the `interactionId`) uses a button or select of a message's embed; the author of the message (a bot) gets
  the `NewInteraction` event (`{interactionId, location, messageId, user, actionId, value}`). Nothing is stored. The id
  ties a later answer of the bot (such as a dialog) to the interaction and the client it came from.
- Answering interactions: a bot answers within 15 s with `CreateMessage.interactionId` or `UpdateMessage.interactionId`
  (the resulting `NewMessage` / `MessageUpdated` carries the `interactionId`), or with `AckInteraction`
  (`{interactionId, status?: 'Ok' | 'Fail', notice?}`). The user who interacted gets `InteractionResolved`
  (`{interactionId, status, notice}`) for an `AckInteraction`, for an edit that changed nothing and, with the `Timeout`
  status, when nothing came in time.
- Ephemeral bot messages: `CreateMessage.ephemeralFor` (a user id) shows the message only to that room member, as
  `NewMessage` of the `Ephemeral` type, and resolves with `Ok`; it is not stored, takes no attachments or poll, may
  reply to a message and mention its recipient (through `allowedMentions`, without a push). A recipient taking no
  private messages at all does not get it. `RoomsManager` no longer counts `Ephemeral` messages nor makes them the last one of a topic.
- GIF search: the `SearchGifs` command (`{query, position?, locale?}`) resolving with `FoundGifs` (`{gifs, next}`, each
  `FoundGif` with its post `url`, size, poster and MP4/WebM sources; pass `next` as `position` for the following page),
  and the `GetGifCategories` command (`{locale?}`) resolving with `GifCategories` (`{categories}`, each `GifCategory`
  with the search `term`, its English `name` and an `imageUrl`). Available when the server runs GIF search.
- Typing notifications: the `Type` command and the `Typing` event (`{location, userId}`), for rooms other than
  `ClassicText`. `RoomsManager.typing.get(roomId, topicId)` returns the ids of the users typing in a topic, tracked from
  the first call, each leaving `TYPING_TIMEOUT_MS` after their last notification or with their message.
  `RoomsManager.typing.notify(roomId, topicId)` sends `Type` at most once per `TYPING_INTERVAL_MS`.
- Sticky messages: `Topic.stickyMessage`, `CreateMessage.sticky`, `NewMessage.sticky`, `UpdateTopic.stickyMessageId`
  (a message id sticks it, `null` unsticks it) and the `ManagePins` permission. The topics tracked by `RoomsManager`
  take a new sticky message from `NewMessage` and drop it when it is redacted.
- Reactions of sticky messages: `RoomsManager.getStickyMyReactions(location, messageId)` returns the reactions of the
  connected user on sticky messages (`MessageUserReactions`, keyed by message id) - fetched once per message with `GetMessages` (`around`,
  `limit: 1`, `includeMyReactions`), as a sticky message comes with its topic, then kept up to date with `Reacted`.
  The topics tracked by `RoomsManager` follow the reaction counters of their sticky message with `ReactionUpdated`.
- Role icons: `Role.icon` (`RoleIcon` - an emoji or an emoticon of the space, `{type, value}` like a reaction) and
  `UpdateRole.icon` (an icon sets it, `null` removes it).
- Guests: `Space.guestRole` and `UpdateSpace.guestRole` (a role of the space given to temporary accounts when they
  join, `null` turns it off); `SpacesManager` clears it when the role is deleted. The `SendAttachments` permission
  covers attachments and links in messages.
- `CreateMessage.allowedMentions` (`MessageMentions`): limits the users and roles the message mentions - empty lists
  mention no one.
- `Error.subcode`: an optional refinement of `code`. `ErrorCode.SpaceJoinRestricted` (`JoinSpace` refused) comes with
  `Guests` (the space does not accept temporary accounts) or `Vpn` (it does not accept connections through a VPN or
  Tor).

### Changed

- **Breaking:** `Messages.myReactions` is a list of `MessageUserReactions` (`{messageId, reactions}`) instead of a map
  keyed by message id, so this version needs a server sending the list; `TopicHistoryWindow.myReactions` keeps the map.
- **Breaking:** the `RedactMessages` permission is `ManageMessages` (the same bit, `1 << 19`; the `RedactMessages`
  command keeps its name). Besides deleting messages it lets `UpdateMessage` with `embed: null` hide a preview
  generated by the server in any message.
- State snapshots: version 3 (with the replied messages of the saved histories); older snapshots are rejected.
- `React` with a reaction the user already has fails with `ReactionExistsAlreadyException`; `Unreact` of a reaction the
  user does not have resolves with `Ok`. Both used to get no answer.
- `PermissionsManager.calculatePermissions` follows the server: on every layer the space default role (everyone) is
  applied before the other roles, so a deny of another role overrides what everyone allows. An allow of any role still
  wins over a deny of another one.
- `LeaveRoom` with `ignore: true` is answered only with `RoomLeft`: like a plain `LeaveRoom`, it requires the membership
  of the room and fails for a closed conversation instead of answering `Ok`.
- Reconnecting spreads the clients dropped together: a retry waits a random time between 0 and the backoff delay
  (it used to be 50-100% of it). After a closure by the server (close code 1001, 1012 or 1013, or after a `Bye`) the backoff
  starts at `reconnect.serverCloseMinDelayMs` (5 s by default) instead of `reconnect.minDelayMs` (1 s). The backoff
  starts over once a connection has stayed authenticated for `reconnect.stableConnectionMs` (30 s by default),
  not as soon as it authenticates.
- `connectingTimeoutMs` (10 s) limits only the time until the socket opens. An open socket waits for `Session` up to
  the new `sessionTimeoutMs` (60 s by default), so a client the server holds in its queue during a reconnect storm is
  no longer dropped and sent back to the end of it.

### Fixed

- A `Bye` with the `Service` reason (the server shutting down) is followed by a reconnect even when the server closes
  the connection with code 1000; the client used to stop. `Bye` is emitted first, then `disconnect` with `true`; a
  `connect()` still waiting for `Session` stays pending for the retry. Other `Bye` reasons behave as before.
- `Bye.retryAfterMs`: when the server sends it, the next reconnect waits that long instead of the backoff delay, without
  further jitter; values that are not positive finite numbers are ignored and longer ones are capped at 60 s.
- A `Bye` with the `ServiceUnavailableException` error (the server too busy to take the connection) is followed by a
  reconnect, like a `Service` one, instead of being treated as a rejected token: no `error` event, a pending
  `connect()` stays pending for the retry. `AuthenticationException` still stops reconnecting.
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
