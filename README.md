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