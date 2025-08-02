/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "AuthClient": () => (/* reexport */ AuthClient),
  "FilesClient": () => (/* reexport */ FilesClient),
  "IndexedCollection": () => (/* reexport */ IndexedCollection),
  "IndexedObjectCollection": () => (/* reexport */ IndexedObjectCollection),
  "Layer": () => (/* reexport */ Layer),
  "ObservableIndexedCollection": () => (/* reexport */ ObservableIndexedCollection),
  "ObservableIndexedObjectCollection": () => (/* reexport */ ObservableIndexedObjectCollection),
  "PermissionDefinition": () => (/* reexport */ PermissionDefinition),
  "Permissions": () => (/* reexport */ Permissions),
  "WebApiChatClient": () => (/* reexport */ WebApiChatClient),
  "WebSocketChatClient": () => (/* reexport */ WebSocketChatClient),
  "extractUserFromMember": () => (/* reexport */ extractUserFromMember)
});

;// CONCATENATED MODULE: ./src/EventTarget.ts
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class EventTarget {
  constructor() {
    _defineProperty(this, "events", new Map());
    _defineProperty(this, "onceEvents", new Map());
  }
  on(eventName, handler) {
    this.addHandler(this.events, eventName, handler);
    return this;
  }
  once(eventName, handler) {
    this.addHandler(this.onceEvents, eventName, handler);
    return this;
  }
  off(eventName, handler) {
    const index = this.events.get(eventName)?.indexOf(handler);
    if (!index || index < 0) {
      return this;
    }
    this.events.get(eventName).splice(index, 1);
    return this;
  }
  emit(eventName, event) {
    this.callHandlers(this.events, eventName, event);
    this.callHandlers(this.onceEvents, eventName, event);
    this.onceEvents.delete(eventName);
    return this;
  }
  addHandler(map, eventName, handler) {
    const handlers = map.get(eventName) ?? [];
    handlers.push(handler);
    map.set(eventName, handlers);
  }
  callHandlers(map, eventName, event) {
    map.get(eventName)?.forEach(callback => callback(event));
  }
}
;// CONCATENATED MODULE: ./src/AbstractChatClient.ts
function AbstractChatClient_defineProperty(obj, key, value) { key = AbstractChatClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AbstractChatClient_toPropertyKey(arg) { var key = AbstractChatClient_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function AbstractChatClient_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

class AbstractChatClient extends EventTarget {
  constructor(...args) {
    super(...args);
    AbstractChatClient_defineProperty(this, "awaitingResponse", new Map());
    AbstractChatClient_defineProperty(this, "sentCounter", 0);
  }
  on(eventName, handler) {
    return super.on(eventName, handler);
  }
  once(eventName, handler) {
    return super.once(eventName, handler);
  }
  createEnvelope(type, data) {
    return {
      type,
      data,
      ref: (++this.sentCounter).toString()
    };
  }
  createPromiseFromCommandEnvelope(envelope) {
    return new Promise((...args) => this.awaitingResponse.set(envelope.ref, args));
  }
  handleIncomingEnvelope(envelope) {
    if (!this.awaitingResponse.has(envelope.ref)) {
      return;
    }
    const isError = envelope.type === 'Error';
    this.awaitingResponse.get(envelope.ref)[0]({
      data: isError ? null : envelope.data,
      error: isError ? envelope.data : null
    });
    this.awaitingResponse.delete(envelope.ref);
  }
  handleEnvelopeSendError(envelope, error) {
    if (!this.awaitingResponse.has(envelope.ref)) {
      return;
    }
    this.awaitingResponse.get(envelope.ref)[0](error);
    this.awaitingResponse.delete(envelope.ref);
  }
}

/**
 * Map of incoming events.
 */

/**
 * Map of commands and their corresponding events.
 */
;// CONCATENATED MODULE: ./src/IndexedObjectCollection.ts
function IndexedObjectCollection_defineProperty(obj, key, value) { key = IndexedObjectCollection_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function IndexedObjectCollection_toPropertyKey(arg) { var key = IndexedObjectCollection_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function IndexedObjectCollection_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

class IndexedCollection {
  constructor(items = []) {
    IndexedObjectCollection_defineProperty(this, "_items", new Map());
    IndexedObjectCollection_defineProperty(this, "_mutationCounter", 0);
    this.set(...items);
  }
  get mutationCounter() {
    return this._mutationCounter;
  }
  get items() {
    return this._items;
  }
  get length() {
    return this._items.size;
  }
  set(...items) {
    this._mutationCounter++;
    for (const item of items) {
      this._items.set(item[0], item[1]);
    }
  }
  get(id) {
    return this.items.get(id);
  }
  has(id) {
    return this.items.has(id);
  }
  delete(...ids) {
    for (const id of ids) {
      this.items.delete(id);
    }
  }
  deleteAll() {
    this.items.clear();
  }
  findBy(field, valueToFind, limit = null) {
    const result = new IndexedCollection();
    let item;
    while (!(item = this.items.entries().next().value).done) {
      if (limit && result.length === limit) {
        break;
      }
      if (item[1][field] === valueToFind) {
        result.set(item);
      }
    }
    return result;
  }
}
class IndexedObjectCollection {
  constructor(id, items = []) {
    this.id = id;
    IndexedObjectCollection_defineProperty(this, "_items", void 0);
    this._items = new IndexedCollection();
    this.set(...items);
  }
  get items() {
    return Array.from(this._items.items.values());
  }
  get length() {
    return this._items.length;
  }
  get mutationCounter() {
    return this._items.mutationCounter;
  }
  set(...items) {
    this._items.set(...items.map(item => [this.getId(item), item]));
  }
  get(id) {
    return this._items.get(id);
  }
  getAt(index) {
    return this.items[index];
  }
  has(id) {
    return this._items.has(id);
  }
  delete(...ids) {
    this._items.delete(...ids);
  }
  deleteAll() {
    this._items.deleteAll();
  }
  findBy(field, valueToFind, limit = null) {
    const result = new IndexedObjectCollection(this.id);
    for (const value of this.items) {
      if (limit && result.length === limit) {
        break;
      }
      if (value[field] === valueToFind) {
        result.set(value);
      }
    }
    return result;
  }
  getId(item) {
    return typeof this.id === 'function' ? this.id(item) : item[this.id];
  }
}
class ObservableIndexedCollection extends IndexedCollection {
  constructor(items = []) {
    super();
    IndexedObjectCollection_defineProperty(this, "eventTarget", void 0);
    this.eventTarget = new EventTarget();
    this.set(...items);
  }
  set(...items) {
    if (items.length) {
      super.set(...items);
      this.eventTarget.emit('change', {
        setItems: items.map(item => item[0])
      });
    }
  }
  delete(...ids) {
    if (ids.length) {
      super.delete(...ids);
      this.eventTarget.emit('change', {
        deletedItems: ids
      });
    }
  }
  deleteAll() {
    if (this.length) {
      const ids = this._items.keys();
      super.deleteAll();
      this.eventTarget.emit('change', {
        deletedItems: Array.from(ids)
      });
    }
  }
  on(eventName, handler) {
    this.eventTarget.on(eventName, handler);
    return this;
  }
  once(eventName, handler) {
    this.eventTarget.once(eventName, handler);
    return this;
  }
  off(eventName, handler) {
    this.eventTarget.off(eventName, handler);
    return this;
  }
}
class ObservableIndexedObjectCollection extends IndexedObjectCollection {
  constructor(id, items = []) {
    super(id);
    this.id = id;
    IndexedObjectCollection_defineProperty(this, "eventTarget", void 0);
    this.eventTarget = new EventTarget();
    this.set(...items);
  }
  set(...items) {
    if (items.length) {
      super.set(...items);
      this.eventTarget.emit('change', {
        setItems: items.map(item => this.getId(item))
      });
    }
  }
  delete(...ids) {
    if (ids.length) {
      super.delete(...ids);
      this.eventTarget.emit('change', {
        deletedItems: ids
      });
    }
  }
  deleteAll() {
    if (this.length) {
      const ids = this._items.items.keys();
      super.deleteAll();
      this.eventTarget.emit('change', {
        deletedItems: Array.from(ids)
      });
    }
  }
  on(eventName, handler) {
    this.eventTarget.on(eventName, handler);
    return this;
  }
  once(eventName, handler) {
    this.eventTarget.once(eventName, handler);
    return this;
  }
  off(eventName, handler) {
    this.eventTarget.off(eventName, handler);
    return this;
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/AsyncUtils.ts
function AsyncUtils_defineProperty(obj, key, value) { key = AsyncUtils_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AsyncUtils_toPropertyKey(arg) { var key = AsyncUtils_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function AsyncUtils_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

class DeferredTask {
  constructor() {
    AsyncUtils_defineProperty(this, "promise", void 0);
    AsyncUtils_defineProperty(this, "resolve", void 0);
    this.promise = new Promise(resolve => this.resolve = resolve);
  }
}
class PromiseRegistry {
  constructor() {
    AsyncUtils_defineProperty(this, "promises", new IndexedCollection());
  }
  register(promise, key) {
    this.promises.set([key, promise]);
  }
  registerByFunction(fn, key) {
    this.register(fn(), key);
  }
  get(key) {
    return this.promises.get(key);
  }
  has(key) {
    return this.promises.has(key);
  }
  notExist(key) {
    return !this.has(key);
  }
  forget(...keys) {
    this.promises.delete(...keys);
  }
  forgetAll() {
    this.promises.deleteAll();
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/TopicHistoryWindow.ts
function TopicHistoryWindow_defineProperty(obj, key, value) { key = TopicHistoryWindow_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function TopicHistoryWindow_toPropertyKey(arg) { var key = TopicHistoryWindow_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function TopicHistoryWindow_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

let WindowState = /*#__PURE__*/function (WindowState) {
  /**
   * The latest messages (those received live) are available in the history window, history has not been fetched.
   */
  WindowState[WindowState["LIVE"] = 0] = "LIVE";
  /**
   * The latest messages has been fetched and are available in the history window.
   */
  WindowState[WindowState["LATEST"] = 1] = "LATEST";
  /**
   * The historical messages have been fetched and are available in the history window.
   * Latest messages are not available and will not be available.
   */
  WindowState[WindowState["PAST"] = 2] = "PAST";
  /**
   * The oldest messages have been fetched and are available in the history window.
   * Next attempts to fetch previous messages will result with no-op.
   */
  WindowState[WindowState["OLDEST"] = 3] = "OLDEST";
  return WindowState;
}({});
class TraversableRemoteCollection extends ObservableIndexedObjectCollection {
  constructor(...args) {
    super(...args);
    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
    TopicHistoryWindow_defineProperty(this, "limit", 50);
    TopicHistoryWindow_defineProperty(this, "currentState", WindowState.LIVE);
    TopicHistoryWindow_defineProperty(this, "fetchingState", undefined);
    TopicHistoryWindow_defineProperty(this, "oldestId", null);
  }
  /**
   * Current mode od collection window. To change mode, call one of available fetch methods.
   */
  get state() {
    return this.currentState;
  }
  get hasLatest() {
    return [WindowState.LATEST, WindowState.LIVE].includes(this.state);
  }
  get hasOldest() {
    return this.state === WindowState.OLDEST || this.oldestId !== null && this.has(this.oldestId);
  }
  async resetToLatest() {
    if (this.fetchingState || this.currentState === WindowState.LATEST) {
      return;
    }
    this.fetchingState = WindowState.LATEST;
    let result;
    try {
      result = await this.fetchLatestItems();
    } finally {
      this.fetchingState = undefined;
    }
    this.deleteAll();
    this.addItems(result, 'tail');
    this.currentState = WindowState.LATEST;
  }
  async fetchPrevious() {
    if (this.fetchingState || this.hasOldest) {
      return;
    }
    this.fetchingState = WindowState.PAST;
    let result;
    try {
      result = await this.fetchItemsBefore();
    } finally {
      this.fetchingState = undefined;
    }
    if (!result) {
      return this.resetToLatest();
    }
    if (!result.length) {
      const firstItem = this.getAt(0);
      this.oldestId = firstItem ? this.getId(firstItem) : null;
      await this.refreshFetchedState();

      // LATEST state has priority over OLDEST
      if (this.currentState === WindowState.PAST) {
        this.currentState = WindowState.OLDEST;
      }
      return;
    }
    this.addItems(result, 'head');
    await this.refreshFetchedState();
  }
  async fetchNext() {
    if (this.fetchingState || this.hasLatest) {
      return;
    }
    this.fetchingState = WindowState.PAST;
    let result;
    try {
      result = await this.fetchItemsAfter();
    } finally {
      this.fetchingState = undefined;
    }
    if (!result) {
      await this.resetToLatest();
      return;
    }
    if (result.length) {
      this.addItems(result, 'tail');
      await this.refreshFetchedState();
      return;
    }
  }
  async refreshFetchedState() {
    this.currentState = (await this.isLatestItemLoaded()) ? WindowState.LATEST : WindowState.PAST;
  }
  addItems(newItems, to) {
    let result;
    if (to === 'head') {
      result = this.trimItemsArrayToLimit([...newItems, ...this.items], 'tail');
    }
    if (to === 'tail') {
      result = this.trimItemsArrayToLimit([...this.items, ...newItems], 'head');
    }
    this.deleteAll();
    this.set(...result);
  }

  /**
   * Return array with messages of count that matching limit.
   */
  trimItemsArrayToLimit(items, from) {
    if (this.limit === null) {
      return items;
    }
    if (from === 'head') {
      return items.slice(-this.limit);
    }
    if (from === 'tail') {
      return items.slice(0, this.limit);
    }
  }
}
class TopicHistoryWindow extends TraversableRemoteCollection {
  constructor(roomId, topicId, tracker) {
    super('id');
    this.roomId = roomId;
    this.topicId = topicId;
    this.tracker = tracker;
    /**
     * Reexported available window modes enum.
     */
    TopicHistoryWindow_defineProperty(this, "WindowState", WindowState);
    this.tracker.client.on('Session', ev => this.handleSession(ev));
    this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
  }

  /**
   * For internal use.
   * @internal
   */
  _updateMessageReference(refTopic) {
    const refMessage = this.get(refTopic.refMessage.id);
    if (refMessage) {
      // Update referenced topic ID in message
      this.set({
        ...refMessage,
        topicRef: refTopic.id
      });
    }
  }
  async handleNewMessage(ev) {
    if ([WindowState.LATEST, WindowState.LIVE].includes(this.state) && ev.message.location.roomId === this.roomId && ev.message.location.topicId === this.topicId) {
      this.addItems([ev.message], 'tail');
    }
  }
  handleSession(ev) {
    const rooms = ev.state.rooms;
    if (rooms.find(room => room.id === this.roomId)) {
      this.resetToLatest();
    } else {
      this.deleteAll();
    }
  }
  async fetchItemsAfter() {
    const afterId = this.getAt(this.length - 1)?.id;
    if (!afterId) {
      // If there is no message to refer, fetch latest
      return null;
    }
    const result = await this.tracker.client.send('GetMessages', {
      location: {
        roomId: this.roomId,
        topicId: this.topicId
      },
      after: afterId
    });
    if (result.error) {
      throw new Error(`Cannot fetch messages: ${result.error.message}`);
    }
    return result.data.messages;
  }
  async fetchItemsBefore() {
    const beforeId = this.getAt(0)?.id;
    if (!beforeId) {
      // If there is no message to refer, fetch latest
      return null;
    }
    const result = await this.tracker.client.send('GetMessages', {
      location: {
        roomId: this.roomId,
        topicId: this.topicId
      },
      before: beforeId
    });
    if (result.error) {
      throw new Error(`Cannot fetch messages: ${result.error.message}`);
    }
    return result.data.messages;
  }
  async fetchLatestItems() {
    const result = await this.tracker.client.send('GetMessages', {
      location: {
        roomId: this.roomId,
        topicId: this.topicId
      }
    });
    if (result.error) {
      throw new Error(`Cannot fetch messages: ${result.error.message}`);
    }
    return result.data.messages;
  }
  async getTopic() {
    return (await this.tracker.rooms.getTopics(this.roomId, [this.topicId])).get(this.topicId);
  }
  async getLatestMessageId() {
    return (await this.getTopic())?.lastMessage?.id;
  }
  async isLatestItemLoaded() {
    const lastMessageId = await this.getLatestMessageId();
    return lastMessageId ? this.has(lastMessageId) : true;
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/RoomMessagesHistory.ts
function RoomMessagesHistory_defineProperty(obj, key, value) { key = RoomMessagesHistory_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function RoomMessagesHistory_toPropertyKey(arg) { var key = RoomMessagesHistory_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function RoomMessagesHistory_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


class RoomMessagesHistory {
  constructor(room, tracker) {
    this.room = room;
    this.tracker = tracker;
    RoomMessagesHistory_defineProperty(this, "historyWindows", new IndexedCollection());
    this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
    this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
    this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
    if (this.room.defaultTopic) {
      this.createHistoryWindowForTopic(this.room.defaultTopic);
    }
  }

  /**
   * Returns a history window object for the given topic ID, allowing you to view message history.
   */
  async getMessagesWindow(topicId) {
    let historyWindow = this.historyWindows.get(topicId);
    if (!historyWindow) {
      const topic = (await this.tracker.rooms.getTopics(this.room.id, [topicId])).get(topicId);
      if (topic) {
        this.createHistoryWindowForTopic(topic);
      }
    }
    return this.historyWindows.get(topicId);
  }
  handleRoomUpdated(ev) {
    if (this.room.id === ev.room.id) {
      this.room = ev.room;
      if (ev.room.defaultTopic) {
        this.createHistoryWindowForTopic(ev.room.defaultTopic);
      }
    }
  }
  handleNewTopic(ev) {
    if (this.room.id === ev.roomId) {
      this.createHistoryWindowForTopic(ev.topic);
    }
  }
  handleTopicDeleted(ev) {
    if (this.room.id === ev.location.roomId) {
      this.historyWindows.delete(ev.location.topicId);
    }
  }
  createHistoryWindowForTopic(topic) {
    if (this.historyWindows.has(topic.id)) {
      return;
    }
    this.historyWindows.set([topic.id, new TopicHistoryWindow(this.room.id, topic.id, this.tracker)]);

    // If new topic refers to some message from this room, update other structures
    if (topic.refMessage) {
      const refHistoryWindow = this.historyWindows.get(topic.refMessage.location.topicId);
      refHistoryWindow?._updateMessageReference(topic);
    }
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/MessagesManager.ts
function MessagesManager_defineProperty(obj, key, value) { key = MessagesManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function MessagesManager_toPropertyKey(arg) { var key = MessagesManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function MessagesManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



class MessagesManager {
  constructor(tracker) {
    this.tracker = tracker;
    MessagesManager_defineProperty(this, "roomHistories", new IndexedCollection());
    MessagesManager_defineProperty(this, "followedTopics", new IndexedCollection());
    MessagesManager_defineProperty(this, "followedTopicsPromises", new PromiseRegistry());
    MessagesManager_defineProperty(this, "deferredSession", new DeferredTask());
    this.tracker.client.on('Session', ev => this.handleSession(ev));
    this.tracker.client.on('RoomJoined', ev => this.handleRoomJoin(ev));
    this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
    this.tracker.client.on('FollowedTopicUpdated', ev => this.handleFollowedTopicUpdated(ev));
    this.tracker.client.on('TopicFollowed', ev => this.handleTopicFollowed(ev));
    this.tracker.client.on('TopicUnfollowed', ev => this.handleTopicUnfollowed(ev));
    this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
    this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
    this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
    this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
  }

  /**
   * Get history manager for given room ID.
   */
  async getRoomHistory(roomId) {
    await this.deferredSession.promise;
    return this.roomHistories.get(roomId);
  }

  /**
   * Cache followed topics for all joined rooms in a space and fetch them in bulk if necessary.
   * Then you can get them using getRoomFollowedTopics().
   * @see getRoomFollowedTopics
   */
  async cacheSpaceFollowedTopics(spaceId) {
    if (spaceId && !(await this.tracker.spaces.get()).has(spaceId)) {
      throw new Error(`You are not in space ${spaceId}`);
    }
    const roomIds = (await this.tracker.rooms.get()).findBy('spaceId', spaceId).items.map(room => room.id);
    if (!roomIds.length) {
      // We don't need to ping server for followed topics for this space, if user has no joined rooms
      return;
    }
    const resultPromise = this.tracker.client.send('GetFollowedTopics', {
      location: {
        spaceId
      }
    });
    roomIds.forEach(roomId => this.followedTopicsPromises.register(resultPromise, roomId));
    const result = await resultPromise;
    if (result.error) {
      throw result.error;
    }
    this.setFollowedTopicsArray(roomIds, result.data.followedTopics);
  }

  /**
   * Get followed topics for the given room.
   * @return Undefined if you are not in the room, collection otherwise.
   */
  async getRoomFollowedTopics(roomId) {
    if (!(await this.tracker.rooms.get()).has(roomId)) {
      return undefined;
    }
    if (!this.followedTopics.has(roomId)) {
      if (this.followedTopicsPromises.notExist(roomId)) {
        this.followedTopicsPromises.registerByFunction(async () => {
          const result = await this.tracker.client.send('GetFollowedTopics', {
            location: {
              roomId
            }
          });
          if (result.error) {
            throw result.error;
          }
          this.setFollowedTopicsArray([roomId], result.data.followedTopics);
        }, roomId);
      }
      await this.followedTopicsPromises.get(roomId);
    }
    return this.followedTopics.get(roomId);
  }

  /**
   * Batch acknowledge all missed messages from any topics in given room.
   */
  async ackRoomFollowedTopics(roomId) {
    const collection = await this.getRoomFollowedTopics(roomId);
    if (!collection) {
      return;
    }
    for (const followedTopic of collection.items) {
      if (followedTopic.missed) {
        await this.tracker.client.send('Ack', {
          location: followedTopic.location
        });
      }
    }
  }

  /**
   * Calculate missed messages from any topic in given room.
   * @return Undefined if you are not in room.
   */
  async calculateRoomMissedMessages(roomId) {
    const collection = await this.getRoomFollowedTopics(roomId);
    if (collection) {
      return collection.items.reduce((previousValue, currentValue) => previousValue + (currentValue.missed ?? 0), 0);
    }
    return undefined;
  }

  /**
   * For internal use. If you want to delete the message, execute a proper command on client object.
   * @internal
   */
  _deleteByTopicIds(roomId, ...topicIds) {
    this.followedTopics.get(roomId)?.delete(...topicIds);
  }
  createHistoryForNewRoom(room) {
    this.roomHistories.set([room.id, new RoomMessagesHistory(room, this.tracker)]);
  }
  handleNewMessage(ev) {
    this.updateLocallyFollowedTopicOnNewMessage(ev);
  }
  handleFollowedTopicUpdated(ev) {
    this.followedTopics.get(ev.followedTopic.location.roomId)?.set(ev.followedTopic);
  }
  handleTopicFollowed(ev) {
    this.setFollowedTopicsArray([ev.followedTopic.location.roomId], [ev.followedTopic]);
  }
  handleTopicUnfollowed(ev) {
    this.followedTopics.get(ev.location.roomId)?.delete(ev.location.topicId);
  }
  handleRoomDeleted(ev) {
    this.roomHistories.delete(ev.id);
    this.clearRoomFollowedTopicsStructures(ev.id);
  }
  handleRoomJoin(ev) {
    this.createHistoryForNewRoom(ev.room);
    this.clearRoomFollowedTopicsStructures(ev.room.id);
  }
  handleRoomLeft(ev) {
    this.roomHistories.delete(ev.id);
    this.clearRoomFollowedTopicsStructures(ev.id);
  }
  async handleNewTopic(ev) {
    if (this.followedTopics.has(ev.roomId)) {
      // Check if the new topic is followed by user
      // only if client asked for followed topics list before for this room
      const result = await this.tracker.client.send('GetFollowedTopics', {
        location: {
          roomId: ev.roomId,
          topicId: ev.topic.id
        }
      });
      const followedTopic = result.data.followedTopics[0];
      if (followedTopic) {
        this.followedTopics.get(ev.roomId).set(followedTopic);
      }
    }
  }
  handleTopicDeleted(ev) {
    this.followedTopics.get(ev.location.roomId)?.delete(ev.location.topicId);
  }
  handleSession(ev) {
    this.followedTopics.deleteAll();
    this.followedTopicsPromises.forgetAll();
    this.roomHistories.deleteAll();
    ev.state.rooms.forEach(room => this.createHistoryForNewRoom(room));
    this.deferredSession.resolve();
  }
  updateLocallyFollowedTopicOnNewMessage(ev) {
    const roomFollowedTopics = this.followedTopics.get(ev.message.location.roomId);
    const followedTopic = roomFollowedTopics?.get(ev.message.location.topicId);
    const ephemeralMessageTypes = ['System'];
    if (!roomFollowedTopics || !followedTopic || ephemeralMessageTypes.includes(ev.message.type)) {
      // Skip if we don't follow this room or targeted topic or message is ephemeral
      return;
    }
    const isMe = ev.message.author.user.id === this.tracker.me?.id;
    let update;
    if (isMe) {
      // Reset missed messages count if new message is authored by me
      update = {
        missed: 0,
        lastAckMessageId: ev.message.id
      };
    } else {
      // ...add 1 otherwise
      update = {
        missed: followedTopic.missed === null ? null : followedTopic.missed + 1
      };
    }
    roomFollowedTopics.set({
      ...followedTopic,
      ...update
    });
  }
  setFollowedTopicsArray(roomIds, followedTopics) {
    const roomToTopics = {};

    // Reassign followed topics to limit collection change event emit
    followedTopics.forEach(followedTopic => {
      roomToTopics[followedTopic.location.roomId] ??= [];
      roomToTopics[followedTopic.location.roomId].push(followedTopic);
    });
    roomIds.forEach(roomId => {
      if (!this.followedTopics.has(roomId)) {
        this.followedTopics.set([roomId, new ObservableIndexedObjectCollection(followedTopic => followedTopic.location.topicId)]);
      }
      if (roomToTopics[roomId]) {
        this.followedTopics.get(roomId).set(...roomToTopics[roomId]);
      }
    });
  }
  clearRoomFollowedTopicsStructures(roomId) {
    this.followedTopics.delete(roomId);
    this.followedTopicsPromises.forget(roomId);
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/RoomsManager.ts
function RoomsManager_defineProperty(obj, key, value) { key = RoomsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function RoomsManager_toPropertyKey(arg) { var key = RoomsManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function RoomsManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



class RoomsManager {
  constructor(tracker) {
    this.tracker = tracker;
    RoomsManager_defineProperty(this, "messages", void 0);
    RoomsManager_defineProperty(this, "list", new ObservableIndexedObjectCollection('id'));
    RoomsManager_defineProperty(this, "topics", new IndexedCollection());
    RoomsManager_defineProperty(this, "members", new IndexedCollection());
    RoomsManager_defineProperty(this, "deferredSession", new DeferredTask());
    RoomsManager_defineProperty(this, "membersPromises", new PromiseRegistry());
    RoomsManager_defineProperty(this, "topicsPromises", new PromiseRegistry());
    this.messages = new MessagesManager(tracker);
    this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
    this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
    this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
    this.tracker.client.on('RoomJoined', ev => this.handleRoomJoined(ev));
    this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
    this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
    this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
    this.tracker.client.on('TopicUpdated', ev => this.handleTopicUpdated(ev));
    this.tracker.client.on('RoomMemberJoined', ev => this.handleRoomMemberJoined(ev));
    this.tracker.client.on('RoomMemberLeft', ev => this.handleRoomMemberLeft(ev));
    this.tracker.client.on('RoomMembers', ev => this.handleRoomMembers(ev));
    this.tracker.client.on('RoomMemberUpdated', ev => this.handleRoomMemberUpdated(ev));
    this.tracker.client.on('SpaceMemberLeft', ev => this.handleSpaceMemberLeft(ev));
    this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
    this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('UserUpdated', ev => this.handleUserUpdated(ev));
    this.tracker.client.on('Session', ev => this.handleSession(ev));
  }

  /**
   * Get collection of room members.
   */
  async getMembers(roomId) {
    if (this.membersPromises.notExist(roomId)) {
      this.membersPromises.registerByFunction(async () => {
        const result = await this.tracker.client.send('GetRoomMembers', {
          id: roomId
        });
        if (result.error) {
          throw result.error;
        }
        this.handleRoomMembers(result.data);
      }, roomId);
    }
    await this.membersPromises.get(roomId);
    return this.members.get(roomId);
  }

  /**
   * Get a room member representing the current user.
   */
  async getMe(roomId) {
    const userId = (await this.tracker.getMe()).id;
    if (!this.list.has(roomId)) {
      // User is not in passed room.
      return undefined;
    }
    const members = await this.getMembers(roomId);
    return members?.items.find(member => (member.user?.id ?? member.spaceMember.user.id) === userId);
  }

  /**
   * Get collection of all the rooms you are in.
   */
  async get() {
    await this.deferredSession.promise;
    return this.list;
  }

  /**
   * Get a collection of locally cached Topic objects for given room.
   * You can pass topic ids as second argument, to try to fetch them from the server.
   */
  async getTopics(roomId, tryToFetchTopicIds) {
    await this.deferredSession.promise;
    if (tryToFetchTopicIds?.length) {
      // Topic can be fetched if it isn't already cached and fetch is not already in progress
      const canFetch = topicId => !this.topics.get(roomId)?.has(topicId) && !this.topicsPromises.has(roomId + topicId);
      const idsToFetch = tryToFetchTopicIds.filter(canFetch);
      if (idsToFetch.length) {
        const promise = this.tracker.client.send('GetTopics', {
          roomId,
          topicIds: idsToFetch
        }).then(result => this.topics.get(result.data.location.roomId)?.set(...result.data.topics));
        idsToFetch.forEach(topicId => this.topicsPromises.register(promise, roomId + topicId));
      }
      for (const topicId of tryToFetchTopicIds) {
        await this.topicsPromises.get(roomId + topicId);
      }
    }
    return this.topics.get(roomId);
  }
  deleteRoom(...roomIds) {
    this.list.delete(...roomIds);
    this.members.delete(...roomIds);
    this.membersPromises.forget(...roomIds);
    for (const roomId of roomIds) {
      const topicIds = this.topics.get(roomId)?.items.map(topic => topic.id) ?? [];
      this.messages._deleteByTopicIds(roomId, ...topicIds);
    }
    this.topics.delete(...roomIds);
  }
  deleteRoomsBySpaceId(spaceId) {
    this.deleteRoom(...this.list.findBy('spaceId', spaceId).items.map(room => room.id));
  }
  handleSpaceMemberUpdated(ev) {
    // Update members of rooms related to this space
    for (const room of this.list.findBy('spaceId', ev.spaceId).items) {
      const roomMembers = this.members.get(room.id);
      if (!roomMembers || !roomMembers.has(ev.userId)) {
        // Skip update if member list for this room is not loaded
        // or user is not in room
        continue;
      }
      const roomMember = roomMembers.get(ev.userId);
      const user = roomMember.spaceMember.user;

      // Update space member but first fill user object (it's null in event object)
      roomMember.spaceMember = {
        ...ev.member,
        user
      };
      roomMembers.set(roomMember);
    }
  }
  handleSpaceMemberLeft(ev) {
    this.list.findBy('spaceId', ev.spaceId).items.forEach(room => this.members.get(room.id)?.delete(ev.userId));
  }
  handleRoomMemberUpdated(ev) {
    if (!this.members.has(ev.roomId)) {
      // We do not track member list for this room.
      return;
    }
    const members = this.members.get(ev.roomId);
    const member = members.get(ev.userId);
    const newMember = ev.member;
    const user = member.spaceMember?.user ?? member.user;
    if (newMember.spaceMember) {
      newMember.spaceMember.user = user;
    } else {
      newMember.user = user;
    }
    members.set(newMember);
  }
  handleSpaceDeleted(ev) {
    this.deleteRoomsBySpaceId(ev.id);
  }
  handleTopicDeleted(ev) {
    const collection = this.topics.get(ev.location.roomId);
    collection.delete(ev.location.topicId);
    const room = this.list.get(ev.location.roomId);
    if (room.defaultTopic?.id === ev.location.topicId) {
      this.list.set({
        ...room,
        defaultTopic: null
      });
    }
  }
  handleNewTopic(ev) {
    this.addJoinedRoomTopics(ev.roomId, ev.topic);
  }
  addJoinedRoomTopics(roomId, ...topics) {
    if (this.topics.has(roomId)) {
      this.topics.get(roomId).set(...topics);
    } else {
      this.topics.set([roomId, new ObservableIndexedObjectCollection('id', topics)]);
    }
  }
  handleRoomJoined(ev) {
    this.addJoinedRooms(ev.room);
  }
  handleRoomUpdated(ev) {
    if (this.list.has(ev.room.id)) {
      this.list.set(ev.room);
    }
  }
  handleRoomDeleted(ev) {
    this.deleteRoom(ev.id);
  }
  handleTopicUpdated(ev) {
    const room = this.list.get(ev.location.roomId);
    if (this.topics.get(ev.location.roomId)?.has(ev.topic.id)) {
      this.topics.get(ev.location.roomId).set(ev.topic);
    }
    if (room.defaultTopic.id === ev.topic.id) {
      room.defaultTopic = ev.topic;
      this.list.set(room);
    }
  }
  addJoinedRooms(...rooms) {
    for (const room of rooms) {
      if (room.defaultTopic) {
        this.addJoinedRoomTopics(room.id, room.defaultTopic);
      }
      if (room.type === 'Pm' && room.recipients) {
        // Treat PM recipients as normal room members.
        // We are registering fake promise in `memberPromises`
        // because GetMembers are not supported for PM rooms.
        this.handleRoomMembers({
          id: room.id,
          members: room.recipients.map(user => ({
            user,
            spaceMember: null,
            roles: null
          }))
        });
        this.membersPromises.register(Promise.resolve(), room.id);
      }
    }
    this.list.set(...rooms);
  }
  handleRoomLeft(ev) {
    this.deleteRoom(ev.id);
  }
  handleRoomMemberJoined(ev) {
    if (this.members.has(ev.roomId)) {
      this.members.get(ev.roomId).set(ev.member);
    }
  }
  handleRoomMemberLeft(ev) {
    if (this.members.has(ev.roomId)) {
      this.members.get(ev.roomId).delete(ev.userId);
    }
  }
  handleRoomMembers(ev) {
    if (!this.members.has(ev.id)) {
      this.members.set([ev.id, new ObservableIndexedObjectCollection(member => member.user?.id ?? member.spaceMember.user.id, ev.members)]);
    }
  }
  handleSession(ev) {
    this.list.deleteAll();
    this.topics.deleteAll();
    this.topicsPromises.forgetAll();
    this.members.deleteAll();
    this.membersPromises.forgetAll();
    this.addJoinedRooms(...ev.state.rooms);
    this.deferredSession.resolve();
  }
  handleUserUpdated(ev) {
    this.members.items.forEach(members => {
      const member = members.get(ev.user.id);
      if (!member) {
        // Skip room; updated user is not here
        return;
      }
      const newMember = {
        ...member
      };
      if (member.user) {
        newMember.user = ev.user;
      } else {
        newMember.spaceMember.user = ev.user;
      }
      members.set(newMember);
    });
  }
  handleNewMessage(ev) {
    const topics = this.topics.get(ev.message.location.roomId);
    const topic = topics?.get(ev.message.location.topicId);
    if (!topic) {
      return; // No topic found, nothing to update
    }
    const newTopic = {
      ...topic,
      messageCount: topic.messageCount + 1,
      lastMessage: ev.message
    };
    topics.set(newTopic);
    const room = this.list.get(ev.message.location.roomId);
    if (room.defaultTopic?.id === ev.message.location.topicId) {
      this.list.set({
        ...room,
        defaultTopic: newTopic
      });
    }
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/functions.ts
function reorderRolesOnPriorityUpdate(allRoles, oldRole, updatedRole) {
  // If the priority has changed, adjust the rest of roles
  const increased = updatedRole.priority - oldRole.priority > 0;
  const decreased = !increased;
  const changedRoles = [];
  allRoles.forEach(role => {
    if (role.id === updatedRole.id) {
      // Skip the updated role
      return;
    }
    if (increased && oldRole.priority <= role.priority) {
      role.priority--;
      changedRoles.push(role);
    }
    if (decreased && updatedRole.priority <= role.priority) {
      role.priority++;
      changedRoles.push(role);
    }
  });
  return changedRoles;
}
function extractUserFromMember(member) {
  return member.user ?? member.spaceMember?.user;
}
;// CONCATENATED MODULE: ./src/state-tracker/SpacesManager.ts
function SpacesManager_defineProperty(obj, key, value) { key = SpacesManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function SpacesManager_toPropertyKey(arg) { var key = SpacesManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function SpacesManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



class SpacesManager {
  constructor(tracker) {
    this.tracker = tracker;
    SpacesManager_defineProperty(this, "list", new ObservableIndexedObjectCollection('id'));
    SpacesManager_defineProperty(this, "roles", new IndexedCollection());
    SpacesManager_defineProperty(this, "rooms", new IndexedCollection());
    SpacesManager_defineProperty(this, "roomIdToSpaceId", new IndexedCollection());
    SpacesManager_defineProperty(this, "members", new IndexedCollection());
    SpacesManager_defineProperty(this, "deferredSession", new DeferredTask());
    SpacesManager_defineProperty(this, "roomsPromises", new PromiseRegistry());
    SpacesManager_defineProperty(this, "membersPromises", new PromiseRegistry());
    this.tracker.client.on('NewRoom', ev => this.handleNewRoom(ev));
    this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
    this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
    this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('SpaceUpdated', ev => this.handleSpaceUpdated(ev));
    this.tracker.client.on('SpaceJoined', ev => this.handleSpaceJoined(ev));
    this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('SpaceMemberJoined', ev => this.handleSpaceMemberJoined(ev));
    this.tracker.client.on('SpaceMemberLeft', ev => this.handleSpaceMemberLeft(ev));
    this.tracker.client.on('SpaceMembers', ev => this.handleSpaceMembers(ev));
    this.tracker.client.on('SpaceRooms', ev => this.handleSpaceRooms(ev));
    this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
    this.tracker.client.on('UserUpdated', ev => this.handleUserUpdated(ev));
    this.tracker.client.on('NewRole', ev => this.handleNewRole(ev));
    this.tracker.client.on('RoleDeleted', ev => this.handleRoleDeleted(ev));
    this.tracker.client.on('RoleUpdated', ev => this.handleRoleUpdated(ev));
    this.tracker.client.on('Session', ev => this.handleSession(ev));
  }

  /**
   * Get collection of all the spaces you are in.
   */
  async get() {
    await this.deferredSession.promise;
    return this.list;
  }

  /**
   * Get collection of space roles.
   */
  async getRoles(spaceId) {
    await this.deferredSession.promise;
    return this.roles.get(spaceId);
  }

  /**
   * Get collection of the all available rooms inside given space.
   */
  async getRooms(spaceId) {
    if (this.roomsPromises.notExist(spaceId)) {
      this.roomsPromises.registerByFunction(async () => {
        const result = await this.tracker.client.send('GetSpaceRooms', {
          id: spaceId
        });
        if (result.error) {
          throw result.error;
        }
        this.handleSpaceRooms(result.data);
      }, spaceId);
    }
    await this.roomsPromises.get(spaceId);
    return this.rooms.get(spaceId);
  }

  /**
   * Get collection of space members.
   */
  async getMembers(spaceId) {
    if (this.membersPromises.notExist(spaceId)) {
      this.membersPromises.registerByFunction(async () => {
        const result = await this.tracker.client.send('GetSpaceMembers', {
          id: spaceId
        });
        if (result.error) {
          throw result.error;
        }
        this.handleSpaceMembers(result.data);
      }, spaceId);
    }
    await this.membersPromises.get(spaceId);
    return this.members.get(spaceId);
  }

  /**
   * Get a space member representing the current user.
   */
  async getMe(spaceId) {
    const userId = (await this.tracker.getMe()).id;
    if (!this.list.has(spaceId)) {
      // User is not in passed space.
      return undefined;
    }
    const members = await this.getMembers(spaceId);
    return members?.items.find(member => member.user.id === userId);
  }
  handleNewRole(ev) {
    const collection = this.roles.get(ev.spaceId);
    collection.set(ev.role);
    this.list.get(ev.spaceId).roles = collection.items;
  }
  handleNewRoom(ev) {
    this.rooms.get(ev.spaceId)?.set(ev.summary);
    this.roomIdToSpaceId.set([ev.summary.id, ev.spaceId]);
  }
  handleRoomUpdated(ev) {
    if (ev.room.spaceId && this.rooms.has(ev.room.spaceId)) {
      const rooms = this.rooms.get(ev.room.spaceId);
      rooms.set({
        ...rooms.get(ev.room.id),
        name: ev.room.name,
        description: ev.room.description
      });
    }
  }
  async handleRoomDeleted(ev) {
    const spaceId = this.roomIdToSpaceId.get(ev.id);
    this.roomIdToSpaceId.delete(ev.id);
    if (!spaceId) {
      return;
    }
    const space = this.list.get(spaceId);
    let spaceChanged = false;
    this.rooms.get(spaceId)?.delete(ev.id);
    if (space.systemRoom === ev.id) {
      space.systemRoom = null;
      spaceChanged = true;
    }
    if (space.defaultRooms.includes(ev.id)) {
      space.defaultRooms = space.defaultRooms.filter(roomId => roomId !== ev.id);
      spaceChanged = true;
    }
    if (spaceChanged) {
      this.list.set(space);
    }
  }
  handleRoleDeleted(ev) {
    const collection = this.roles.get(ev.spaceId);
    collection.delete(ev.id);
    this.list.get(ev.spaceId).roles = collection.items;
  }
  handleSpaceUpdated(ev) {
    this.list.set(ev.space);
  }
  handleSpaceDeleted(ev) {
    const roomIds = this.rooms.get(ev.id)?.items.map(item => item.id) ?? [];
    this.roomIdToSpaceId.delete(...roomIds);
    this.roles.delete(ev.id);
    this.members.delete(ev.id);
    this.membersPromises.forget(ev.id);
    this.rooms.delete(ev.id);
    this.roomsPromises.forget(ev.id);
    this.list.delete(ev.id);
  }
  handleSpaceJoined(ev) {
    this.addJoinedSpaces(ev.space);
  }
  addJoinedSpaces(...spaces) {
    this.roles.set(...spaces.map(space => [space.id, new ObservableIndexedObjectCollection('id', space.roles)]));
    this.list.set(...spaces);
  }
  handleSpaceMemberJoined(ev) {
    if (this.members.has(ev.spaceId)) {
      this.members.get(ev.spaceId).set(ev.member);
    }
  }
  handleSpaceMemberLeft(ev) {
    if (this.members.has(ev.spaceId)) {
      this.members.get(ev.spaceId).delete(ev.userId);
    }
  }
  handleSpaceMembers(ev) {
    if (!this.members.has(ev.id)) {
      this.members.set([ev.id, new ObservableIndexedObjectCollection(member => member?.user.id, ev.members)]);
    }
  }
  handleSpaceRooms(ev) {
    if (!this.rooms.has(ev.id)) {
      this.rooms.set([ev.id, new ObservableIndexedObjectCollection('id', ev.summaries)]);
      ev.summaries.forEach(summary => this.roomIdToSpaceId.set([summary.id, ev.id]));
    }
  }
  handleSpaceMemberUpdated(ev) {
    if (this.members.has(ev.spaceId)) {
      const members = this.members.get(ev.spaceId);
      const member = members.get(ev.userId);
      members.set({
        ...ev.member,
        user: member.user
      });
    }
  }
  handleRoleUpdated(ev) {
    const roles = this.roles.get(ev.spaceId);
    const oldRole = roles.get(ev.role.id);
    const newRole = ev.role;
    const rolesToUpdate = [newRole];
    if (oldRole.priority !== newRole.priority) {
      rolesToUpdate.push(...reorderRolesOnPriorityUpdate(roles.items, oldRole, newRole));
    }
    this.roles.get(ev.spaceId).set(...rolesToUpdate);
  }
  handleSession(ev) {
    this.list.deleteAll();
    this.roles.deleteAll();
    this.rooms.deleteAll();
    this.roomsPromises.forgetAll();
    this.members.deleteAll();
    this.membersPromises.forgetAll();
    this.roomIdToSpaceId.deleteAll();
    this.addJoinedSpaces(...ev.state.spaces);
    this.deferredSession.resolve();
  }
  handleUserUpdated(ev) {
    this.members.items.forEach(members => {
      const member = members.get(ev.user.id);
      if (!member) {
        // Skip space; updated user is not here
        return;
      }
      members.set({
        ...member,
        user: ev.user
      });
    });
  }
}
;// CONCATENATED MODULE: ./src/Permissions.ts
function Permissions_defineProperty(obj, key, value) { key = Permissions_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function Permissions_toPropertyKey(arg) { var key = Permissions_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function Permissions_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
let Layer = /*#__PURE__*/function (Layer) {
  Layer[Layer["Global"] = 0] = "Global";
  Layer[Layer["Space"] = 1] = "Space";
  Layer[Layer["Room"] = 2] = "Room";
  Layer[Layer["Topic"] = 3] = "Topic";
  return Layer;
}({});
class PermissionDefinition {
  constructor() {
    Permissions_defineProperty(this, "value", void 0);
    Permissions_defineProperty(this, "maxLayer", void 0);
  }
}
class Permissions {
  static getNames() {
    return Object.keys(this.list);
  }
  static getByName(name) {
    return this.list[name];
  }
  static canBeDefinedOnLayer(permissionName, layer) {
    const def = this.getByName(permissionName);
    if (!def) {
      throw new Error(`Invalid permission name: ${permissionName}`);
    }
    return layer <= this.getByName(permissionName).maxLayer;
  }
}
Permissions_defineProperty(Permissions, "list", {
  Root: {
    value: 1 << 0,
    maxLayer: Layer.Room
  },
  CreateSpaces: {
    value: 1 << 1,
    maxLayer: Layer.Global
  },
  ManageSpace: {
    value: 1 << 2,
    maxLayer: Layer.Space
  },
  ManageSpaceRoles: {
    value: 1 << 3,
    maxLayer: Layer.Space
  },
  ManageRoom: {
    value: 1 << 4,
    maxLayer: Layer.Room
  },
  CreateTopics: {
    value: 1 << 5,
    maxLayer: Layer.Room
  },
  ManageTopic: {
    value: 1 << 6,
    maxLayer: Layer.Topic
  },
  ManageSpaceMembers: {
    value: 1 << 7,
    maxLayer: Layer.Space
  },
  ManageRoomMembers: {
    value: 1 << 8,
    maxLayer: Layer.Room
  },
  CreateMessages: {
    value: 1 << 9,
    maxLayer: Layer.Topic
  },
  ManagePermissions: {
    value: 1 << 10,
    maxLayer: Layer.Topic
  },
  CreateSpaceRooms: {
    value: 1 << 11,
    maxLayer: Layer.Space
  },
  ManageSpaceRooms: {
    value: 1 << 12,
    maxLayer: Layer.Space
  },
  CreateEmoticons: {
    value: 1 << 13,
    maxLayer: Layer.Space
  },
  ManageEmoticon: {
    value: 1 << 14,
    maxLayer: Layer.Space
  },
  ManageBan: {
    value: 1 << 15,
    maxLayer: Layer.Room
  },
  Kick: {
    value: 1 << 16,
    maxLayer: Layer.Room
  },
  ChangeOwnNick: {
    value: 1 << 17,
    maxLayer: Layer.Space
  }
});
;// CONCATENATED MODULE: ./src/state-tracker/PermissionsManager.ts
function PermissionsManager_defineProperty(obj, key, value) { key = PermissionsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function PermissionsManager_toPropertyKey(arg) { var key = PermissionsManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function PermissionsManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }




const getOvId = (location, target) => [location.spaceId, location.roomId, location.topicId, target?.type, target?.userId, target?.roleId].filter(Boolean).join('/');
const getOvIdByObject = overwrites => getOvId(overwrites.location, overwrites.target);
class PermissionsManager extends EventTarget {
  constructor(tracker) {
    super();
    this.tracker = tracker;
    PermissionsManager_defineProperty(this, "overwrites", new IndexedCollection());
    PermissionsManager_defineProperty(this, "overwritesPromises", new PromiseRegistry());
    this.tracker.client.on('PermissionOverwrites', ev => this.handlePermissionOverwrites(ev));
    this.tracker.client.on('PermissionOverwritesUpdated', ev => this.handlePermissionOverwrites(ev));
    this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
    this.tracker.client.on('RoomLeft', ev => this.handleRoomDeleted(ev));
    this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
    this.tracker.client.on('RoleDeleted', ev => this.handleRoleDeleted(ev));
    this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
    this.tracker.client.on('RoomMemberUpdated', ev => this.handleRoomMemberUpdated(ev));
    this.tracker.client.on('Session', ev => this.handleSession(ev));
  }
  async getOverwrites(location, target) {
    this.validateLocation(location);
    const id = getOvId(location, target);
    if (this.overwritesPromises.notExist(id)) {
      this.overwritesPromises.registerByFunction(async () => {
        const result = await this.tracker.client.send('GetPermissionOverwrites', {
          location,
          target
        });
        if (result.error) {
          throw result.error;
        }
        this.handlePermissionOverwrites(result.data);
      }, id);
    }
    await this.overwritesPromises.get(id);
    return this.overwrites.get(id);
  }
  on(eventName, handler) {
    return super.on(eventName, handler);
  }
  async check(permissionNames, location) {
    if (!permissionNames.length) {
      throw new Error('Permission names array cannot be empty');
    }
    const ownedPermissions = await this.calculatePermissions(location);
    const missing = [];
    permissionNames.forEach(name => {
      if (~ownedPermissions & Permissions.getByName(name).value) {
        missing.push(name);
      }
    });
    return {
      ok: missing.length === 0,
      hasAll: missing.length === 0,
      hasAny: missing.length < permissionNames.length,
      missing
    };
  }
  async calculatePermissions(location) {
    this.validateLocation(location);
    const userId = (await this.tracker.getMe()).id;
    const [spaceMember, roomMember] = await this.fetchMembersOrFail(location);
    const userRoles = [...(spaceMember?.roles ?? []), ...(roomMember?.roles ?? [])];
    const promises = [
    // Global user overwrites
    this.getOverwrites({}, {
      type: 'User',
      userId
    }).then(v => v.overwrites)];
    if (location.spaceId && (await this.tracker.spaces.get())?.has(location.spaceId)) {
      const filterLocation = {
        spaceId: location.spaceId
      };
      promises.push(this.collectRoleOverwrites(filterLocation, userRoles));
      promises.push(this.getOverwrites(filterLocation, {
        type: 'User',
        userId
      }).then(v => v.overwrites));
    }
    if (location.roomId && (await this.tracker.rooms.get())?.has(location.roomId)) {
      const filterLocation = {
        spaceId: location.spaceId,
        roomId: location.roomId
      };
      if (userRoles.length) {
        promises.push(this.collectRoleOverwrites(filterLocation, userRoles));
      }
      promises.push(this.getOverwrites(filterLocation, {
        type: 'User',
        userId
      }).then(v => v.overwrites));
    }
    if (location.topicId && (await this.tracker.rooms.getTopics(location.roomId))?.has(location.topicId)) {
      if (userRoles.length) {
        promises.push(this.collectRoleOverwrites(location, userRoles));
      }
      promises.push(this.getOverwrites(location, {
        type: 'User',
        userId
      }).then(v => v.overwrites));
    }
    return this.resolveOverwritesHierarchy(await Promise.all(promises));
  }
  handlePermissionOverwrites(ev) {
    this.overwrites.set([getOvIdByObject(ev), ev]);
    this.emit('change');
  }
  handleSpaceDeleted(ev) {
    const ids = this.deleteOverwritesByIdPrefix(getOvId({
      spaceId: ev.id
    }));
    this.overwritesPromises.forget(...ids);
  }
  async handleRoomDeleted(ev) {
    const room = (await this.tracker.rooms.get()).get(ev.id);
    if (room) {
      const ids = this.deleteOverwritesByIdPrefix(getOvId({
        spaceId: room.spaceId,
        roomId: room.id
      }));
      this.overwritesPromises.forget(...ids);
    }
  }
  handleTopicDeleted(ev) {
    const ids = this.deleteOverwritesByIdPrefix(getOvId(ev.location));
    this.overwritesPromises.forget(...ids);
  }
  handleRoleDeleted(ev) {
    const ids = this.deleteOverwritesByIdPrefix(getOvId({
      spaceId: ev.spaceId
    }, {
      type: 'Role',
      roleId: ev.id
    }));
    this.overwritesPromises.forget(...ids);
  }
  handleSpaceMemberUpdated(ev) {
    if (ev.userId === this.tracker.me?.id) {
      // User roles in space could potentially have changed
      this.emit('change');
    }
  }
  handleRoomMemberUpdated(ev) {
    if (ev.userId === this.tracker.me?.id) {
      // User roles in room could potentially have changed
      this.emit('change');
    }
  }

  /**
   * @return Matched and deleted ids
   */
  deleteOverwritesByIdPrefix(prefix) {
    const ids = [];
    this.overwrites.items.forEach(overwrites => {
      const id = getOvIdByObject(overwrites);
      if (id.startsWith(prefix)) {
        ids.push(id);
        this.overwrites.delete(id);
      }
    });
    return ids;
  }
  async collectRoleOverwrites(location, userRoles) {
    const roleOverwrites = await Promise.all(userRoles.map(roleId => this.getOverwrites(location, {
      type: 'Role',
      roleId
    })));
    return this.resolveOverwritesFromRolesByOrder(location.spaceId, roleOverwrites);
  }
  async resolveOverwritesFromRolesByOrder(spaceId, overwrites) {
    let allows = 0,
      denies = 0;
    const roles = await this.tracker.spaces.getRoles(spaceId);
    const sortedOverwrites = overwrites.sort((a, b) => roles.get(a.target.roleId).priority - roles.get(b.target.roleId).priority);

    // Max length of bit word
    const permissionsLength = overwrites.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.overwrites.allow?.toString(2).length ?? 0, currentValue.overwrites.deny?.toString(2).length ?? 0), 0);
    sortedOverwrites.forEach(overwriteEvent => {
      const overwrites = overwriteEvent.overwrites;
      const revDecDenies = overwrites.deny?.toString(2).split('').reverse().join('') ?? '';
      const revDecAllows = overwrites.allow?.toString(2).split('').reverse().join('') ?? '';
      for (let i = 0; i < permissionsLength; i++) {
        const deny = parseInt(revDecDenies[i] ?? '0');
        const allow = parseInt(revDecAllows[i] ?? '0');
        if (deny) {
          denies |= 1 << i;
        }
        if (allow) {
          allows |= 1 << i;
        }
      }
    });
    return {
      allow: allows,
      deny: denies
    };
  }
  resolveOverwritesHierarchy(permissionOverwritesValues) {
    let result = 0;
    for (const value of permissionOverwritesValues) {
      if (value.allow & Permissions.getByName('Root').value) {
        return this.getRootAccessValue();
      }
      result = result & ~value.deny | value.allow;
    }
    return result;
  }
  getRootAccessValue() {
    let result = 0;
    for (const name of Permissions.getNames()) {
      result |= Permissions.getByName(name).value;
    }
    return result;
  }
  async fetchMembersOrFail(location) {
    const results = await Promise.all([location.spaceId ? this.tracker.spaces.getMe(location.spaceId) : null, location.roomId ? this.tracker.rooms.getMe(location.roomId) : null]);
    const spaceFail = location.spaceId && !results[0];
    const roomFail = location.roomId && !results[1];
    if (spaceFail || roomFail) {
      const layer = spaceFail ? `space (${location.spaceId})` : `room (${location.roomId})`;
      throw new Error(`Attempting to calculate permissions for a ${layer} that the user does not belong to`);
    }
    return results;
  }
  validateLocation(location) {
    if (location.topicId && !location.roomId) {
      throw new Error('Corrupted arguments hierarchy');
    }
  }
  handleSession(ev) {
    this.overwrites.deleteAll();
    this.overwritesPromises.forgetAll();
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/EmoticonsManager.ts
function EmoticonsManager_defineProperty(obj, key, value) { key = EmoticonsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function EmoticonsManager_toPropertyKey(arg) { var key = EmoticonsManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function EmoticonsManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


const GLOBAL_KEY = 'global';
class EmoticonsManager {
  constructor(tracker) {
    this.tracker = tracker;
    EmoticonsManager_defineProperty(this, "list", new IndexedCollection());
    EmoticonsManager_defineProperty(this, "emoticonsPromises", new PromiseRegistry());
    this.tracker.client.on('Emoticons', ev => this.handleEmoticons(ev));
    this.tracker.client.on('NewEmoticon', ev => this.handleNewEmoticon(ev));
    this.tracker.client.on('EmoticonDeleted', ev => this.handleEmoticonDeleted(ev));
    this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
    this.tracker.client.on('Session', () => this.handleSession());
  }
  async get(spaceId) {
    const key = spaceId ?? GLOBAL_KEY;
    if (this.emoticonsPromises.notExist(key)) {
      this.emoticonsPromises.registerByFunction(async () => {
        const result = await this.tracker.client.send('GetEmoticons', {
          spaceId
        });
        if (result.error) {
          throw result.error;
        }
        this.handleEmoticons(result.data);
      }, key);
    }
    await this.emoticonsPromises.get(key);
    return this.list.get(key);
  }
  handleEmoticons(event) {
    const spaceId = event.location.spaceId ?? GLOBAL_KEY;
    if (!this.list.has(spaceId)) {
      this.list.set([spaceId, new ObservableIndexedObjectCollection('id')]);
    }
    const collection = this.list.get(spaceId);
    collection.set(...event.emoticons);
  }
  handleNewEmoticon(ev) {
    const collection = this.list.get(ev.emoticon.spaceId ?? GLOBAL_KEY);
    collection?.set(ev.emoticon);
  }
  handleEmoticonDeleted(ev) {
    const collection = this.list.get(ev.spaceId ?? GLOBAL_KEY);
    collection?.delete(ev.emoticonId);
  }
  handleSpaceDeleted(event) {
    this.list.delete(event.id);
  }
  handleSession() {
    this.list.deleteAll();
    this.emoticonsPromises.forgetAll();
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/UsersManager.ts
function UsersManager_defineProperty(obj, key, value) { key = UsersManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function UsersManager_toPropertyKey(arg) { var key = UsersManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function UsersManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



class UsersManager {
  constructor(tracker) {
    this.tracker = tracker;
    UsersManager_defineProperty(this, "onlineStatus", new EventTarget());
    UsersManager_defineProperty(this, "users", new ObservableIndexedObjectCollection('id'));
    // RoomMemberUpdated & SpaceMemberUpdated events are not contains user object
    tracker.client.on('UserUpdated', event => this.handleUsers([event.user]));
    tracker.client.on('RoomMemberJoined', event => this.handleMembers([event.member]));
    tracker.client.on('SpaceMemberJoined', event => this.handleMembers([event.member]));
    tracker.client.on('SpaceMembers', event => this.handleMembers(event.members));
    tracker.client.on('RoomMembers', event => this.handleMembers(event.members));
    tracker.client.on('Messages', event => this.handleUsers(event.messages.map(message => message.author.user)));
    tracker.client.on('NewMessage', event => this.handleUsers([event.message.author.user]));
    tracker.client.on('Session', event => this.handleSession(event));
  }

  /**
   * Get all available (cached) user objects at once.
   */
  async getAvailable() {
    return this.users;
  }
  handleMembers(members) {
    this.handleUsers(members.map(extractUserFromMember));
  }
  handleSession(session) {
    this.users.deleteAll();
    this.handleUsers([session.user]);
  }
  handleUsers(users) {
    users.forEach(newUser => {
      const oldUser = this.users.get(newUser.id);
      if (oldUser && oldUser.online !== newUser.online) {
        this.onlineStatus.emit('change', newUser);
      }
    });
    this.users.set(...users);
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/RelationshipsManager.ts
function RelationshipsManager_defineProperty(obj, key, value) { key = RelationshipsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function RelationshipsManager_toPropertyKey(arg) { var key = RelationshipsManager_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function RelationshipsManager_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


const getId = (refUserId, type) => `${refUserId}-${type}`;
const getIdFromRelationship = relationship => getId(relationship.refUser.id, relationship.type);
class RelationshipsManager {
  constructor(tracker) {
    this.tracker = tracker;
    RelationshipsManager_defineProperty(this, "relationships", new ObservableIndexedObjectCollection(getIdFromRelationship));
    RelationshipsManager_defineProperty(this, "promises", new PromiseRegistry());
    this.tracker.client.on('Relationships', ev => this.handleRelationships(ev));
    this.tracker.client.on('NewRelationship', ev => this.handleNewRelationship(ev));
    this.tracker.client.on('RelationshipDeleted', ev => this.handleRelationshipDeleted(ev));
    this.tracker.client.on('Session', () => this.handleSession());
  }
  async get() {
    if (this.promises.notExist('all')) {
      this.promises.registerByFunction(async () => {
        const result = await this.tracker.client.send('GetRelationships', {});
        if (result.error) {
          throw result.error;
        }
      }, 'all');
    }
    await this.promises.get('all');
    return this.relationships;
  }
  async exists(refUserId, type) {
    await this.get();
    return this.relationships.has(getId(refUserId, type));
  }
  handleRelationships(ev) {
    this.relationships.deleteAll();
    ev.relationships.forEach(relationship => {
      this.relationships.set(relationship);
    });
  }
  handleNewRelationship(ev) {
    if (this.promises.has('all')) {
      this.relationships.set(ev.relationship);
    }
  }
  handleRelationshipDeleted(ev) {
    if (this.promises.has('all')) {
      this.relationships.delete(getIdFromRelationship(ev.relationship));
    }
  }
  handleSession() {
    this.promises.forgetAll();
    this.relationships.deleteAll();
  }
}
;// CONCATENATED MODULE: ./src/state-tracker/ChatStateTracker.ts
function ChatStateTracker_defineProperty(obj, key, value) { key = ChatStateTracker_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function ChatStateTracker_toPropertyKey(arg) { var key = ChatStateTracker_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function ChatStateTracker_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }







class ChatStateTracker {
  constructor(client) {
    this.client = client;
    /**
     * State of your permissions.
     */
    ChatStateTracker_defineProperty(this, "permissions", new PermissionsManager(this));
    /**
     * State of the rooms you are in.
     */
    ChatStateTracker_defineProperty(this, "rooms", new RoomsManager(this));
    /**
     * State of the spaces you are in.
     */
    ChatStateTracker_defineProperty(this, "spaces", new SpacesManager(this));
    /**
     * State of the emoticons (global and space-related).
     */
    ChatStateTracker_defineProperty(this, "emoticons", new EmoticonsManager(this));
    /**
     * Users related state.
     */
    ChatStateTracker_defineProperty(this, "users", new UsersManager(this));
    /**
     * State of relationships with other users.
     */
    ChatStateTracker_defineProperty(this, "relationships", new RelationshipsManager(this));
    ChatStateTracker_defineProperty(this, "_me", null);
    ChatStateTracker_defineProperty(this, "deferredSession", new DeferredTask());
    this.client.on('Session', ev => this.handleSession(ev));
  }
  get me() {
    return this._me;
  }
  async getMe() {
    await this.deferredSession.promise;
    return this._me;
  }
  handleSession(ev) {
    this._me = ev.user;
    this.deferredSession.resolve();
  }
}
;// CONCATENATED MODULE: ./src/WebSocketChatClient.ts
function WebSocketChatClient_defineProperty(obj, key, value) { key = WebSocketChatClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function WebSocketChatClient_toPropertyKey(arg) { var key = WebSocketChatClient_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function WebSocketChatClient_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var WebSocketChatClientEvent = /*#__PURE__*/function (WebSocketChatClientEvent) {
  WebSocketChatClientEvent["connect"] = "connect";
  WebSocketChatClientEvent["disconnect"] = "disconnect";
  WebSocketChatClientEvent["message"] = "message";
  WebSocketChatClientEvent["error"] = "error";
  return WebSocketChatClientEvent;
}(WebSocketChatClientEvent || {});
class WebSocketChatClient extends AbstractChatClient {
  constructor(options) {
    super();
    this.options = options;
    WebSocketChatClient_defineProperty(this, "Event", WebSocketChatClientEvent);
    WebSocketChatClient_defineProperty(this, "state", void 0);
    WebSocketChatClient_defineProperty(this, "ws", null);
    WebSocketChatClient_defineProperty(this, "sendQueue", []);
    WebSocketChatClient_defineProperty(this, "connectingTimeoutId", void 0);
    WebSocketChatClient_defineProperty(this, "authenticated", void 0);
    WebSocketChatClient_defineProperty(this, "authenticatedResolvers", void 0);
    if (this.options.stateTracking ?? true) {
      this.state = new ChatStateTracker(this);
    }
  }
  async connect() {
    const params = new URLSearchParams(this.options.queryParams ?? {});
    params.set('token', this.options.token);
    this.ws = new WebSocket(`${this.options.url}?${params}`);
    this.ws.onclose = ev => this.onClose(ev);
    this.ws.onmessage = ev => this.onMessage(ev);
    this.connectingTimeoutId = setTimeout(() => this.triggerConnectionTimeout(), this.options.connectingTimeoutMs ?? 10000);
    this.authenticated = false;
    return new Promise((...args) => this.authenticatedResolvers = args);
  }
  disconnect() {
    this.sendQueue = [];
    this.ws?.close();
    this.ws = null;
  }
  async send(commandType, commandData) {
    if (!this.ws || [this.ws.CLOSED, this.ws.CLOSING].includes(this.ws.readyState)) {
      throw new Error('Cannot send; close or closing connection state');
    }
    const envelope = this.createEnvelope(commandType, commandData);
    const promise = this.createPromiseFromCommandEnvelope(envelope);
    if (this.ws.readyState === this.ws.CONNECTING || !this.authenticated) {
      this.sendQueue.push(envelope);
      return promise;
    }
    if (this.ws.readyState !== this.ws.OPEN) {
      throw new Error(`Invalid websocket state=${this.ws.readyState}`);
    }
    this.sendEnvelope(envelope);
    return promise;
  }
  sendEnvelope(envelope) {
    this.ws.send(JSON.stringify(envelope));
  }
  onMessage(event) {
    const envelope = JSON.parse(event.data);
    this.handleIncomingEnvelope(envelope);
    this.emit(envelope.type, envelope.data);
    this.emit(this.Event.message, envelope);

    // Login successfully
    if (!this.authenticated) {
      const isAuthenticated = envelope.type !== 'Bye';
      this.authenticated = isAuthenticated;
      if (isAuthenticated) {
        this.authenticatedResolvers[0]();
        this.emit(this.Event.connect);
        this.sendFromQueue();
      } else {
        this.authenticatedResolvers[1](envelope.data);
      }
    }
  }
  onClose(event) {
    clearTimeout(this.connectingTimeoutId);
    const reconnect = event.code !== 1000; // Connection was closed because of error
    if (reconnect) {
      this.connect();
    }
    this.emit(this.Event.disconnect, reconnect);
  }
  sendFromQueue() {
    // Send awaiting data to server
    let lastDelay = 0;
    for (const dataIndex in this.sendQueue) {
      const envelope = this.sendQueue[dataIndex];
      setTimeout(() => this.sendEnvelope(envelope), lastDelay);
      lastDelay += this.options.awaitQueueSendDelayMs ?? 500;
    }
    this.sendQueue = [];
    clearTimeout(this.connectingTimeoutId);
  }
  triggerConnectionTimeout() {
    this.disconnect();
    this.emit(this.Event.error, new Error('Connection timeout'));
  }
}
;// CONCATENATED MODULE: ./src/WebApiChatClient.ts
function WebApiChatClient_defineProperty(obj, key, value) { key = WebApiChatClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function WebApiChatClient_toPropertyKey(arg) { var key = WebApiChatClient_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function WebApiChatClient_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var WebApiChatClientEvent = /*#__PURE__*/function (WebApiChatClientEvent) {
  WebApiChatClientEvent["message"] = "message";
  WebApiChatClientEvent["error"] = "error";
  WebApiChatClientEvent["destroy"] = "destroy";
  return WebApiChatClientEvent;
}(WebApiChatClientEvent || {});
class WebApiChatClient extends AbstractChatClient {
  constructor(options) {
    super();
    this.options = options;
    WebApiChatClient_defineProperty(this, "Event", WebApiChatClientEvent);
    WebApiChatClient_defineProperty(this, "sendStack", void 0);
  }
  async send(commandType, commandData) {
    const envelope = this.createEnvelope(commandType, commandData);
    this.sendStack.push({
      data: envelope,
      attempts: 0,
      lastTimeoutId: null
    });
    this.makeApiCall(this.sendStack.length - 1);
    return this.createPromiseFromCommandEnvelope(envelope);
  }
  destroy() {
    // Cancel all awaiting requests
    this.sendStack.forEach(item => {
      if (item.lastTimeoutId) {
        clearTimeout(item.lastTimeoutId);
      }
      this.awaitingResponse.delete(item.data.ref);
    });
    this.sendStack = [];
    this.emit(this.Event.destroy, false);
  }
  async onMessage(reqId, response) {
    this.sendStack.splice(reqId, 1);
    const envelope = await response.json();
    this.handleIncomingEnvelope(envelope);
    this.emit(envelope.type, envelope.data);
    this.emit(this.Event.message, envelope);
  }
  onError(reqId, body) {
    if (this.sendStack[reqId].attempts >= (this.options.attemptsToSend ?? 10)) {
      this.sendStack.splice(reqId, 1);
      this.handleEnvelopeSendError(this.sendStack[reqId].data, new Error(`Cannot send ${body}; aborting after reaching the maximum connection errors`));
      return;
    }
    this.sendStack[reqId].lastTimeoutId = setTimeout(() => this.makeApiCall(reqId), this.options.attemptDelayMs ?? 3000);
  }
  makeApiCall(reqId) {
    this.sendStack[reqId].attempts++;
    const bodyJson = JSON.stringify(this.sendStack[reqId].data);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    headers.Authorization = `Bearer ${this.options.token}`;
    const params = new URLSearchParams(this.options.queryParams ?? {});
    const url = `${this.options.url}${params ? '?' + params : ''}`;
    fetch(url, {
      headers,
      body: bodyJson,
      method: 'POST'
    }).then(response => this.onMessage(reqId, response)).catch(() => this.onError(reqId, bodyJson));
  }
}
;// CONCATENATED MODULE: ./src/AbstractRestClient.ts
function AbstractRestClient_defineProperty(obj, key, value) { key = AbstractRestClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AbstractRestClient_toPropertyKey(arg) { var key = AbstractRestClient_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function AbstractRestClient_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class AbstractRestClient {
  constructor(options) {
    this.options = options;
    AbstractRestClient_defineProperty(this, "defaultUrl", void 0);
  }
  async send(method, uri, data = undefined) {
    let url = this.getUrl(uri);
    let body = undefined;
    if (data) {
      if (['GET', 'DELETE'].includes(method)) {
        url += new URLSearchParams(data).toString();
      } else {
        body = JSON.stringify(data);
      }
    }
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...this.getAuthHeaders()
    };
    const result = await fetch(url, {
      method,
      body,
      headers
    });
    return this.convertFetchResponse(result);
  }
  getAuthHeaders() {
    const headers = {};
    if (this.options.token) {
      headers.Authorization = `Bearer ${this.options.token}`;
    }
    return headers;
  }
  getUrl(uri) {
    return this.removeEndingSlash(this.options.url ?? this.defaultUrl) + '/' + this.removeStartingSlash(uri);
  }
  async convertFetchResponse(result) {
    return {
      ok: result.ok,
      status: result.status,
      data: result.headers.get('content-type')?.includes('json') ? await result.json() : await result.text()
    };
  }
  removeStartingSlash(text) {
    return text.replace(/^\/+/, '');
  }
  removeEndingSlash(text) {
    return text.replace(/\/+$/, '');
  }
}
;// CONCATENATED MODULE: ./src/AuthClient.ts
function AuthClient_defineProperty(obj, key, value) { key = AuthClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AuthClient_toPropertyKey(arg) { var key = AuthClient_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function AuthClient_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

class AuthClient extends AbstractRestClient {
  constructor(...args) {
    super(...args);
    AuthClient_defineProperty(this, "defaultUrl", 'https://polfan.pl/webservice/api');
  }
  static async createToken(login, password, clientName = 'pserv-js-client') {
    const response = await new AuthClient({
      token: null
    }).send('POST', 'auth/tokens', {
      login,
      password,
      client_name: clientName
    });
    if (response.ok) {
      return response.data;
    }
    throw new Error(`Cannot create user token: ${response.data.errors[0]}`);
  }
  async deleteToken(token) {
    const response = await this.send('DELETE', `auth/tokens/${token}`);
    if (!response.ok) {
      throw new Error(`Cannot delete access token: ${response.data.errors[0]}`);
    }
  }
  async getMe() {
    const response = await this.send('GET', 'auth/me');
    if (response.ok) {
      response.data.id = response.data.id.toString();
      return response.data;
    }
    throw new Error(`Cannot get current user account: ${response.data.errors[0]}`);
  }
}
;// CONCATENATED MODULE: ./src/FilesClient.ts
function FilesClient_defineProperty(obj, key, value) { key = FilesClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function FilesClient_toPropertyKey(arg) { var key = FilesClient_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function FilesClient_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

class FilesClient extends AbstractRestClient {
  constructor(...args) {
    super(...args);
    FilesClient_defineProperty(this, "defaultUrl", 'https://files.devana.pl');
  }
  async uploadFile(file) {
    const name = encodeURIComponent(file.name ?? '');
    let headers = {
      ...this.getAuthHeaders(),
      Accept: 'application/json',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Content-Length': file.size
    };
    const response = await fetch(this.getUrl('files'), {
      method: 'POST',
      body: file,
      headers
    });
    return this.convertFetchResponse(response);
  }
  async getFileMeta(id) {
    return this.send('GET', 'files/' + id);
  }
  async getFileMetaBulk(ids) {
    const searchParams = new URLSearchParams();
    ids.forEach(id => searchParams.append('id[]', id));
    return this.send('GET', 'files?' + searchParams);
  }
}
;// CONCATENATED MODULE: ./src/index.ts








module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.cjs.js.map