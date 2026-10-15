# Devana JavaScript SDK

[![npm](https://img.shields.io/npm/v/@devanachat/sdk)](https://www.npmjs.com/package/@devanachat/sdk)
[![CI](https://github.com/devanachat/devana-js-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/devanachat/devana-js-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The official TypeScript/JavaScript SDK for [Devana](https://devana.pl), a chat platform for communities and teams.
It is the same library the Devana apps are built on.

- **WebSocket client** with automatic reconnection, ping/pong and a typed command/event API
- **Web API client** for one-off commands over HTTP
- **State tracking** - spaces, rooms, members, messages and permissions kept up to date from server events
- **Files client** for uploads and file metadata
- **Protocol types** for every command and event, included in the package

Works in browsers and in Node.js 22+ (it uses the global `fetch` and `WebSocket`).

The commands and events themselves are described in the protocol documentation at
**[developers.devana.pl](https://developers.devana.pl)** - this README covers the SDK on top of them.

## Installation

```sh
npm install @devanachat/sdk
```

The package ships ES module, CommonJS and UMD builds with TypeScript declarations. In the browser without a bundler:

```html
<script src="https://cdn.jsdelivr.net/npm/@devanachat/sdk/build/index.umd.js"></script>
<script>
    const client = new Devana.WebSocketChatClient({/* ... */});
</script>
```

## Quick start: a bot

Create a bot in the Devana app (Settings → Bots) and copy its token. Then:

```ts
import {WebSocketChatClient} from '@devanachat/sdk';

const client = new WebSocketChatClient({
    url: 'wss://s1.devana.pl:1600/ws',
    token: process.env.DEVANA_TOKEN!,
});

client.on('NewMessage', async ({message}) => {
    if (message.content === '!ping') {
        await client.send('CreateMessage', {location: message.location, content: 'pong'});
    }
});

await client.connect();

const {data: session, error} = await client.send('GetSession', {});
console.log('Connected as', session?.user.nick, 'to server', session?.serverVersion);
```

Every command resolves to `{data, error}`: exactly one of them is set. A server error (missing permission, invalid
input) does not throw - check `error`, after which TypeScript knows `data` is there. The promise rejects only when the
command could not be delivered (e.g. the connection dropped). Command and event names, with their payloads, are typed:
your editor will complete them. See [developers.devana.pl](https://developers.devana.pl) for what each of them does.

### Web API client

For one-off commands that do not need a persistent connection, use `WebApiChatClient` with the same `send()` API:

```ts
import {WebApiChatClient} from '@devanachat/sdk';

const api = new WebApiChatClient({
    url: 'https://s1.devana.pl:1600/api',
    token: process.env.DEVANA_TOKEN!,
});

const {data} = await api.send('GetSession', {});
```

## Connection maintenance

`WebSocketChatClient` keeps the connection alive: after any loss (error, connecting timeout, missing pong, closure with
a code other than 1000) it reconnects indefinitely, with an exponential backoff between attempts. The `disconnect` event
tells whether a retry follows. A pending `connect()` promise resolves once an attempt authenticates, and is rejected by
`disconnect()`, which also stops reconnecting. An invalid token (`Bye` with `AuthenticationException`) rejects `connect()`
with the `Bye` data, emits an `error` event and stops reconnecting as well.

```ts
const client = new WebSocketChatClient({
    url: 'wss://s1.devana.pl:1600/ws',
    token: 'your-access-token',
    connectingTimeoutMs: 10000, // Per attempt (default)
    reconnect: {
        minDelayMs: 1000, // Delay before the first retry, doubled on every next one (default)
        maxDelayMs: 30000, // Maximum delay between retries (default)
    },
    ping: {
        noActivityTimeoutMs: 15000, // Send a ping after this much silence (default)
        pongBackTimeoutMs: 5000, // Consider the connection dead without a pong (default)
    },
});
```

## State tracking

The WebSocket client can maintain the current state of spaces, rooms, members and messages for you, by handling
incoming server events. Enable it with the `stateTracking` option and read it from `client.state`:

```ts
const client = new WebSocketChatClient({
    url: 'wss://s1.devana.pl:1600/ws',
    token: 'your-access-token',
    stateTracking: true,
});

await client.connect();

const spaces = await client.state!.spaces.get();
console.log(spaces.items.map(space => space.name));

spaces.on('change', ({setItems, deletedItems}) => {
    // React to spaces being added, updated or removed
});
```

State is exposed as `ObservableIndexedObjectCollection` objects, which emit `change` events.

**Important:** you can keep these objects for the lifetime of a connection, but fetch them again after reconnecting,
because some structures are rebuilt from scratch on the `Session` event.

## Package entitlements

`GetEntitlements` answers what a space or the current account has. A space package and a user
package describe disjoint features, so their keys live in separate enums and are never mixed:

```ts
import {NO_LIMIT, SpaceFeature, UserFeature, STORAGE_UNIT_BYTES} from '@devanachat/sdk';

const space = await client.send('GetEntitlements', {spaceId: 'space-id'});

if (space.error) {
    throw new Error(space.error.message);
}

const members = space.data.entitlements[SpaceFeature.MembersLimit];

if (members !== NO_LIMIT && memberCount >= members) {
    // the space package is full
}

const whitelist = space.data.entitlements[SpaceFeature.AccessWhitelist] === true;
```

A limit of `NO_LIMIT` (`-1`) means no limit, and a feature the package does not grant is
absent. A dictionary feature states its numbers as strings (`'250'`), and storage is counted in
megabytes - use `STORAGE_UNIT_BYTES` rather than a literal. The package tells *whether* a
feature exists; who may use it is still decided by role permissions.

The answer to the command also carries what the server knows about the usage, so a client can
tell that a file will not fit before it uploads it:

```ts
const me = await client.send('GetEntitlements', {}); // without spaceId: the current account
if (me.error) {
    throw new Error(me.error.message);
}

const used = me.data.extras?.storageUsedBytes ?? 0;
const limit = Number(me.data.entitlements[UserFeature.StorageLimit]) * STORAGE_UNIT_BYTES;
```

Whenever a package changes, the server pushes the same `Entitlements` event on its own - to every
member of the space, or to every session of the user (without `extras`, which is asked for with
the command when it is needed):

```ts
client.on('Entitlements', entitlements => {
    console.log(entitlements.subject, 'now has', entitlements.planCode);
});
```

Owners of a space also hear when one of its limits is running out (80%) or is used up (100%):

```ts
client.on('EntitlementUsage', usage => {
    console.log(usage.feature, `${usage.usage}/${usage.limit}`);
});
```

An operation the package does not allow is refused with a single `EntitlementException` error
whose message is the key that stopped it, e.g. `space.members.limit`.

## Files

```ts
import {FilesClient} from '@devanachat/sdk';

const files = new FilesClient({token: 'your-access-token'});
const {ok, data: file} = await files.uploadFile(blob);

if (ok) {
    await client.send('CreateMessage', {location, content: 'See attachment', attachments: [file.id]});
}
```

## Versioning

The SDK follows the Devana protocol and is versioned with [semver](https://semver.org). While the version is `0.x`,
a minor release may contain breaking changes - see [CHANGELOG.md](CHANGELOG.md).

## Contributing

Bug reports and pull requests are welcome - see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
