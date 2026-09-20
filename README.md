# pserv-js-client-library
TypeScript client library to handle connection with Devana (new Polfan) chat service.

## How to use?

```js
(async () => {
    // Get access token by credentials
    const token = await PServ.AuthClient.createToken('login', 'password');
    
    // Create web api client (there is also WebSocket client available)
    const client = new PServ.WebApiChatClient({
        token: token.token, // Pass received token
        url: 'https://pserv-api-address',
    });
    
    // Call `GetSession` command which returns user session data
    const session = await client.send('GetSession');
    
    console.log("My nick:", session.user.nick);
    console.log("The rooms you are in:", session.rooms);
    console.log("The spaces you are in:", session.spaces);
    console.log("The version of server you connected to:", session.serverVersion);
})();
```

## Connection maintenance

`WebSocketChatClient` keeps the connection alive: after any loss (error, connecting timeout, missing pong, closure with
a code other than 1000) it reconnects indefinitely, with an exponential backoff between attempts. The `disconnect` event
tells whether a retry follows. A pending `connect()` promise resolves once an attempt authenticates, and is rejected by
`disconnect()`, which also stops reconnecting. An invalid token (`Bye` with `AuthenticationException`) rejects `connect()`
with the `Bye` data, emits an `error` event and stops reconnecting as well.

```js
const wsClient = new PServ.WebSocketChatClient({
    token: 'your-access-token',
    url: 'wss://pserv-websocket-address',
    connectingTimeoutMs: 10000, // Per attempt (default)
    reconnect: {
        minDelayMs: 1000, // Delay before the first retry, doubled on every next one (default)
        maxDelayMs: 30000, // Maximum delay between retries (default)
    },
});
```

## State management

The library provides built-in state management for WebSocket client. To enable it, just pass `stateTracking`
option to the `WebSocketChatClient` constructor:

```js
const wsClient = new PServ.WebSocketChatClient({
    token: 'your-access-token',
    url: 'wss://pserv-websocket-address',
    stateTracking: true, // Enable state tracking
});
```

With state tracking enabled, the client will automatically maintain the current state of rooms, users, and messages, 
by handling incoming events from the server. Reactive data structures are available via `ObservableIndexedObjectCollection`
objects, which allows you to subscribe to changes.

**Important note:** you can cache these objects for the connection lifetime, but you should refetch them after reconnecting,
because some structures are rebuild from scratch on `Session` event.
## Package entitlements

`GetEntitlements` answers what a space or the current account has. A space package and a user
package describe disjoint features, so their keys live in separate enums and are never mixed:

```js
const space = await client.send('GetEntitlements', {spaceId: 'space-id'});
const members = space.data.entitlements[PServ.SpaceFeature.MembersLimit];

if (members !== PServ.NO_LIMIT && memberCount >= members) {
    // the space package is full
}

const me = await client.send('GetEntitlements', {});
const animatedAvatar = me.data.entitlements[PServ.UserFeature.AnimatedAvatar] === true;
```

A limit of `PServ.NO_LIMIT` (`-1`) means no limit, and a feature the package does not grant is
absent. The package tells *whether* a feature exists; who may use it is still decided by role
permissions.

Whenever a package changes, the server pushes the same `Entitlements` event on its own - to every
member of the space, or to every session of the user:

```js
client.on('Entitlements', entitlements => {
    console.log(entitlements.subject, 'now has', entitlements.planCode);
});
```

## Access tickets

Services outside the chat server (billing for now) are called by the client directly, with a
short-lived signed ticket instead of any shared secret. Ask for it right before the request:

```js
// The space ticket requires the ManageSpace permission; without spaceId the ticket covers the account
const ticket = await client.send('CreateAccessTicket', {audience: 'billing', spaceId: 'space-id'});

const subscription = await fetch(`https://billing-address/spaces/space-id/subscription`, {
    headers: {Authorization: `Bearer ${ticket.data.token}`},
}).then(response => response.json());
```

The ticket carries the audience, the scope it covers (`space:<id>` or `user:<id>`) and its
`expiresAt`; the service rejects it outside that scope, for another audience or after it expires.
