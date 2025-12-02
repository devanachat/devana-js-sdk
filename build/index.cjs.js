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
  AuthClient: () => (/* reexport */ AuthClient),
  FilesClient: () => (/* reexport */ FilesClient),
  IndexedCollection: () => (/* reexport */ IndexedCollection),
  IndexedObjectCollection: () => (/* reexport */ IndexedObjectCollection),
  Layer: () => (/* reexport */ Layer),
  ObservableIndexedCollection: () => (/* reexport */ ObservableIndexedCollection),
  ObservableIndexedObjectCollection: () => (/* reexport */ ObservableIndexedObjectCollection),
  PermissionDefinition: () => (/* reexport */ PermissionDefinition),
  Permissions: () => (/* reexport */ Permissions),
  WebApiChatClient: () => (/* reexport */ WebApiChatClient),
  WebSocketChatClient: () => (/* reexport */ WebSocketChatClient),
  extractUserFromMember: () => (/* reexport */ extractUserFromMember)
});

;// ./src/EventTarget.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var EventTarget = /*#__PURE__*/function () {
  function EventTarget() {
    _classCallCheck(this, EventTarget);
    _defineProperty(this, "events", new Map());
    _defineProperty(this, "onceEvents", new Map());
  }
  return _createClass(EventTarget, [{
    key: "on",
    value: function on(eventName, handler) {
      this.addHandler(this.events, eventName, handler);
      return this;
    }
  }, {
    key: "once",
    value: function once(eventName, handler) {
      this.addHandler(this.onceEvents, eventName, handler);
      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, handler) {
      var _this$events$get;
      var index = (_this$events$get = this.events.get(eventName)) === null || _this$events$get === void 0 ? void 0 : _this$events$get.indexOf(handler);
      if (!index || index < 0) {
        return this;
      }
      this.events.get(eventName).splice(index, 1);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(eventName, event) {
      this.callHandlers(this.events, eventName, event);
      this.callHandlers(this.onceEvents, eventName, event);
      this.onceEvents["delete"](eventName);
      return this;
    }
  }, {
    key: "addHandler",
    value: function addHandler(map, eventName, handler) {
      var _map$get;
      var handlers = (_map$get = map.get(eventName)) !== null && _map$get !== void 0 ? _map$get : [];
      handlers.push(handler);
      map.set(eventName, handlers);
    }
  }, {
    key: "callHandlers",
    value: function callHandlers(map, eventName, event) {
      var _map$get2;
      (_map$get2 = map.get(eventName)) === null || _map$get2 === void 0 || _map$get2.forEach(function (callback) {
        return callback(event);
      });
    }
  }]);
}();
;// ./src/AbstractChatClient.ts
function AbstractChatClient_typeof(o) { "@babel/helpers - typeof"; return AbstractChatClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AbstractChatClient_typeof(o); }
function AbstractChatClient_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AbstractChatClient_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AbstractChatClient_toPropertyKey(o.key), o); } }
function AbstractChatClient_createClass(e, r, t) { return r && AbstractChatClient_defineProperties(e.prototype, r), t && AbstractChatClient_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == AbstractChatClient_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function AbstractChatClient_defineProperty(e, r, t) { return (r = AbstractChatClient_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function AbstractChatClient_toPropertyKey(t) { var i = AbstractChatClient_toPrimitive(t, "string"); return "symbol" == AbstractChatClient_typeof(i) ? i : i + ""; }
function AbstractChatClient_toPrimitive(t, r) { if ("object" != AbstractChatClient_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AbstractChatClient_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var AbstractChatClient = /*#__PURE__*/function (_EventTarget) {
  function AbstractChatClient() {
    var _this;
    AbstractChatClient_classCallCheck(this, AbstractChatClient);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, AbstractChatClient, [].concat(args));
    AbstractChatClient_defineProperty(_this, "awaitingResponse", new Map());
    AbstractChatClient_defineProperty(_this, "sentCounter", 0);
    return _this;
  }
  _inherits(AbstractChatClient, _EventTarget);
  return AbstractChatClient_createClass(AbstractChatClient, [{
    key: "on",
    value: function on(eventName, handler) {
      return _superPropGet(AbstractChatClient, "on", this, 3)([eventName, handler]);
    }
  }, {
    key: "once",
    value: function once(eventName, handler) {
      return _superPropGet(AbstractChatClient, "once", this, 3)([eventName, handler]);
    }
  }, {
    key: "createEnvelope",
    value: function createEnvelope(type, data) {
      return {
        type: type,
        data: data,
        ref: (++this.sentCounter).toString()
      };
    }
  }, {
    key: "createPromiseFromCommandEnvelope",
    value: function createPromiseFromCommandEnvelope(envelope) {
      var _this2 = this;
      return new Promise(function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return _this2.awaitingResponse.set(envelope.ref, args);
      });
    }
  }, {
    key: "handleIncomingEnvelope",
    value: function handleIncomingEnvelope(envelope) {
      if (!this.awaitingResponse.has(envelope.ref)) {
        return;
      }
      var isError = envelope.type === 'Error';
      this.awaitingResponse.get(envelope.ref)[0]({
        data: isError ? null : envelope.data,
        error: isError ? envelope.data : null
      });
      this.awaitingResponse["delete"](envelope.ref);
    }
  }, {
    key: "handleEnvelopeSendError",
    value: function handleEnvelopeSendError(envelope, error) {
      if (!this.awaitingResponse.has(envelope.ref)) {
        return;
      }
      this.awaitingResponse.get(envelope.ref)[1](error);
      this.awaitingResponse["delete"](envelope.ref);
    }
  }]);
}(EventTarget);

/**
 * Map of incoming events.
 */

/**
 * Map of commands and their corresponding events.
 */
;// ./src/IndexedObjectCollection.ts
function IndexedObjectCollection_typeof(o) { "@babel/helpers - typeof"; return IndexedObjectCollection_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, IndexedObjectCollection_typeof(o); }
function IndexedObjectCollection_callSuper(t, o, e) { return o = IndexedObjectCollection_getPrototypeOf(o), IndexedObjectCollection_possibleConstructorReturn(t, IndexedObjectCollection_isNativeReflectConstruct() ? Reflect.construct(o, e || [], IndexedObjectCollection_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function IndexedObjectCollection_possibleConstructorReturn(t, e) { if (e && ("object" == IndexedObjectCollection_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return IndexedObjectCollection_assertThisInitialized(t); }
function IndexedObjectCollection_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function IndexedObjectCollection_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (IndexedObjectCollection_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function IndexedObjectCollection_superPropGet(t, o, e, r) { var p = IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function IndexedObjectCollection_get() { return IndexedObjectCollection_get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = IndexedObjectCollection_superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, IndexedObjectCollection_get.apply(null, arguments); }
function IndexedObjectCollection_superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = IndexedObjectCollection_getPrototypeOf(t));); return t; }
function IndexedObjectCollection_getPrototypeOf(t) { return IndexedObjectCollection_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, IndexedObjectCollection_getPrototypeOf(t); }
function IndexedObjectCollection_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && IndexedObjectCollection_setPrototypeOf(t, e); }
function IndexedObjectCollection_setPrototypeOf(t, e) { return IndexedObjectCollection_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, IndexedObjectCollection_setPrototypeOf(t, e); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function IndexedObjectCollection_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function IndexedObjectCollection_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, IndexedObjectCollection_toPropertyKey(o.key), o); } }
function IndexedObjectCollection_createClass(e, r, t) { return r && IndexedObjectCollection_defineProperties(e.prototype, r), t && IndexedObjectCollection_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function IndexedObjectCollection_defineProperty(e, r, t) { return (r = IndexedObjectCollection_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function IndexedObjectCollection_toPropertyKey(t) { var i = IndexedObjectCollection_toPrimitive(t, "string"); return "symbol" == IndexedObjectCollection_typeof(i) ? i : i + ""; }
function IndexedObjectCollection_toPrimitive(t, r) { if ("object" != IndexedObjectCollection_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != IndexedObjectCollection_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var IndexedCollection = /*#__PURE__*/function () {
  function IndexedCollection() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    IndexedObjectCollection_classCallCheck(this, IndexedCollection);
    IndexedObjectCollection_defineProperty(this, "_items", new Map());
    this.set.apply(this, _toConsumableArray(items));
  }
  return IndexedObjectCollection_createClass(IndexedCollection, [{
    key: "items",
    get: function get() {
      return this._items;
    }
  }, {
    key: "length",
    get: function get() {
      return this._items.size;
    }
  }, {
    key: "set",
    value: function set() {
      for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
        items[_key] = arguments[_key];
      }
      for (var _i = 0, _items = items; _i < _items.length; _i++) {
        var item = _items[_i];
        this._items.set(item[0], item[1]);
      }
    }
  }, {
    key: "get",
    value: function get(id) {
      return this.items.get(id);
    }
  }, {
    key: "has",
    value: function has(id) {
      return this.items.has(id);
    }
  }, {
    key: "delete",
    value: function _delete() {
      for (var _len2 = arguments.length, ids = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        ids[_key2] = arguments[_key2];
      }
      for (var _i2 = 0, _ids = ids; _i2 < _ids.length; _i2++) {
        var _id = _ids[_i2];
        this.items["delete"](_id);
      }
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      this.items.clear();
    }
  }, {
    key: "findBy",
    value: function findBy(field, valueToFind) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var result = new IndexedCollection();
      var item;
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
  }, {
    key: "createMirror",
    value: function createMirror() {
      var copy = new IndexedCollection();
      copy._items = this._items;
      return copy;
    }
  }]);
}();
var IndexedObjectCollection = /*#__PURE__*/function () {
  function IndexedObjectCollection(id) {
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    IndexedObjectCollection_classCallCheck(this, IndexedObjectCollection);
    IndexedObjectCollection_defineProperty(this, "_items", void 0);
    this.id = id;
    this._items = new IndexedCollection();
    this.set.apply(this, _toConsumableArray(items));
  }
  return IndexedObjectCollection_createClass(IndexedObjectCollection, [{
    key: "items",
    get: function get() {
      return Array.from(this._items.items.values());
    }
  }, {
    key: "length",
    get: function get() {
      return this._items.length;
    }
  }, {
    key: "set",
    value: function set() {
      var _this$_items,
        _this = this;
      for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        items[_key3] = arguments[_key3];
      }
      (_this$_items = this._items).set.apply(_this$_items, _toConsumableArray(items.map(function (item) {
        return [_this.getId(item), item];
      })));
    }
  }, {
    key: "get",
    value: function get(id) {
      return this._items.get(id);
    }
  }, {
    key: "getAt",
    value: function getAt(index) {
      return this.items[index];
    }
  }, {
    key: "has",
    value: function has(id) {
      return this._items.has(id);
    }
  }, {
    key: "delete",
    value: function _delete() {
      var _this$_items2;
      (_this$_items2 = this._items)["delete"].apply(_this$_items2, arguments);
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      this._items.deleteAll();
    }
  }, {
    key: "findBy",
    value: function findBy(field, valueToFind) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var result = new IndexedObjectCollection(this.id);
      var _iterator = _createForOfIteratorHelper(this.items),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var value = _step.value;
          if (limit && result.length === limit) {
            break;
          }
          if (value[field] === valueToFind) {
            result.set(value);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return result;
    }
  }, {
    key: "createMirror",
    value: function createMirror() {
      var copy = new IndexedObjectCollection(this.id);
      copy._items = this._items;
      return copy;
    }
  }, {
    key: "getId",
    value: function getId(item) {
      return typeof this.id === 'function' ? this.id(item) : item[this.id];
    }
  }]);
}();
var ObservableIndexedCollection = /*#__PURE__*/function (_IndexedCollection2) {
  function ObservableIndexedCollection() {
    var _this3;
    var _this2;
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    IndexedObjectCollection_classCallCheck(this, ObservableIndexedCollection);
    _this2 = IndexedObjectCollection_callSuper(this, ObservableIndexedCollection);
    IndexedObjectCollection_defineProperty(_this2, "eventTarget", void 0);
    _this2.eventTarget = new EventTarget();
    (_this3 = _this2).set.apply(_this3, _toConsumableArray(items));
    return _this2;
  }
  IndexedObjectCollection_inherits(ObservableIndexedCollection, _IndexedCollection2);
  return IndexedObjectCollection_createClass(ObservableIndexedCollection, [{
    key: "set",
    value: function set() {
      for (var _len4 = arguments.length, items = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        items[_key4] = arguments[_key4];
      }
      if (items.length) {
        IndexedObjectCollection_superPropGet(ObservableIndexedCollection, "set", this, 3)(items);
        this.eventTarget.emit('change', {
          setItems: items.map(function (item) {
            return item[0];
          })
        });
      }
    }
  }, {
    key: "delete",
    value: function _delete() {
      for (var _len5 = arguments.length, ids = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        ids[_key5] = arguments[_key5];
      }
      if (ids.length) {
        IndexedObjectCollection_superPropGet(ObservableIndexedCollection, "delete", this, 3)(ids);
        this.eventTarget.emit('change', {
          deletedItems: ids
        });
      }
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      if (this.length) {
        var ids = this._items.keys();
        IndexedObjectCollection_superPropGet(ObservableIndexedCollection, "deleteAll", this, 3)([]);
        this.eventTarget.emit('change', {
          deletedItems: Array.from(ids)
        });
      }
    }
  }, {
    key: "createMirror",
    value: function createMirror() {
      var copy = new ObservableIndexedCollection();
      copy.eventTarget = this.eventTarget;
      copy._items = this._items;
      return copy;
    }
  }, {
    key: "on",
    value: function on(eventName, handler) {
      this.eventTarget.on(eventName, handler);
      return this;
    }
  }, {
    key: "once",
    value: function once(eventName, handler) {
      this.eventTarget.once(eventName, handler);
      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, handler) {
      this.eventTarget.off(eventName, handler);
      return this;
    }
  }]);
}(IndexedCollection);
var ObservableIndexedObjectCollection = /*#__PURE__*/function (_IndexedObjectCollect) {
  function ObservableIndexedObjectCollection(id) {
    var _this5;
    var _this4;
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    IndexedObjectCollection_classCallCheck(this, ObservableIndexedObjectCollection);
    _this4 = IndexedObjectCollection_callSuper(this, ObservableIndexedObjectCollection, [id]);
    IndexedObjectCollection_defineProperty(_this4, "eventTarget", void 0);
    _this4.id = id;
    _this4.eventTarget = new EventTarget();
    (_this5 = _this4).set.apply(_this5, _toConsumableArray(items));
    return _this4;
  }
  IndexedObjectCollection_inherits(ObservableIndexedObjectCollection, _IndexedObjectCollect);
  return IndexedObjectCollection_createClass(ObservableIndexedObjectCollection, [{
    key: "set",
    value: function set() {
      var _this6 = this;
      for (var _len6 = arguments.length, items = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        items[_key6] = arguments[_key6];
      }
      if (items.length) {
        IndexedObjectCollection_superPropGet(ObservableIndexedObjectCollection, "set", this, 3)(items);
        this.eventTarget.emit('change', {
          setItems: items.map(function (item) {
            return _this6.getId(item);
          })
        });
      }
    }
  }, {
    key: "delete",
    value: function _delete() {
      for (var _len7 = arguments.length, ids = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        ids[_key7] = arguments[_key7];
      }
      if (ids.length) {
        IndexedObjectCollection_superPropGet(ObservableIndexedObjectCollection, "delete", this, 3)(ids);
        this.eventTarget.emit('change', {
          deletedItems: ids
        });
      }
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      if (this.length) {
        var ids = this._items.items.keys();
        IndexedObjectCollection_superPropGet(ObservableIndexedObjectCollection, "deleteAll", this, 3)([]);
        this.eventTarget.emit('change', {
          deletedItems: Array.from(ids)
        });
      }
    }
  }, {
    key: "createMirror",
    value: function createMirror() {
      var copy = new ObservableIndexedObjectCollection(this.id);
      copy.eventTarget = this.eventTarget;
      copy._items = this._items;
      return copy;
    }
  }, {
    key: "on",
    value: function on(eventName, handler) {
      this.eventTarget.on(eventName, handler);
      return this;
    }
  }, {
    key: "once",
    value: function once(eventName, handler) {
      this.eventTarget.once(eventName, handler);
      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, handler) {
      this.eventTarget.off(eventName, handler);
      return this;
    }
  }]);
}(IndexedObjectCollection);
;// ./src/state-tracker/AsyncUtils.ts
function AsyncUtils_typeof(o) { "@babel/helpers - typeof"; return AsyncUtils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AsyncUtils_typeof(o); }
function AsyncUtils_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AsyncUtils_toPropertyKey(o.key), o); } }
function AsyncUtils_createClass(e, r, t) { return r && AsyncUtils_defineProperties(e.prototype, r), t && AsyncUtils_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function AsyncUtils_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AsyncUtils_defineProperty(e, r, t) { return (r = AsyncUtils_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function AsyncUtils_toPropertyKey(t) { var i = AsyncUtils_toPrimitive(t, "string"); return "symbol" == AsyncUtils_typeof(i) ? i : i + ""; }
function AsyncUtils_toPrimitive(t, r) { if ("object" != AsyncUtils_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AsyncUtils_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var DeferredTask = /*#__PURE__*/AsyncUtils_createClass(function DeferredTask() {
  var _this = this;
  AsyncUtils_classCallCheck(this, DeferredTask);
  AsyncUtils_defineProperty(this, "promise", void 0);
  AsyncUtils_defineProperty(this, "resolve", void 0);
  this.promise = new Promise(function (resolve) {
    return _this.resolve = resolve;
  });
});
var PromiseRegistry = /*#__PURE__*/function () {
  function PromiseRegistry() {
    AsyncUtils_classCallCheck(this, PromiseRegistry);
    AsyncUtils_defineProperty(this, "promises", new IndexedCollection());
  }
  return AsyncUtils_createClass(PromiseRegistry, [{
    key: "register",
    value: function register(promise, key) {
      this.promises.set([key, promise]);
    }
  }, {
    key: "registerByFunction",
    value: function registerByFunction(fn, key) {
      this.register(fn(), key);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.promises.get(key);
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.promises.has(key);
    }
  }, {
    key: "notExist",
    value: function notExist(key) {
      return !this.has(key);
    }
  }, {
    key: "forget",
    value: function forget() {
      var _this$promises;
      (_this$promises = this.promises)["delete"].apply(_this$promises, arguments);
    }
  }, {
    key: "forgetAll",
    value: function forgetAll() {
      this.promises.deleteAll();
    }
  }]);
}();
;// ./src/state-tracker/TopicHistoryWindow.ts
function TopicHistoryWindow_typeof(o) { "@babel/helpers - typeof"; return TopicHistoryWindow_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, TopicHistoryWindow_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { TopicHistoryWindow_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function TopicHistoryWindow_superPropGet(t, o, e, r) { var p = TopicHistoryWindow_get(TopicHistoryWindow_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function TopicHistoryWindow_get() { return TopicHistoryWindow_get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = TopicHistoryWindow_superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, TopicHistoryWindow_get.apply(null, arguments); }
function TopicHistoryWindow_superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = TopicHistoryWindow_getPrototypeOf(t));); return t; }
function TopicHistoryWindow_toConsumableArray(r) { return TopicHistoryWindow_arrayWithoutHoles(r) || TopicHistoryWindow_iterableToArray(r) || TopicHistoryWindow_unsupportedIterableToArray(r) || TopicHistoryWindow_nonIterableSpread(); }
function TopicHistoryWindow_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function TopicHistoryWindow_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return TopicHistoryWindow_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? TopicHistoryWindow_arrayLikeToArray(r, a) : void 0; } }
function TopicHistoryWindow_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function TopicHistoryWindow_arrayWithoutHoles(r) { if (Array.isArray(r)) return TopicHistoryWindow_arrayLikeToArray(r); }
function TopicHistoryWindow_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function TopicHistoryWindow_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function TopicHistoryWindow_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, TopicHistoryWindow_toPropertyKey(o.key), o); } }
function TopicHistoryWindow_createClass(e, r, t) { return r && TopicHistoryWindow_defineProperties(e.prototype, r), t && TopicHistoryWindow_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function TopicHistoryWindow_callSuper(t, o, e) { return o = TopicHistoryWindow_getPrototypeOf(o), TopicHistoryWindow_possibleConstructorReturn(t, TopicHistoryWindow_isNativeReflectConstruct() ? Reflect.construct(o, e || [], TopicHistoryWindow_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function TopicHistoryWindow_possibleConstructorReturn(t, e) { if (e && ("object" == TopicHistoryWindow_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return TopicHistoryWindow_assertThisInitialized(t); }
function TopicHistoryWindow_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function TopicHistoryWindow_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (TopicHistoryWindow_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function TopicHistoryWindow_getPrototypeOf(t) { return TopicHistoryWindow_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, TopicHistoryWindow_getPrototypeOf(t); }
function TopicHistoryWindow_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && TopicHistoryWindow_setPrototypeOf(t, e); }
function TopicHistoryWindow_setPrototypeOf(t, e) { return TopicHistoryWindow_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, TopicHistoryWindow_setPrototypeOf(t, e); }
function TopicHistoryWindow_defineProperty(e, r, t) { return (r = TopicHistoryWindow_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function TopicHistoryWindow_toPropertyKey(t) { var i = TopicHistoryWindow_toPrimitive(t, "string"); return "symbol" == TopicHistoryWindow_typeof(i) ? i : i + ""; }
function TopicHistoryWindow_toPrimitive(t, r) { if ("object" != TopicHistoryWindow_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != TopicHistoryWindow_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var WindowState = /*#__PURE__*/function (WindowState) {
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
var TraversableRemoteCollection = /*#__PURE__*/function (_ObservableIndexedObj) {
  function TraversableRemoteCollection() {
    var _this;
    TopicHistoryWindow_classCallCheck(this, TraversableRemoteCollection);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = TopicHistoryWindow_callSuper(this, TraversableRemoteCollection, [].concat(args));
    TopicHistoryWindow_defineProperty(_this, "internalState", {
      current: WindowState.LIVE,
      ongoing: undefined,
      limit: 50,
      oldestId: null
    });
    return _this;
  }
  TopicHistoryWindow_inherits(TraversableRemoteCollection, _ObservableIndexedObj);
  return TopicHistoryWindow_createClass(TraversableRemoteCollection, [{
    key: "state",
    get:
    /**
     * Current mode od collection window. To change mode, call one of available fetch methods.
     */
    function get() {
      return this.internalState.current;
    }
  }, {
    key: "limit",
    get:
    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
    function get() {
      return this.internalState.limit;
    }

    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */,
    set: function set(value) {
      this.internalState.limit = value;
    }
  }, {
    key: "hasLatest",
    get: function get() {
      return [WindowState.LATEST, WindowState.LIVE].includes(this.state);
    }
  }, {
    key: "hasOldest",
    get: function get() {
      return this.state === WindowState.OLDEST || this.internalState.oldestId !== null && this.has(this.internalState.oldestId);
    }
  }, {
    key: "resetToLatest",
    value: function () {
      var _resetToLatest = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var result;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!(this.internalState.ongoing || this.internalState.current === WindowState.LATEST)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              this.internalState.ongoing = WindowState.LATEST;
              _context.p = 2;
              _context.n = 3;
              return this.fetchLatestItems();
            case 3:
              result = _context.v;
            case 4:
              _context.p = 4;
              this.internalState.ongoing = undefined;
              return _context.f(4);
            case 5:
              this.deleteAll();
              this.addItems(result, 'tail');
              this.internalState.current = WindowState.LATEST;
            case 6:
              return _context.a(2);
          }
        }, _callee, this, [[2,, 4, 5]]);
      }));
      function resetToLatest() {
        return _resetToLatest.apply(this, arguments);
      }
      return resetToLatest;
    }()
  }, {
    key: "fetchPrevious",
    value: function () {
      var _fetchPrevious = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var result, firstItem;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if (!(this.internalState.ongoing || this.hasOldest)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2);
            case 1:
              this.internalState.ongoing = WindowState.PAST;
              _context2.p = 2;
              _context2.n = 3;
              return this.fetchItemsBefore();
            case 3:
              result = _context2.v;
            case 4:
              _context2.p = 4;
              this.internalState.ongoing = undefined;
              return _context2.f(4);
            case 5:
              if (result) {
                _context2.n = 6;
                break;
              }
              return _context2.a(2, this.resetToLatest());
            case 6:
              if (result.length) {
                _context2.n = 8;
                break;
              }
              firstItem = this.getAt(0);
              this.internalState.oldestId = firstItem ? this.getId(firstItem) : null;
              _context2.n = 7;
              return this.refreshFetchedState();
            case 7:
              // LATEST state has priority over OLDEST
              if (this.internalState.current === WindowState.PAST) {
                this.internalState.current = WindowState.OLDEST;
              }
              return _context2.a(2);
            case 8:
              this.addItems(result, 'head');
              _context2.n = 9;
              return this.refreshFetchedState();
            case 9:
              return _context2.a(2);
          }
        }, _callee2, this, [[2,, 4, 5]]);
      }));
      function fetchPrevious() {
        return _fetchPrevious.apply(this, arguments);
      }
      return fetchPrevious;
    }()
  }, {
    key: "fetchNext",
    value: function () {
      var _fetchNext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var result;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (!(this.internalState.ongoing || this.hasLatest)) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2);
            case 1:
              this.internalState.ongoing = WindowState.PAST;
              _context3.p = 2;
              _context3.n = 3;
              return this.fetchItemsAfter();
            case 3:
              result = _context3.v;
            case 4:
              _context3.p = 4;
              this.internalState.ongoing = undefined;
              return _context3.f(4);
            case 5:
              if (result) {
                _context3.n = 7;
                break;
              }
              _context3.n = 6;
              return this.resetToLatest();
            case 6:
              return _context3.a(2);
            case 7:
              if (!result.length) {
                _context3.n = 9;
                break;
              }
              this.addItems(result, 'tail');
              _context3.n = 8;
              return this.refreshFetchedState();
            case 8:
              return _context3.a(2);
            case 9:
              return _context3.a(2);
          }
        }, _callee3, this, [[2,, 4, 5]]);
      }));
      function fetchNext() {
        return _fetchNext.apply(this, arguments);
      }
      return fetchNext;
    }()
  }, {
    key: "refreshFetchedState",
    value: function () {
      var _refreshFetchedState = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _t;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.isLatestItemLoaded();
            case 1:
              if (!_context4.v) {
                _context4.n = 2;
                break;
              }
              _t = WindowState.LATEST;
              _context4.n = 3;
              break;
            case 2:
              _t = WindowState.PAST;
            case 3:
              this.internalState.current = _t;
            case 4:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function refreshFetchedState() {
        return _refreshFetchedState.apply(this, arguments);
      }
      return refreshFetchedState;
    }()
  }, {
    key: "addItems",
    value: function addItems(newItems, to) {
      var result;
      if (to === 'head') {
        result = this.trimItemsArrayToLimit([].concat(TopicHistoryWindow_toConsumableArray(newItems), TopicHistoryWindow_toConsumableArray(this.items)), 'tail');
      }
      if (to === 'tail') {
        result = this.trimItemsArrayToLimit([].concat(TopicHistoryWindow_toConsumableArray(this.items), TopicHistoryWindow_toConsumableArray(newItems)), 'head');
      }
      this.deleteAll();
      this.set.apply(this, TopicHistoryWindow_toConsumableArray(result));
    }

    /**
     * Return array with messages of count that matching limit.
     */
  }, {
    key: "trimItemsArrayToLimit",
    value: function trimItemsArrayToLimit(items, from) {
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
  }]);
}(ObservableIndexedObjectCollection);
var TopicHistoryWindow = /*#__PURE__*/function (_TraversableRemoteCol) {
  function TopicHistoryWindow(roomId, topicId, tracker) {
    var _this2;
    var bindEvents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    TopicHistoryWindow_classCallCheck(this, TopicHistoryWindow);
    _this2 = TopicHistoryWindow_callSuper(this, TopicHistoryWindow, ['id']);
    /**
     * Reexported available window modes enum.
     */
    TopicHistoryWindow_defineProperty(_this2, "WindowState", WindowState);
    _this2.roomId = roomId;
    _this2.topicId = topicId;
    _this2.tracker = tracker;
    _this2.internalState.traverseLock = false;
    if (bindEvents) {
      _this2.tracker.client.on('Session', function (ev) {
        return _this2.handleSession(ev);
      });
      _this2.tracker.client.on('NewMessage', function (ev) {
        return _this2.handleNewMessage(ev);
      });
    }
    return _this2;
  }
  TopicHistoryWindow_inherits(TopicHistoryWindow, _TraversableRemoteCol);
  return TopicHistoryWindow_createClass(TopicHistoryWindow, [{
    key: "createMirror",
    value: function createMirror() {
      var copy = new TopicHistoryWindow(this.roomId, this.topicId, this.tracker, false);
      copy.eventTarget = this.eventTarget;
      copy._items = this._items;
      copy.internalState = this.internalState;
      return copy;
    }
  }, {
    key: "isTraverseLocked",
    get: function get() {
      return this.internalState.traverseLock;
    }
  }, {
    key: "setTraverseLock",
    value: function () {
      var _setTraverseLock = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(lock) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              this.internalState.traverseLock = lock;
              if (!(lock && this.state !== WindowState.LIVE && this.state !== WindowState.LATEST)) {
                _context5.n = 1;
                break;
              }
              _context5.n = 1;
              return TopicHistoryWindow_superPropGet(TopicHistoryWindow, "resetToLatest", this, 3)([]);
            case 1:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function setTraverseLock(_x) {
        return _setTraverseLock.apply(this, arguments);
      }
      return setTraverseLock;
    }()
  }, {
    key: "resetToLatest",
    value: function () {
      var _resetToLatest2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (!this.internalState.traverseLock) {
                _context6.n = 1;
                break;
              }
              return _context6.a(2);
            case 1:
              return _context6.a(2, TopicHistoryWindow_superPropGet(TopicHistoryWindow, "resetToLatest", this, 3)([]));
          }
        }, _callee6, this);
      }));
      function resetToLatest() {
        return _resetToLatest2.apply(this, arguments);
      }
      return resetToLatest;
    }()
  }, {
    key: "fetchNext",
    value: function () {
      var _fetchNext2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              if (!this.internalState.traverseLock) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2);
            case 1:
              return _context7.a(2, TopicHistoryWindow_superPropGet(TopicHistoryWindow, "fetchNext", this, 3)([]));
          }
        }, _callee7, this);
      }));
      function fetchNext() {
        return _fetchNext2.apply(this, arguments);
      }
      return fetchNext;
    }()
  }, {
    key: "fetchPrevious",
    value: function () {
      var _fetchPrevious2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              if (!this.internalState.traverseLock) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2);
            case 1:
              return _context8.a(2, TopicHistoryWindow_superPropGet(TopicHistoryWindow, "fetchPrevious", this, 3)([]));
          }
        }, _callee8, this);
      }));
      function fetchPrevious() {
        return _fetchPrevious2.apply(this, arguments);
      }
      return fetchPrevious;
    }()
    /**
     * For internal use.
     * @internal
     */
  }, {
    key: "_updateMessageReference",
    value: function _updateMessageReference(refTopic) {
      var refMessage = this.get(refTopic.refMessage.id);
      if (refMessage) {
        // Update referenced topic ID in message
        this.set(_objectSpread(_objectSpread({}, refMessage), {}, {
          topicRef: refTopic.id
        }));
      }
    }
  }, {
    key: "handleNewMessage",
    value: function () {
      var _handleNewMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(ev) {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              if ([WindowState.LATEST, WindowState.LIVE].includes(this.state) && ev.message.location.roomId === this.roomId && ev.message.location.topicId === this.topicId) {
                this.addItems([ev.message], 'tail');
              }
            case 1:
              return _context9.a(2);
          }
        }, _callee9, this);
      }));
      function handleNewMessage(_x2) {
        return _handleNewMessage.apply(this, arguments);
      }
      return handleNewMessage;
    }()
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      var _this3 = this;
      var rooms = ev.state.rooms;
      if (rooms.find(function (room) {
        return room.id === _this3.roomId;
      })) {
        void this.resetToLatest();
      } else {
        this.deleteAll();
      }
    }
  }, {
    key: "fetchItemsAfter",
    value: function () {
      var _fetchItemsAfter = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _this$getAt;
        var afterId, result;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              afterId = (_this$getAt = this.getAt(this.length - 1)) === null || _this$getAt === void 0 ? void 0 : _this$getAt.id;
              if (afterId) {
                _context0.n = 1;
                break;
              }
              return _context0.a(2, null);
            case 1:
              _context0.n = 2;
              return this.tracker.client.send('GetMessages', {
                location: {
                  roomId: this.roomId,
                  topicId: this.topicId
                },
                after: afterId
              });
            case 2:
              result = _context0.v;
              if (!result.error) {
                _context0.n = 3;
                break;
              }
              throw new Error("Cannot fetch messages: ".concat(result.error.message));
            case 3:
              return _context0.a(2, result.data.messages);
          }
        }, _callee0, this);
      }));
      function fetchItemsAfter() {
        return _fetchItemsAfter.apply(this, arguments);
      }
      return fetchItemsAfter;
    }()
  }, {
    key: "fetchItemsBefore",
    value: function () {
      var _fetchItemsBefore = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var _this$getAt2;
        var beforeId, result;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              beforeId = (_this$getAt2 = this.getAt(0)) === null || _this$getAt2 === void 0 ? void 0 : _this$getAt2.id;
              if (beforeId) {
                _context1.n = 1;
                break;
              }
              return _context1.a(2, null);
            case 1:
              _context1.n = 2;
              return this.tracker.client.send('GetMessages', {
                location: {
                  roomId: this.roomId,
                  topicId: this.topicId
                },
                before: beforeId
              });
            case 2:
              result = _context1.v;
              if (!result.error) {
                _context1.n = 3;
                break;
              }
              throw new Error("Cannot fetch messages: ".concat(result.error.message));
            case 3:
              return _context1.a(2, result.data.messages);
          }
        }, _callee1, this);
      }));
      function fetchItemsBefore() {
        return _fetchItemsBefore.apply(this, arguments);
      }
      return fetchItemsBefore;
    }()
  }, {
    key: "fetchLatestItems",
    value: function () {
      var _fetchLatestItems = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        var result;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return this.tracker.client.send('GetMessages', {
                location: {
                  roomId: this.roomId,
                  topicId: this.topicId
                }
              });
            case 1:
              result = _context10.v;
              if (!result.error) {
                _context10.n = 2;
                break;
              }
              throw new Error("Cannot fetch messages: ".concat(result.error.message));
            case 2:
              return _context10.a(2, result.data.messages);
          }
        }, _callee10, this);
      }));
      function fetchLatestItems() {
        return _fetchLatestItems.apply(this, arguments);
      }
      return fetchLatestItems;
    }()
  }, {
    key: "getTopic",
    value: function () {
      var _getTopic = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              _context11.n = 1;
              return this.tracker.rooms.getTopics(this.roomId, [this.topicId]);
            case 1:
              return _context11.a(2, _context11.v.get(this.topicId));
          }
        }, _callee11, this);
      }));
      function getTopic() {
        return _getTopic.apply(this, arguments);
      }
      return getTopic;
    }()
  }, {
    key: "getLatestMessageId",
    value: function () {
      var _getLatestMessageId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
        var _yield$this$getTopic;
        var _t2, _t3, _t4, _t5;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              _context12.n = 1;
              return this.getTopic();
            case 1:
              _t4 = _yield$this$getTopic = _context12.v;
              _t3 = _t4 === null;
              if (_t3) {
                _context12.n = 2;
                break;
              }
              _t3 = _yield$this$getTopic === void 0;
            case 2:
              _t2 = _t3;
              if (_t2) {
                _context12.n = 3;
                break;
              }
              _t2 = (_yield$this$getTopic = _yield$this$getTopic.lastMessage) === null || _yield$this$getTopic === void 0;
            case 3:
              if (!_t2) {
                _context12.n = 4;
                break;
              }
              _t5 = void 0;
              _context12.n = 5;
              break;
            case 4:
              _t5 = _yield$this$getTopic.id;
            case 5:
              return _context12.a(2, _t5);
          }
        }, _callee12, this);
      }));
      function getLatestMessageId() {
        return _getLatestMessageId.apply(this, arguments);
      }
      return getLatestMessageId;
    }()
  }, {
    key: "isLatestItemLoaded",
    value: function () {
      var _isLatestItemLoaded = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
        var lastMessageId;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              _context13.n = 1;
              return this.getLatestMessageId();
            case 1:
              lastMessageId = _context13.v;
              return _context13.a(2, lastMessageId ? this.has(lastMessageId) : true);
          }
        }, _callee13, this);
      }));
      function isLatestItemLoaded() {
        return _isLatestItemLoaded.apply(this, arguments);
      }
      return isLatestItemLoaded;
    }()
  }]);
}(TraversableRemoteCollection);
;// ./src/state-tracker/RoomMessagesHistory.ts
function RoomMessagesHistory_typeof(o) { "@babel/helpers - typeof"; return RoomMessagesHistory_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, RoomMessagesHistory_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || RoomMessagesHistory_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function RoomMessagesHistory_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return RoomMessagesHistory_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? RoomMessagesHistory_arrayLikeToArray(r, a) : void 0; } }
function RoomMessagesHistory_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function RoomMessagesHistory_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return RoomMessagesHistory_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (RoomMessagesHistory_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, RoomMessagesHistory_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, RoomMessagesHistory_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), RoomMessagesHistory_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", RoomMessagesHistory_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), RoomMessagesHistory_regeneratorDefine2(u), RoomMessagesHistory_regeneratorDefine2(u, o, "Generator"), RoomMessagesHistory_regeneratorDefine2(u, n, function () { return this; }), RoomMessagesHistory_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (RoomMessagesHistory_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function RoomMessagesHistory_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } RoomMessagesHistory_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { RoomMessagesHistory_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, RoomMessagesHistory_regeneratorDefine2(e, r, n, t); }
function RoomMessagesHistory_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function RoomMessagesHistory_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { RoomMessagesHistory_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { RoomMessagesHistory_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function RoomMessagesHistory_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function RoomMessagesHistory_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, RoomMessagesHistory_toPropertyKey(o.key), o); } }
function RoomMessagesHistory_createClass(e, r, t) { return r && RoomMessagesHistory_defineProperties(e.prototype, r), t && RoomMessagesHistory_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function RoomMessagesHistory_defineProperty(e, r, t) { return (r = RoomMessagesHistory_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function RoomMessagesHistory_toPropertyKey(t) { var i = RoomMessagesHistory_toPrimitive(t, "string"); return "symbol" == RoomMessagesHistory_typeof(i) ? i : i + ""; }
function RoomMessagesHistory_toPrimitive(t, r) { if ("object" != RoomMessagesHistory_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != RoomMessagesHistory_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var RoomMessagesHistory = /*#__PURE__*/function () {
  function RoomMessagesHistory(room, tracker) {
    var _this = this;
    RoomMessagesHistory_classCallCheck(this, RoomMessagesHistory);
    RoomMessagesHistory_defineProperty(this, "historyWindows", new IndexedCollection());
    RoomMessagesHistory_defineProperty(this, "traverseLock", false);
    this.room = room;
    this.tracker = tracker;
    this.tracker.client.on('RoomUpdated', function (ev) {
      return _this.handleRoomUpdated(ev);
    });
    this.tracker.client.on('NewTopic', function (ev) {
      return _this.handleNewTopic(ev);
    });
    this.tracker.client.on('TopicDeleted', function (ev) {
      return _this.handleTopicDeleted(ev);
    });
    this.updateTraverseLock(this.room);
    if (this.room.defaultTopic) {
      this.createHistoryWindowForTopic(this.room.defaultTopic);
    }
  }

  /**
   * Returns a history window object for the given topic ID, allowing you to view message history.
   */
  return RoomMessagesHistory_createClass(RoomMessagesHistory, [{
    key: "getMessagesWindow",
    value: (function () {
      var _getMessagesWindow = RoomMessagesHistory_asyncToGenerator(/*#__PURE__*/RoomMessagesHistory_regenerator().m(function _callee(topicId) {
        var historyWindow, topic;
        return RoomMessagesHistory_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              historyWindow = this.historyWindows.get(topicId);
              if (historyWindow) {
                _context.n = 2;
                break;
              }
              _context.n = 1;
              return this.tracker.rooms.getTopics(this.room.id, [topicId]);
            case 1:
              topic = _context.v.get(topicId);
              if (topic) {
                this.createHistoryWindowForTopic(topic);
              }
            case 2:
              return _context.a(2, this.historyWindows.get(topicId));
          }
        }, _callee, this);
      }));
      function getMessagesWindow(_x) {
        return _getMessagesWindow.apply(this, arguments);
      }
      return getMessagesWindow;
    }())
  }, {
    key: "handleRoomUpdated",
    value: function () {
      var _handleRoomUpdated = RoomMessagesHistory_asyncToGenerator(/*#__PURE__*/RoomMessagesHistory_regenerator().m(function _callee2(ev) {
        var _i, _Array$from, _Array$from$_i, window;
        return RoomMessagesHistory_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!(this.room.id === ev.room.id)) {
                _context2.n = 3;
                break;
              }
              this.room = ev.room;
              this.updateTraverseLock(ev.room);
              if (ev.room.defaultTopic) {
                this.createHistoryWindowForTopic(ev.room.defaultTopic);
              }
              _i = 0, _Array$from = Array.from(this.historyWindows.items);
            case 1:
              if (!(_i < _Array$from.length)) {
                _context2.n = 3;
                break;
              }
              _Array$from$_i = _slicedToArray(_Array$from[_i], 2), window = _Array$from$_i[1];
              _context2.n = 2;
              return window.setTraverseLock(this.traverseLock);
            case 2:
              _i++;
              _context2.n = 1;
              break;
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function handleRoomUpdated(_x2) {
        return _handleRoomUpdated.apply(this, arguments);
      }
      return handleRoomUpdated;
    }()
  }, {
    key: "handleNewTopic",
    value: function handleNewTopic(ev) {
      if (this.room.id === ev.roomId) {
        this.createHistoryWindowForTopic(ev.topic);
      }
    }
  }, {
    key: "handleTopicDeleted",
    value: function handleTopicDeleted(ev) {
      if (this.room.id === ev.location.roomId) {
        this.historyWindows["delete"](ev.location.topicId);
      }
    }
  }, {
    key: "createHistoryWindowForTopic",
    value: function createHistoryWindowForTopic(topic) {
      if (this.historyWindows.has(topic.id)) {
        return;
      }
      var historyWindow = new TopicHistoryWindow(this.room.id, topic.id, this.tracker);
      void historyWindow.setTraverseLock(this.traverseLock);
      this.historyWindows.set([topic.id, historyWindow]);

      // If new topic refers to some message from this room, update other structures
      if (topic.refMessage) {
        var refHistoryWindow = this.historyWindows.get(topic.refMessage.location.topicId);
        refHistoryWindow === null || refHistoryWindow === void 0 || refHistoryWindow._updateMessageReference(topic);
      }
    }
  }, {
    key: "updateTraverseLock",
    value: function updateTraverseLock(room) {
      this.traverseLock = room.history.mode === 'Ephemeral';
    }
  }]);
}();
;// ./src/state-tracker/MessagesManager.ts
function MessagesManager_typeof(o) { "@babel/helpers - typeof"; return MessagesManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, MessagesManager_typeof(o); }
function MessagesManager_toConsumableArray(r) { return MessagesManager_arrayWithoutHoles(r) || MessagesManager_iterableToArray(r) || MessagesManager_unsupportedIterableToArray(r) || MessagesManager_nonIterableSpread(); }
function MessagesManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function MessagesManager_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function MessagesManager_arrayWithoutHoles(r) { if (Array.isArray(r)) return MessagesManager_arrayLikeToArray(r); }
function MessagesManager_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function MessagesManager_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? MessagesManager_ownKeys(Object(t), !0).forEach(function (r) { MessagesManager_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : MessagesManager_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function MessagesManager_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = MessagesManager_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function MessagesManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return MessagesManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? MessagesManager_arrayLikeToArray(r, a) : void 0; } }
function MessagesManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function MessagesManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return MessagesManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (MessagesManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, MessagesManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, MessagesManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), MessagesManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", MessagesManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), MessagesManager_regeneratorDefine2(u), MessagesManager_regeneratorDefine2(u, o, "Generator"), MessagesManager_regeneratorDefine2(u, n, function () { return this; }), MessagesManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (MessagesManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function MessagesManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } MessagesManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { MessagesManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, MessagesManager_regeneratorDefine2(e, r, n, t); }
function MessagesManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function MessagesManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { MessagesManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { MessagesManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function MessagesManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function MessagesManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, MessagesManager_toPropertyKey(o.key), o); } }
function MessagesManager_createClass(e, r, t) { return r && MessagesManager_defineProperties(e.prototype, r), t && MessagesManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function MessagesManager_defineProperty(e, r, t) { return (r = MessagesManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function MessagesManager_toPropertyKey(t) { var i = MessagesManager_toPrimitive(t, "string"); return "symbol" == MessagesManager_typeof(i) ? i : i + ""; }
function MessagesManager_toPrimitive(t, r) { if ("object" != MessagesManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != MessagesManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var MessagesManager = /*#__PURE__*/function () {
  function MessagesManager(tracker) {
    var _this = this;
    MessagesManager_classCallCheck(this, MessagesManager);
    MessagesManager_defineProperty(this, "roomHistories", new IndexedCollection());
    MessagesManager_defineProperty(this, "followedTopics", new IndexedCollection());
    MessagesManager_defineProperty(this, "followedTopicsPromises", new PromiseRegistry());
    MessagesManager_defineProperty(this, "deferredSession", new DeferredTask());
    this.tracker = tracker;
    this.tracker.client.on('Session', function (ev) {
      return _this.handleSession(ev);
    });
    this.tracker.client.on('RoomJoined', function (ev) {
      return _this.handleRoomJoin(ev);
    });
    this.tracker.client.on('NewTopic', function (ev) {
      return _this.handleNewTopic(ev);
    });
    this.tracker.client.on('FollowedTopicUpdated', function (ev) {
      return _this.handleFollowedTopicUpdated(ev);
    });
    this.tracker.client.on('TopicFollowed', function (ev) {
      return _this.handleTopicFollowed(ev);
    });
    this.tracker.client.on('TopicUnfollowed', function (ev) {
      return _this.handleTopicUnfollowed(ev);
    });
    this.tracker.client.on('NewMessage', function (ev) {
      return _this.handleNewMessage(ev);
    });
    this.tracker.client.on('RoomDeleted', function (ev) {
      return _this.handleRoomDeleted(ev);
    });
    this.tracker.client.on('RoomLeft', function (ev) {
      return _this.handleRoomLeft(ev);
    });
    this.tracker.client.on('TopicDeleted', function (ev) {
      return _this.handleTopicDeleted(ev);
    });
  }

  /**
   * Get history manager for given room ID.
   */
  return MessagesManager_createClass(MessagesManager, [{
    key: "getRoomHistory",
    value: (function () {
      var _getRoomHistory = MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee(roomId) {
        return MessagesManager_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.deferredSession.promise;
            case 1:
              return _context.a(2, this.roomHistories.get(roomId));
          }
        }, _callee, this);
      }));
      function getRoomHistory(_x) {
        return _getRoomHistory.apply(this, arguments);
      }
      return getRoomHistory;
    }()
    /**
     * Cache followed topics for all joined rooms in a space and fetch them in bulk if necessary.
     * Then you can get them using getRoomFollowedTopics().
     * @see getRoomFollowedTopics
     */
    )
  }, {
    key: "cacheSpaceFollowedTopics",
    value: (function () {
      var _cacheSpaceFollowedTopics = MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee2(spaceId) {
        var _this2 = this;
        var roomIds, resultPromise, result, _t;
        return MessagesManager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _t = spaceId;
              if (!_t) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return this.tracker.spaces.get();
            case 1:
              _t = !_context2.v.has(spaceId);
            case 2:
              if (!_t) {
                _context2.n = 3;
                break;
              }
              throw new Error("You are not in space ".concat(spaceId));
            case 3:
              _context2.n = 4;
              return this.tracker.rooms.get();
            case 4:
              roomIds = _context2.v.findBy('spaceId', spaceId).items.map(function (room) {
                return room.id;
              });
              if (roomIds.length) {
                _context2.n = 5;
                break;
              }
              return _context2.a(2);
            case 5:
              resultPromise = this.tracker.client.send('GetFollowedTopics', {
                location: {
                  spaceId: spaceId
                }
              });
              roomIds.forEach(function (roomId) {
                return _this2.followedTopicsPromises.register(resultPromise, roomId);
              });
              _context2.n = 6;
              return resultPromise;
            case 6:
              result = _context2.v;
              if (!result.error) {
                _context2.n = 7;
                break;
              }
              throw result.error;
            case 7:
              this.setFollowedTopicsArray(roomIds, result.data.followedTopics);
            case 8:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function cacheSpaceFollowedTopics(_x2) {
        return _cacheSpaceFollowedTopics.apply(this, arguments);
      }
      return cacheSpaceFollowedTopics;
    }()
    /**
     * Get followed topics for the given room.
     * @return Undefined if you are not in the room, collection otherwise.
     */
    )
  }, {
    key: "getRoomFollowedTopics",
    value: (function () {
      var _getRoomFollowedTopics = MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee4(roomId) {
        var _this3 = this;
        return MessagesManager_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.tracker.rooms.get();
            case 1:
              if (_context4.v.has(roomId)) {
                _context4.n = 2;
                break;
              }
              return _context4.a(2, undefined);
            case 2:
              if (this.followedTopics.has(roomId)) {
                _context4.n = 3;
                break;
              }
              if (this.followedTopicsPromises.notExist(roomId)) {
                this.followedTopicsPromises.registerByFunction(/*#__PURE__*/MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee3() {
                  var result;
                  return MessagesManager_regenerator().w(function (_context3) {
                    while (1) switch (_context3.n) {
                      case 0:
                        _context3.n = 1;
                        return _this3.tracker.client.send('GetFollowedTopics', {
                          location: {
                            roomId: roomId
                          }
                        });
                      case 1:
                        result = _context3.v;
                        if (!result.error) {
                          _context3.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        _this3.setFollowedTopicsArray([roomId], result.data.followedTopics);
                      case 3:
                        return _context3.a(2);
                    }
                  }, _callee3);
                })), roomId);
              }
              _context4.n = 3;
              return this.followedTopicsPromises.get(roomId);
            case 3:
              return _context4.a(2, this.followedTopics.get(roomId));
          }
        }, _callee4, this);
      }));
      function getRoomFollowedTopics(_x3) {
        return _getRoomFollowedTopics.apply(this, arguments);
      }
      return getRoomFollowedTopics;
    }()
    /**
     * Batch acknowledge all missed messages from any topics in given room.
     */
    )
  }, {
    key: "ackRoomFollowedTopics",
    value: (function () {
      var _ackRoomFollowedTopics = MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee5(roomId) {
        var collection, _iterator, _step, followedTopic, _t2;
        return MessagesManager_regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.n = 1;
              return this.getRoomFollowedTopics(roomId);
            case 1:
              collection = _context5.v;
              if (collection) {
                _context5.n = 2;
                break;
              }
              return _context5.a(2);
            case 2:
              _iterator = MessagesManager_createForOfIteratorHelper(collection.items);
              _context5.p = 3;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context5.n = 6;
                break;
              }
              followedTopic = _step.value;
              if (!followedTopic.missed) {
                _context5.n = 5;
                break;
              }
              _context5.n = 5;
              return this.tracker.client.send('Ack', {
                location: followedTopic.location
              });
            case 5:
              _context5.n = 4;
              break;
            case 6:
              _context5.n = 8;
              break;
            case 7:
              _context5.p = 7;
              _t2 = _context5.v;
              _iterator.e(_t2);
            case 8:
              _context5.p = 8;
              _iterator.f();
              return _context5.f(8);
            case 9:
              return _context5.a(2);
          }
        }, _callee5, this, [[3, 7, 8, 9]]);
      }));
      function ackRoomFollowedTopics(_x4) {
        return _ackRoomFollowedTopics.apply(this, arguments);
      }
      return ackRoomFollowedTopics;
    }()
    /**
     * Calculate missed messages from any topic in given room.
     * @return Undefined if you are not in room.
     */
    )
  }, {
    key: "calculateRoomMissedMessages",
    value: (function () {
      var _calculateRoomMissedMessages = MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee6(roomId) {
        var collection;
        return MessagesManager_regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return this.getRoomFollowedTopics(roomId);
            case 1:
              collection = _context6.v;
              if (!collection) {
                _context6.n = 2;
                break;
              }
              return _context6.a(2, collection.items.reduce(function (previousValue, currentValue) {
                var _currentValue$missed;
                return previousValue + ((_currentValue$missed = currentValue.missed) !== null && _currentValue$missed !== void 0 ? _currentValue$missed : 0);
              }, 0));
            case 2:
              return _context6.a(2, undefined);
          }
        }, _callee6, this);
      }));
      function calculateRoomMissedMessages(_x5) {
        return _calculateRoomMissedMessages.apply(this, arguments);
      }
      return calculateRoomMissedMessages;
    }()
    /**
     * For internal use. If you want to delete the message, execute a proper command on client object.
     * @internal
     */
    )
  }, {
    key: "_deleteByTopicIds",
    value: function _deleteByTopicIds(roomId) {
      var _this$followedTopics$;
      for (var _len = arguments.length, topicIds = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        topicIds[_key - 1] = arguments[_key];
      }
      (_this$followedTopics$ = this.followedTopics.get(roomId)) === null || _this$followedTopics$ === void 0 || _this$followedTopics$["delete"].apply(_this$followedTopics$, topicIds);
    }
  }, {
    key: "createHistoryForNewRoom",
    value: function createHistoryForNewRoom(room) {
      this.roomHistories.set([room.id, new RoomMessagesHistory(room, this.tracker)]);
    }
  }, {
    key: "handleNewMessage",
    value: function handleNewMessage(ev) {
      this.updateLocallyFollowedTopicOnNewMessage(ev);
    }
  }, {
    key: "handleFollowedTopicUpdated",
    value: function handleFollowedTopicUpdated(ev) {
      var _this$followedTopics$2;
      (_this$followedTopics$2 = this.followedTopics.get(ev.followedTopic.location.roomId)) === null || _this$followedTopics$2 === void 0 || _this$followedTopics$2.set(ev.followedTopic);
    }
  }, {
    key: "handleTopicFollowed",
    value: function handleTopicFollowed(ev) {
      this.setFollowedTopicsArray([ev.followedTopic.location.roomId], [ev.followedTopic]);
    }
  }, {
    key: "handleTopicUnfollowed",
    value: function handleTopicUnfollowed(ev) {
      var _this$followedTopics$3;
      (_this$followedTopics$3 = this.followedTopics.get(ev.location.roomId)) === null || _this$followedTopics$3 === void 0 || _this$followedTopics$3["delete"](ev.location.topicId);
    }
  }, {
    key: "handleRoomDeleted",
    value: function handleRoomDeleted(ev) {
      this.roomHistories["delete"](ev.id);
      this.clearRoomFollowedTopicsStructures(ev.id);
    }
  }, {
    key: "handleRoomJoin",
    value: function handleRoomJoin(ev) {
      this.createHistoryForNewRoom(ev.room);
      this.clearRoomFollowedTopicsStructures(ev.room.id);
    }
  }, {
    key: "handleRoomLeft",
    value: function handleRoomLeft(ev) {
      this.roomHistories["delete"](ev.id);
      this.clearRoomFollowedTopicsStructures(ev.id);
    }
  }, {
    key: "handleNewTopic",
    value: function () {
      var _handleNewTopic = MessagesManager_asyncToGenerator(/*#__PURE__*/MessagesManager_regenerator().m(function _callee7(ev) {
        var result, followedTopic;
        return MessagesManager_regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              if (!this.followedTopics.has(ev.roomId)) {
                _context7.n = 2;
                break;
              }
              _context7.n = 1;
              return this.tracker.client.send('GetFollowedTopics', {
                location: {
                  roomId: ev.roomId,
                  topicId: ev.topic.id
                }
              });
            case 1:
              result = _context7.v;
              followedTopic = result.data.followedTopics[0];
              if (followedTopic) {
                this.followedTopics.get(ev.roomId).set(followedTopic);
              }
            case 2:
              return _context7.a(2);
          }
        }, _callee7, this);
      }));
      function handleNewTopic(_x6) {
        return _handleNewTopic.apply(this, arguments);
      }
      return handleNewTopic;
    }()
  }, {
    key: "handleTopicDeleted",
    value: function handleTopicDeleted(ev) {
      var _this$followedTopics$4;
      (_this$followedTopics$4 = this.followedTopics.get(ev.location.roomId)) === null || _this$followedTopics$4 === void 0 || _this$followedTopics$4["delete"](ev.location.topicId);
    }
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      var _this4 = this;
      this.followedTopics.deleteAll();
      this.followedTopicsPromises.forgetAll();
      this.roomHistories.deleteAll();
      ev.state.rooms.forEach(function (room) {
        return _this4.createHistoryForNewRoom(room);
      });
      this.deferredSession.resolve();
    }
  }, {
    key: "updateLocallyFollowedTopicOnNewMessage",
    value: function updateLocallyFollowedTopicOnNewMessage(ev) {
      var _this$tracker$me;
      var roomFollowedTopics = this.followedTopics.get(ev.message.location.roomId);
      var followedTopic = roomFollowedTopics === null || roomFollowedTopics === void 0 ? void 0 : roomFollowedTopics.get(ev.message.location.topicId);
      if (!roomFollowedTopics || !followedTopic || ev.message.type === 'Ephemeral') {
        // Skip if we don't follow this room or targeted topic or the message is ephemeral
        return;
      }
      var isMe = ev.message.author.user.id === ((_this$tracker$me = this.tracker.me) === null || _this$tracker$me === void 0 ? void 0 : _this$tracker$me.id);
      var update;
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
      roomFollowedTopics.set(MessagesManager_objectSpread(MessagesManager_objectSpread({}, followedTopic), update));
    }
  }, {
    key: "setFollowedTopicsArray",
    value: function setFollowedTopicsArray(roomIds, followedTopics) {
      var _this5 = this;
      var roomToTopics = {};

      // Reassign followed topics to limit collection change event emit
      followedTopics.forEach(function (followedTopic) {
        var _followedTopic$locati, _roomToTopics$_follow;
        (_roomToTopics$_follow = roomToTopics[_followedTopic$locati = followedTopic.location.roomId]) !== null && _roomToTopics$_follow !== void 0 ? _roomToTopics$_follow : roomToTopics[_followedTopic$locati] = [];
        roomToTopics[followedTopic.location.roomId].push(followedTopic);
      });
      roomIds.forEach(function (roomId) {
        if (!_this5.followedTopics.has(roomId)) {
          _this5.followedTopics.set([roomId, new ObservableIndexedObjectCollection(function (followedTopic) {
            return followedTopic.location.topicId;
          })]);
        }
        if (roomToTopics[roomId]) {
          var _this5$followedTopics;
          (_this5$followedTopics = _this5.followedTopics.get(roomId)).set.apply(_this5$followedTopics, MessagesManager_toConsumableArray(roomToTopics[roomId]));
        }
      });
    }
  }, {
    key: "clearRoomFollowedTopicsStructures",
    value: function clearRoomFollowedTopicsStructures(roomId) {
      this.followedTopics["delete"](roomId);
      this.followedTopicsPromises.forget(roomId);
    }
  }]);
}();
;// ./src/state-tracker/RoomsManager.ts
function RoomsManager_typeof(o) { "@babel/helpers - typeof"; return RoomsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, RoomsManager_typeof(o); }
function RoomsManager_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function RoomsManager_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? RoomsManager_ownKeys(Object(t), !0).forEach(function (r) { RoomsManager_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : RoomsManager_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function RoomsManager_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = RoomsManager_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function RoomsManager_toConsumableArray(r) { return RoomsManager_arrayWithoutHoles(r) || RoomsManager_iterableToArray(r) || RoomsManager_unsupportedIterableToArray(r) || RoomsManager_nonIterableSpread(); }
function RoomsManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function RoomsManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return RoomsManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? RoomsManager_arrayLikeToArray(r, a) : void 0; } }
function RoomsManager_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function RoomsManager_arrayWithoutHoles(r) { if (Array.isArray(r)) return RoomsManager_arrayLikeToArray(r); }
function RoomsManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function RoomsManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return RoomsManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (RoomsManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, RoomsManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, RoomsManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), RoomsManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", RoomsManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), RoomsManager_regeneratorDefine2(u), RoomsManager_regeneratorDefine2(u, o, "Generator"), RoomsManager_regeneratorDefine2(u, n, function () { return this; }), RoomsManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (RoomsManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function RoomsManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } RoomsManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { RoomsManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, RoomsManager_regeneratorDefine2(e, r, n, t); }
function RoomsManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function RoomsManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { RoomsManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { RoomsManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function RoomsManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function RoomsManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, RoomsManager_toPropertyKey(o.key), o); } }
function RoomsManager_createClass(e, r, t) { return r && RoomsManager_defineProperties(e.prototype, r), t && RoomsManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function RoomsManager_defineProperty(e, r, t) { return (r = RoomsManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function RoomsManager_toPropertyKey(t) { var i = RoomsManager_toPrimitive(t, "string"); return "symbol" == RoomsManager_typeof(i) ? i : i + ""; }
function RoomsManager_toPrimitive(t, r) { if ("object" != RoomsManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != RoomsManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var RoomsManager = /*#__PURE__*/function () {
  function RoomsManager(tracker) {
    var _this = this;
    RoomsManager_classCallCheck(this, RoomsManager);
    RoomsManager_defineProperty(this, "messages", void 0);
    RoomsManager_defineProperty(this, "list", new ObservableIndexedObjectCollection('id'));
    RoomsManager_defineProperty(this, "topics", new IndexedCollection());
    RoomsManager_defineProperty(this, "members", new IndexedCollection());
    RoomsManager_defineProperty(this, "deferredSession", new DeferredTask());
    RoomsManager_defineProperty(this, "membersPromises", new PromiseRegistry());
    RoomsManager_defineProperty(this, "topicsPromises", new PromiseRegistry());
    this.tracker = tracker;
    this.messages = new MessagesManager(tracker);
    this.tracker.client.on('NewMessage', function (ev) {
      return _this.handleNewMessage(ev);
    });
    this.tracker.client.on('NewTopic', function (ev) {
      return _this.handleNewTopic(ev);
    });
    this.tracker.client.on('TopicDeleted', function (ev) {
      return _this.handleTopicDeleted(ev);
    });
    this.tracker.client.on('RoomJoined', function (ev) {
      return _this.handleRoomJoined(ev);
    });
    this.tracker.client.on('RoomLeft', function (ev) {
      return _this.handleRoomLeft(ev);
    });
    this.tracker.client.on('RoomUpdated', function (ev) {
      return _this.handleRoomUpdated(ev);
    });
    this.tracker.client.on('RoomDeleted', function (ev) {
      return _this.handleRoomDeleted(ev);
    });
    this.tracker.client.on('TopicUpdated', function (ev) {
      return _this.handleTopicUpdated(ev);
    });
    this.tracker.client.on('RoomMemberJoined', function (ev) {
      return _this.handleRoomMemberJoined(ev);
    });
    this.tracker.client.on('RoomMemberLeft', function (ev) {
      return _this.handleRoomMemberLeft(ev);
    });
    this.tracker.client.on('RoomMembers', function (ev) {
      return _this.handleRoomMembers(ev);
    });
    this.tracker.client.on('RoomMemberUpdated', function (ev) {
      return _this.handleRoomMemberUpdated(ev);
    });
    this.tracker.client.on('SpaceMemberLeft', function (ev) {
      return _this.handleSpaceMemberLeft(ev);
    });
    this.tracker.client.on('SpaceMemberUpdated', function (ev) {
      return _this.handleSpaceMemberUpdated(ev);
    });
    this.tracker.client.on('SpaceDeleted', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    this.tracker.client.on('SpaceLeft', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    this.tracker.client.on('UserUpdated', function (ev) {
      return _this.handleUserUpdated(ev);
    });
    this.tracker.client.on('Session', function (ev) {
      return _this.handleSession(ev);
    });
  }

  /**
   * Get collection of room members.
   */
  return RoomsManager_createClass(RoomsManager, [{
    key: "getMembers",
    value: (function () {
      var _getMembers = RoomsManager_asyncToGenerator(/*#__PURE__*/RoomsManager_regenerator().m(function _callee2(roomId) {
        var _this2 = this;
        return RoomsManager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.membersPromises.notExist(roomId)) {
                this.membersPromises.registerByFunction(/*#__PURE__*/RoomsManager_asyncToGenerator(/*#__PURE__*/RoomsManager_regenerator().m(function _callee() {
                  var result;
                  return RoomsManager_regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        _context.n = 1;
                        return _this2.tracker.client.send('GetRoomMembers', {
                          id: roomId
                        });
                      case 1:
                        result = _context.v;
                        if (!result.error) {
                          _context.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        _this2.handleRoomMembers(result.data);
                      case 3:
                        return _context.a(2);
                    }
                  }, _callee);
                })), roomId);
              }
              _context2.n = 1;
              return this.membersPromises.get(roomId);
            case 1:
              return _context2.a(2, this.members.get(roomId));
          }
        }, _callee2, this);
      }));
      function getMembers(_x) {
        return _getMembers.apply(this, arguments);
      }
      return getMembers;
    }()
    /**
     * Get a room member representing the current user.
     */
    )
  }, {
    key: "getMe",
    value: (function () {
      var _getMe = RoomsManager_asyncToGenerator(/*#__PURE__*/RoomsManager_regenerator().m(function _callee3(roomId) {
        var userId, members;
        return RoomsManager_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.tracker.getMe();
            case 1:
              userId = _context3.v.id;
              if (this.list.has(roomId)) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, undefined);
            case 2:
              _context3.n = 3;
              return this.getMembers(roomId);
            case 3:
              members = _context3.v;
              return _context3.a(2, members === null || members === void 0 ? void 0 : members.items.find(function (member) {
                var _member$user$id, _member$user;
                return ((_member$user$id = (_member$user = member.user) === null || _member$user === void 0 ? void 0 : _member$user.id) !== null && _member$user$id !== void 0 ? _member$user$id : member.spaceMember.user.id) === userId;
              }));
          }
        }, _callee3, this);
      }));
      function getMe(_x2) {
        return _getMe.apply(this, arguments);
      }
      return getMe;
    }()
    /**
     * Get collection of all the rooms you are in.
     */
    )
  }, {
    key: "get",
    value: (function () {
      var _get = RoomsManager_asyncToGenerator(/*#__PURE__*/RoomsManager_regenerator().m(function _callee4() {
        return RoomsManager_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.deferredSession.promise;
            case 1:
              return _context4.a(2, this.list);
          }
        }, _callee4, this);
      }));
      function get() {
        return _get.apply(this, arguments);
      }
      return get;
    }()
    /**
     * Get a collection of locally cached Topic objects for given room.
     * You can pass topic ids as second argument, to try to fetch them from the server.
     */
    )
  }, {
    key: "getTopics",
    value: (function () {
      var _getTopics = RoomsManager_asyncToGenerator(/*#__PURE__*/RoomsManager_regenerator().m(function _callee5(roomId, tryToFetchTopicIds) {
        var _this3 = this;
        var canFetch, idsToFetch, promise, _iterator, _step, topicId, _t;
        return RoomsManager_regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.n = 1;
              return this.deferredSession.promise;
            case 1:
              if (!(tryToFetchTopicIds !== null && tryToFetchTopicIds !== void 0 && tryToFetchTopicIds.length)) {
                _context5.n = 8;
                break;
              }
              // Topic can be fetched if it isn't already cached and fetch is not already in progress
              canFetch = function canFetch(topicId) {
                var _this3$topics$get;
                return !((_this3$topics$get = _this3.topics.get(roomId)) !== null && _this3$topics$get !== void 0 && _this3$topics$get.has(topicId)) && !_this3.topicsPromises.has(roomId + topicId);
              };
              idsToFetch = tryToFetchTopicIds.filter(canFetch);
              if (idsToFetch.length) {
                promise = this.tracker.client.send('GetTopics', {
                  roomId: roomId,
                  topicIds: idsToFetch
                }).then(function (result) {
                  var _this3$topics$get2;
                  return (_this3$topics$get2 = _this3.topics.get(result.data.location.roomId)) === null || _this3$topics$get2 === void 0 ? void 0 : _this3$topics$get2.set.apply(_this3$topics$get2, RoomsManager_toConsumableArray(result.data.topics));
                });
                idsToFetch.forEach(function (topicId) {
                  return _this3.topicsPromises.register(promise, roomId + topicId);
                });
              }
              _iterator = RoomsManager_createForOfIteratorHelper(tryToFetchTopicIds);
              _context5.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context5.n = 5;
                break;
              }
              topicId = _step.value;
              _context5.n = 4;
              return this.topicsPromises.get(roomId + topicId);
            case 4:
              _context5.n = 3;
              break;
            case 5:
              _context5.n = 7;
              break;
            case 6:
              _context5.p = 6;
              _t = _context5.v;
              _iterator.e(_t);
            case 7:
              _context5.p = 7;
              _iterator.f();
              return _context5.f(7);
            case 8:
              return _context5.a(2, this.topics.get(roomId));
          }
        }, _callee5, this, [[2, 6, 7, 8]]);
      }));
      function getTopics(_x3, _x4) {
        return _getTopics.apply(this, arguments);
      }
      return getTopics;
    }())
  }, {
    key: "deleteRoom",
    value: function deleteRoom() {
      var _this$list, _this$members, _this$membersPromises, _this$topics;
      for (var _len = arguments.length, roomIds = new Array(_len), _key = 0; _key < _len; _key++) {
        roomIds[_key] = arguments[_key];
      }
      (_this$list = this.list)["delete"].apply(_this$list, roomIds);
      (_this$members = this.members)["delete"].apply(_this$members, roomIds);
      (_this$membersPromises = this.membersPromises).forget.apply(_this$membersPromises, roomIds);
      for (var _i = 0, _roomIds = roomIds; _i < _roomIds.length; _i++) {
        var _this$topics$get$item, _this$topics$get, _this$messages;
        var roomId = _roomIds[_i];
        var topicIds = (_this$topics$get$item = (_this$topics$get = this.topics.get(roomId)) === null || _this$topics$get === void 0 ? void 0 : _this$topics$get.items.map(function (topic) {
          return topic.id;
        })) !== null && _this$topics$get$item !== void 0 ? _this$topics$get$item : [];
        (_this$messages = this.messages)._deleteByTopicIds.apply(_this$messages, [roomId].concat(RoomsManager_toConsumableArray(topicIds)));
      }
      (_this$topics = this.topics)["delete"].apply(_this$topics, roomIds);
    }
  }, {
    key: "deleteRoomsBySpaceId",
    value: function deleteRoomsBySpaceId(spaceId) {
      this.deleteRoom.apply(this, RoomsManager_toConsumableArray(this.list.findBy('spaceId', spaceId).items.map(function (room) {
        return room.id;
      })));
    }
  }, {
    key: "handleSpaceMemberUpdated",
    value: function handleSpaceMemberUpdated(ev) {
      // Update members of rooms related to this space
      var _iterator2 = RoomsManager_createForOfIteratorHelper(this.list.findBy('spaceId', ev.spaceId).items),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var room = _step2.value;
          var roomMembers = this.members.get(room.id);
          if (!roomMembers || !roomMembers.has(ev.userId)) {
            // Skip update if member list for this room is not loaded
            // or user is not in room
            continue;
          }
          var roomMember = roomMembers.get(ev.userId);
          var user = roomMember.spaceMember.user;

          // Update space member but first fill user object (it's null in event object)
          roomMember.spaceMember = RoomsManager_objectSpread(RoomsManager_objectSpread({}, ev.member), {}, {
            user: user
          });
          roomMembers.set(roomMember);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "handleSpaceMemberLeft",
    value: function handleSpaceMemberLeft(ev) {
      var _this4 = this;
      this.list.findBy('spaceId', ev.spaceId).items.forEach(function (room) {
        var _this4$members$get;
        return (_this4$members$get = _this4.members.get(room.id)) === null || _this4$members$get === void 0 ? void 0 : _this4$members$get["delete"](ev.userId);
      });
    }
  }, {
    key: "handleRoomMemberUpdated",
    value: function handleRoomMemberUpdated(ev) {
      var _member$spaceMember$u, _member$spaceMember;
      if (!this.members.has(ev.roomId)) {
        // We do not track member list for this room.
        return;
      }
      var members = this.members.get(ev.roomId);
      var member = members.get(ev.userId);
      var newMember = ev.member;
      var user = (_member$spaceMember$u = (_member$spaceMember = member.spaceMember) === null || _member$spaceMember === void 0 ? void 0 : _member$spaceMember.user) !== null && _member$spaceMember$u !== void 0 ? _member$spaceMember$u : member.user;

      // Preserving user object, because it's not included in event
      if (newMember.spaceMember) {
        newMember.spaceMember.user = user;
      } else {
        newMember.user = user;
      }
      members.set(newMember);
    }
  }, {
    key: "handleSpaceDeleted",
    value: function handleSpaceDeleted(ev) {
      this.deleteRoomsBySpaceId(ev.id);
    }
  }, {
    key: "handleTopicDeleted",
    value: function handleTopicDeleted(ev) {
      var _room$defaultTopic;
      var collection = this.topics.get(ev.location.roomId);
      collection["delete"](ev.location.topicId);
      var room = this.list.get(ev.location.roomId);
      if (((_room$defaultTopic = room.defaultTopic) === null || _room$defaultTopic === void 0 ? void 0 : _room$defaultTopic.id) === ev.location.topicId) {
        this.list.set(RoomsManager_objectSpread(RoomsManager_objectSpread({}, room), {}, {
          defaultTopic: null
        }));
      }
    }
  }, {
    key: "handleNewTopic",
    value: function handleNewTopic(ev) {
      this.addJoinedRoomTopics(ev.roomId, ev.topic);
    }
  }, {
    key: "addJoinedRoomTopics",
    value: function addJoinedRoomTopics(roomId) {
      for (var _len2 = arguments.length, topics = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        topics[_key2 - 1] = arguments[_key2];
      }
      if (this.topics.has(roomId)) {
        var _this$topics$get2;
        (_this$topics$get2 = this.topics.get(roomId)).set.apply(_this$topics$get2, topics);
      } else {
        this.topics.set([roomId, new ObservableIndexedObjectCollection('id', topics)]);
      }
    }
  }, {
    key: "handleRoomJoined",
    value: function handleRoomJoined(ev) {
      this.addJoinedRooms(ev.room);
    }
  }, {
    key: "handleRoomUpdated",
    value: function handleRoomUpdated(ev) {
      if (this.list.has(ev.room.id)) {
        this.list.set(ev.room);
      }
    }
  }, {
    key: "handleRoomDeleted",
    value: function handleRoomDeleted(ev) {
      this.deleteRoom(ev.id);
    }
  }, {
    key: "handleTopicUpdated",
    value: function handleTopicUpdated(ev) {
      var _this$topics$get3;
      var room = this.list.get(ev.location.roomId);
      if ((_this$topics$get3 = this.topics.get(ev.location.roomId)) !== null && _this$topics$get3 !== void 0 && _this$topics$get3.has(ev.topic.id)) {
        this.topics.get(ev.location.roomId).set(ev.topic);
      }
      if (room.defaultTopic.id === ev.topic.id) {
        room.defaultTopic = ev.topic;
        this.list.set(room);
      }
    }
  }, {
    key: "addJoinedRooms",
    value: function addJoinedRooms() {
      var _this$list2;
      for (var _len3 = arguments.length, rooms = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        rooms[_key3] = arguments[_key3];
      }
      for (var _i2 = 0, _rooms = rooms; _i2 < _rooms.length; _i2++) {
        var room = _rooms[_i2];
        if (room.defaultTopic) {
          this.addJoinedRoomTopics(room.id, room.defaultTopic);
        }
        if (room.type === 'Pm' && room.recipients) {
          // Treat PM recipients as normal room members.
          // We are registering fake promise in `memberPromises`
          // because GetMembers are not supported for PM rooms.
          this.handleRoomMembers({
            id: room.id,
            members: room.recipients.map(function (user) {
              return {
                user: user,
                spaceMember: null,
                roles: null,
                customColor: null,
                customNick: null,
                extras: ''
              };
            })
          });
          this.membersPromises.register(Promise.resolve(), room.id);
        }
      }
      (_this$list2 = this.list).set.apply(_this$list2, rooms);
    }
  }, {
    key: "handleRoomLeft",
    value: function handleRoomLeft(ev) {
      this.deleteRoom(ev.id);
    }
  }, {
    key: "handleRoomMemberJoined",
    value: function handleRoomMemberJoined(ev) {
      if (this.members.has(ev.roomId)) {
        this.members.get(ev.roomId).set(ev.member);
      }
    }
  }, {
    key: "handleRoomMemberLeft",
    value: function handleRoomMemberLeft(ev) {
      if (this.members.has(ev.roomId)) {
        this.members.get(ev.roomId)["delete"](ev.userId);
      }
    }
  }, {
    key: "handleRoomMembers",
    value: function handleRoomMembers(ev) {
      if (!this.members.has(ev.id)) {
        this.members.set([ev.id, new ObservableIndexedObjectCollection(function (member) {
          var _member$user$id2, _member$user2;
          return (_member$user$id2 = (_member$user2 = member.user) === null || _member$user2 === void 0 ? void 0 : _member$user2.id) !== null && _member$user$id2 !== void 0 ? _member$user$id2 : member.spaceMember.user.id;
        }, ev.members)]);
      }
    }
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      this.list.deleteAll();
      this.topics.deleteAll();
      this.topicsPromises.forgetAll();
      this.members.deleteAll();
      this.membersPromises.forgetAll();
      this.addJoinedRooms.apply(this, RoomsManager_toConsumableArray(ev.state.rooms));
      this.deferredSession.resolve();
    }
  }, {
    key: "handleUserUpdated",
    value: function handleUserUpdated(ev) {
      var _this$list3;
      // Update room members users
      this.members.items.forEach(function (members) {
        var member = members.get(ev.user.id);
        if (!member) {
          // Skip room; updated user is not here
          return;
        }
        var newMember = RoomsManager_objectSpread({}, member);
        if (member.user) {
          newMember.user = ev.user;
        } else {
          newMember.spaceMember.user = ev.user;
        }
        members.set(newMember);
      });

      // Update recipients users
      var newRooms = [];
      this.list.items.forEach(function (room) {
        var _room$recipients;
        if ((_room$recipients = room.recipients) !== null && _room$recipients !== void 0 && _room$recipients.some(function (user) {
          return user.id === ev.user.id;
        })) {
          room.recipients = room.recipients.map(function (user) {
            return user.id === ev.user.id ? ev.user : user;
          });
          newRooms.push(RoomsManager_objectSpread({}, room));
        }
      });
      (_this$list3 = this.list).set.apply(_this$list3, newRooms);
    }
  }, {
    key: "handleNewMessage",
    value: function handleNewMessage(ev) {
      var _room$defaultTopic2;
      var topics = this.topics.get(ev.message.location.roomId);
      var topic = topics === null || topics === void 0 ? void 0 : topics.get(ev.message.location.topicId);
      if (!topic) {
        return; // No topic found, nothing to update
      }
      var newTopic = RoomsManager_objectSpread(RoomsManager_objectSpread({}, topic), {}, {
        messageCount: topic.messageCount + 1,
        lastMessage: ev.message
      });
      topics.set(newTopic);
      var room = this.list.get(ev.message.location.roomId);
      if (((_room$defaultTopic2 = room.defaultTopic) === null || _room$defaultTopic2 === void 0 ? void 0 : _room$defaultTopic2.id) === ev.message.location.topicId) {
        this.list.set(RoomsManager_objectSpread(RoomsManager_objectSpread({}, room), {}, {
          defaultTopic: newTopic
        }));
      }
    }
  }]);
}();
;// ./src/state-tracker/functions.ts
function reorderRolesOnPriorityUpdate(allRoles, oldRole, updatedRole) {
  // If the priority has changed, adjust the rest of roles
  var increased = updatedRole.priority - oldRole.priority > 0;
  var decreased = !increased;
  var changedRoles = [];
  allRoles.forEach(function (role) {
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
  var _member$user, _spaceMember;
  return (_member$user = member.user) !== null && _member$user !== void 0 ? _member$user : (_spaceMember = member.spaceMember) === null || _spaceMember === void 0 ? void 0 : _spaceMember.user;
}
;// ./src/state-tracker/SpacesManager.ts
function SpacesManager_typeof(o) { "@babel/helpers - typeof"; return SpacesManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, SpacesManager_typeof(o); }
function SpacesManager_toConsumableArray(r) { return SpacesManager_arrayWithoutHoles(r) || SpacesManager_iterableToArray(r) || SpacesManager_unsupportedIterableToArray(r) || SpacesManager_nonIterableSpread(); }
function SpacesManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function SpacesManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return SpacesManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? SpacesManager_arrayLikeToArray(r, a) : void 0; } }
function SpacesManager_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function SpacesManager_arrayWithoutHoles(r) { if (Array.isArray(r)) return SpacesManager_arrayLikeToArray(r); }
function SpacesManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function SpacesManager_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function SpacesManager_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? SpacesManager_ownKeys(Object(t), !0).forEach(function (r) { SpacesManager_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : SpacesManager_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function SpacesManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return SpacesManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (SpacesManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, SpacesManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, SpacesManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), SpacesManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", SpacesManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), SpacesManager_regeneratorDefine2(u), SpacesManager_regeneratorDefine2(u, o, "Generator"), SpacesManager_regeneratorDefine2(u, n, function () { return this; }), SpacesManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (SpacesManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function SpacesManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } SpacesManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { SpacesManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, SpacesManager_regeneratorDefine2(e, r, n, t); }
function SpacesManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function SpacesManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { SpacesManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { SpacesManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function SpacesManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function SpacesManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, SpacesManager_toPropertyKey(o.key), o); } }
function SpacesManager_createClass(e, r, t) { return r && SpacesManager_defineProperties(e.prototype, r), t && SpacesManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function SpacesManager_defineProperty(e, r, t) { return (r = SpacesManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function SpacesManager_toPropertyKey(t) { var i = SpacesManager_toPrimitive(t, "string"); return "symbol" == SpacesManager_typeof(i) ? i : i + ""; }
function SpacesManager_toPrimitive(t, r) { if ("object" != SpacesManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != SpacesManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var SpacesManager = /*#__PURE__*/function () {
  function SpacesManager(tracker) {
    var _this = this;
    SpacesManager_classCallCheck(this, SpacesManager);
    SpacesManager_defineProperty(this, "list", new ObservableIndexedObjectCollection('id'));
    SpacesManager_defineProperty(this, "roles", new IndexedCollection());
    SpacesManager_defineProperty(this, "rooms", new IndexedCollection());
    SpacesManager_defineProperty(this, "roomIdToSpaceId", new IndexedCollection());
    SpacesManager_defineProperty(this, "members", new IndexedCollection());
    SpacesManager_defineProperty(this, "deferredSession", new DeferredTask());
    SpacesManager_defineProperty(this, "roomsPromises", new PromiseRegistry());
    SpacesManager_defineProperty(this, "membersPromises", new PromiseRegistry());
    this.tracker = tracker;
    this.tracker.client.on('NewRoom', function (ev) {
      return _this.handleNewRoom(ev);
    });
    this.tracker.client.on('RoomDeleted', function (ev) {
      return _this.handleRoomDeleted(ev);
    });
    this.tracker.client.on('RoomUpdated', function (ev) {
      return _this.handleRoomUpdated(ev);
    });
    this.tracker.client.on('SpaceDeleted', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    this.tracker.client.on('SpaceUpdated', function (ev) {
      return _this.handleSpaceUpdated(ev);
    });
    this.tracker.client.on('SpaceJoined', function (ev) {
      return _this.handleSpaceJoined(ev);
    });
    this.tracker.client.on('SpaceLeft', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    this.tracker.client.on('SpaceMemberJoined', function (ev) {
      return _this.handleSpaceMemberJoined(ev);
    });
    this.tracker.client.on('SpaceMemberLeft', function (ev) {
      return _this.handleSpaceMemberLeft(ev);
    });
    this.tracker.client.on('SpaceMembers', function (ev) {
      return _this.handleSpaceMembers(ev);
    });
    this.tracker.client.on('SpaceRooms', function (ev) {
      return _this.handleSpaceRooms(ev);
    });
    this.tracker.client.on('RoomSummaryUpdated', function (ev) {
      return _this.handleRoomSummaryUpdated(ev);
    });
    this.tracker.client.on('SpaceMemberUpdated', function (ev) {
      return _this.handleSpaceMemberUpdated(ev);
    });
    this.tracker.client.on('UserUpdated', function (ev) {
      return _this.handleUserUpdated(ev);
    });
    this.tracker.client.on('NewRole', function (ev) {
      return _this.handleNewRole(ev);
    });
    this.tracker.client.on('RoleDeleted', function (ev) {
      return _this.handleRoleDeleted(ev);
    });
    this.tracker.client.on('RoleUpdated', function (ev) {
      return _this.handleRoleUpdated(ev);
    });
    this.tracker.client.on('Session', function (ev) {
      return _this.handleSession(ev);
    });
  }

  /**
   * Get collection of all the spaces you are in.
   */
  return SpacesManager_createClass(SpacesManager, [{
    key: "get",
    value: (function () {
      var _get = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee() {
        return SpacesManager_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.deferredSession.promise;
            case 1:
              return _context.a(2, this.list);
          }
        }, _callee, this);
      }));
      function get() {
        return _get.apply(this, arguments);
      }
      return get;
    }()
    /**
     * Get collection of space roles.
     */
    )
  }, {
    key: "getRoles",
    value: (function () {
      var _getRoles = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee2(spaceId) {
        return SpacesManager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.deferredSession.promise;
            case 1:
              return _context2.a(2, this.roles.get(spaceId));
          }
        }, _callee2, this);
      }));
      function getRoles(_x) {
        return _getRoles.apply(this, arguments);
      }
      return getRoles;
    }()
    /**
     * Get collection of the all available rooms inside given space.
     */
    )
  }, {
    key: "getRooms",
    value: (function () {
      var _getRooms = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee4(spaceId) {
        var _this2 = this;
        return SpacesManager_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              if (this.roomsPromises.notExist(spaceId)) {
                this.roomsPromises.registerByFunction(/*#__PURE__*/SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee3() {
                  var result;
                  return SpacesManager_regenerator().w(function (_context3) {
                    while (1) switch (_context3.n) {
                      case 0:
                        _context3.n = 1;
                        return _this2.tracker.client.send('GetSpaceRooms', {
                          id: spaceId
                        });
                      case 1:
                        result = _context3.v;
                        if (!result.error) {
                          _context3.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        _this2.handleSpaceRooms(result.data);
                      case 3:
                        return _context3.a(2);
                    }
                  }, _callee3);
                })), spaceId);
              }
              _context4.n = 1;
              return this.roomsPromises.get(spaceId);
            case 1:
              return _context4.a(2, this.rooms.get(spaceId));
          }
        }, _callee4, this);
      }));
      function getRooms(_x2) {
        return _getRooms.apply(this, arguments);
      }
      return getRooms;
    }()
    /**
     * Get collection of space members.
     */
    )
  }, {
    key: "getMembers",
    value: (function () {
      var _getMembers = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee6(spaceId) {
        var _this3 = this;
        return SpacesManager_regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (this.membersPromises.notExist(spaceId)) {
                this.membersPromises.registerByFunction(/*#__PURE__*/SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee5() {
                  var result;
                  return SpacesManager_regenerator().w(function (_context5) {
                    while (1) switch (_context5.n) {
                      case 0:
                        _context5.n = 1;
                        return _this3.tracker.client.send('GetSpaceMembers', {
                          id: spaceId
                        });
                      case 1:
                        result = _context5.v;
                        if (!result.error) {
                          _context5.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        _this3.handleSpaceMembers(result.data);
                      case 3:
                        return _context5.a(2);
                    }
                  }, _callee5);
                })), spaceId);
              }
              _context6.n = 1;
              return this.membersPromises.get(spaceId);
            case 1:
              return _context6.a(2, this.members.get(spaceId));
          }
        }, _callee6, this);
      }));
      function getMembers(_x3) {
        return _getMembers.apply(this, arguments);
      }
      return getMembers;
    }()
    /**
     * Get a space member representing the current user.
     */
    )
  }, {
    key: "getMe",
    value: (function () {
      var _getMe = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee7(spaceId) {
        var userId, members;
        return SpacesManager_regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return this.tracker.getMe();
            case 1:
              userId = _context7.v.id;
              if (this.list.has(spaceId)) {
                _context7.n = 2;
                break;
              }
              return _context7.a(2, undefined);
            case 2:
              _context7.n = 3;
              return this.getMembers(spaceId);
            case 3:
              members = _context7.v;
              return _context7.a(2, members === null || members === void 0 ? void 0 : members.items.find(function (member) {
                return member.user.id === userId;
              }));
          }
        }, _callee7, this);
      }));
      function getMe(_x4) {
        return _getMe.apply(this, arguments);
      }
      return getMe;
    }())
  }, {
    key: "handleNewRole",
    value: function handleNewRole(ev) {
      var collection = this.roles.get(ev.spaceId);
      collection.set(ev.role);
      this.list.get(ev.spaceId).roles = collection.items;
    }
  }, {
    key: "handleNewRoom",
    value: function handleNewRoom(ev) {
      var _this$rooms$get;
      (_this$rooms$get = this.rooms.get(ev.spaceId)) === null || _this$rooms$get === void 0 || _this$rooms$get.set(ev.summary);
      this.roomIdToSpaceId.set([ev.summary.id, ev.spaceId]);
    }
  }, {
    key: "handleRoomUpdated",
    value: function handleRoomUpdated(ev) {
      if (ev.room.spaceId && this.rooms.has(ev.room.spaceId)) {
        var rooms = this.rooms.get(ev.room.spaceId);
        rooms.set(SpacesManager_objectSpread(SpacesManager_objectSpread({}, rooms.get(ev.room.id)), {}, {
          name: ev.room.name,
          description: ev.room.description
        }));
      }
    }
  }, {
    key: "handleRoomDeleted",
    value: function () {
      var _handleRoomDeleted = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee8(ev) {
        var _this$rooms$get2;
        var spaceId, space, spaceChanged;
        return SpacesManager_regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              spaceId = this.roomIdToSpaceId.get(ev.id);
              this.roomIdToSpaceId["delete"](ev.id);
              if (spaceId) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2);
            case 1:
              space = this.list.get(spaceId);
              spaceChanged = false;
              (_this$rooms$get2 = this.rooms.get(spaceId)) === null || _this$rooms$get2 === void 0 || _this$rooms$get2["delete"](ev.id);
              if (space.systemRoom === ev.id) {
                space.systemRoom = null;
                spaceChanged = true;
              }
              if (space.defaultRooms.includes(ev.id)) {
                space.defaultRooms = space.defaultRooms.filter(function (roomId) {
                  return roomId !== ev.id;
                });
                spaceChanged = true;
              }
              if (spaceChanged) {
                this.list.set(space);
              }
            case 2:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function handleRoomDeleted(_x5) {
        return _handleRoomDeleted.apply(this, arguments);
      }
      return handleRoomDeleted;
    }()
  }, {
    key: "handleRoleDeleted",
    value: function handleRoleDeleted(ev) {
      var collection = this.roles.get(ev.spaceId);
      collection["delete"](ev.id);
      this.list.get(ev.spaceId).roles = collection.items;
    }
  }, {
    key: "handleSpaceUpdated",
    value: function handleSpaceUpdated(ev) {
      this.list.set(ev.space);
    }
  }, {
    key: "handleSpaceDeleted",
    value: function handleSpaceDeleted(ev) {
      var _this$rooms$get$items, _this$rooms$get3, _this$roomIdToSpaceId;
      var roomIds = (_this$rooms$get$items = (_this$rooms$get3 = this.rooms.get(ev.id)) === null || _this$rooms$get3 === void 0 ? void 0 : _this$rooms$get3.items.map(function (item) {
        return item.id;
      })) !== null && _this$rooms$get$items !== void 0 ? _this$rooms$get$items : [];
      (_this$roomIdToSpaceId = this.roomIdToSpaceId)["delete"].apply(_this$roomIdToSpaceId, SpacesManager_toConsumableArray(roomIds));
      this.roles["delete"](ev.id);
      this.members["delete"](ev.id);
      this.membersPromises.forget(ev.id);
      this.rooms["delete"](ev.id);
      this.roomsPromises.forget(ev.id);
      this.list["delete"](ev.id);
    }
  }, {
    key: "handleSpaceJoined",
    value: function handleSpaceJoined(ev) {
      this.addJoinedSpaces(ev.space);
    }
  }, {
    key: "addJoinedSpaces",
    value: function addJoinedSpaces() {
      var _this$roles, _this$list;
      for (var _len = arguments.length, spaces = new Array(_len), _key = 0; _key < _len; _key++) {
        spaces[_key] = arguments[_key];
      }
      (_this$roles = this.roles).set.apply(_this$roles, SpacesManager_toConsumableArray(spaces.map(function (space) {
        return [space.id, new ObservableIndexedObjectCollection('id', space.roles)];
      })));
      (_this$list = this.list).set.apply(_this$list, spaces);
    }
  }, {
    key: "handleSpaceMemberJoined",
    value: function handleSpaceMemberJoined(ev) {
      if (this.members.has(ev.spaceId)) {
        this.members.get(ev.spaceId).set(ev.member);
      }
    }
  }, {
    key: "handleSpaceMemberLeft",
    value: function handleSpaceMemberLeft(ev) {
      if (this.members.has(ev.spaceId)) {
        this.members.get(ev.spaceId)["delete"](ev.userId);
      }
    }
  }, {
    key: "handleSpaceMembers",
    value: function handleSpaceMembers(ev) {
      if (!this.members.has(ev.id)) {
        this.members.set([ev.id, new ObservableIndexedObjectCollection(function (member) {
          return member === null || member === void 0 ? void 0 : member.user.id;
        }, ev.members)]);
      }
    }
  }, {
    key: "handleSpaceRooms",
    value: function handleSpaceRooms(ev) {
      var _this4 = this;
      if (!this.rooms.has(ev.id)) {
        this.rooms.set([ev.id, new ObservableIndexedObjectCollection('id', ev.summaries)]);
        ev.summaries.forEach(function (summary) {
          return _this4.roomIdToSpaceId.set([summary.id, ev.id]);
        });
      }
    }
  }, {
    key: "handleRoomSummaryUpdated",
    value: function () {
      var _handleRoomSummaryUpdated = SpacesManager_asyncToGenerator(/*#__PURE__*/SpacesManager_regenerator().m(function _callee9(ev) {
        var spaceId, summariesPromise, summaries, oldSummary, newSummary;
        return SpacesManager_regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              spaceId = this.roomIdToSpaceId.get(ev.summary.id);
              summariesPromise = this.roomsPromises.get(spaceId);
              /**
               * Update summary only if the list was already loaded.
               * RoomSummaryUpdated event has a partial summary, so we need to update the existing summary by merging it.
               */
              if (!(spaceId && summariesPromise)) {
                _context9.n = 2;
                break;
              }
              _context9.n = 1;
              return summariesPromise;
            case 1:
              summaries = this.rooms.get(spaceId);
              oldSummary = summaries.get(ev.summary.id);
              if (oldSummary) {
                newSummary = SpacesManager_objectSpread(SpacesManager_objectSpread({}, oldSummary), ev.summary);
              } else {
                newSummary = ev.summary;
              }
              summaries.set(newSummary);
            case 2:
              return _context9.a(2);
          }
        }, _callee9, this);
      }));
      function handleRoomSummaryUpdated(_x6) {
        return _handleRoomSummaryUpdated.apply(this, arguments);
      }
      return handleRoomSummaryUpdated;
    }()
  }, {
    key: "handleSpaceMemberUpdated",
    value: function handleSpaceMemberUpdated(ev) {
      if (this.members.has(ev.spaceId)) {
        var members = this.members.get(ev.spaceId);
        var member = members.get(ev.userId);
        members.set(SpacesManager_objectSpread(SpacesManager_objectSpread({}, ev.member), {}, {
          user: member.user
        }));
      }
    }
  }, {
    key: "handleRoleUpdated",
    value: function handleRoleUpdated(ev) {
      var _this$roles$get;
      var roles = this.roles.get(ev.spaceId);
      var oldRole = roles.get(ev.role.id);
      var newRole = ev.role;
      var rolesToUpdate = [newRole];
      if (oldRole.priority !== newRole.priority) {
        rolesToUpdate.push.apply(rolesToUpdate, SpacesManager_toConsumableArray(reorderRolesOnPriorityUpdate(roles.items, oldRole, newRole)));
      }
      (_this$roles$get = this.roles.get(ev.spaceId)).set.apply(_this$roles$get, rolesToUpdate);
    }
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      this.list.deleteAll();
      this.roles.deleteAll();
      this.rooms.deleteAll();
      this.roomsPromises.forgetAll();
      this.members.deleteAll();
      this.membersPromises.forgetAll();
      this.roomIdToSpaceId.deleteAll();
      this.addJoinedSpaces.apply(this, SpacesManager_toConsumableArray(ev.state.spaces));
      this.deferredSession.resolve();
    }
  }, {
    key: "handleUserUpdated",
    value: function handleUserUpdated(ev) {
      this.members.items.forEach(function (members) {
        var member = members.get(ev.user.id);
        if (!member) {
          // Skip space; updated user is not here
          return;
        }
        members.set(SpacesManager_objectSpread(SpacesManager_objectSpread({}, member), {}, {
          user: ev.user
        }));
      });
    }
  }]);
}();
;// ./src/Permissions.ts
function Permissions_typeof(o) { "@babel/helpers - typeof"; return Permissions_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Permissions_typeof(o); }
function Permissions_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Permissions_toPropertyKey(o.key), o); } }
function Permissions_createClass(e, r, t) { return r && Permissions_defineProperties(e.prototype, r), t && Permissions_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Permissions_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Permissions_defineProperty(e, r, t) { return (r = Permissions_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Permissions_toPropertyKey(t) { var i = Permissions_toPrimitive(t, "string"); return "symbol" == Permissions_typeof(i) ? i : i + ""; }
function Permissions_toPrimitive(t, r) { if ("object" != Permissions_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Permissions_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Layer = /*#__PURE__*/function (Layer) {
  Layer[Layer["Global"] = 0] = "Global";
  Layer[Layer["Space"] = 1] = "Space";
  Layer[Layer["Room"] = 2] = "Room";
  Layer[Layer["Topic"] = 3] = "Topic";
  return Layer;
}({});
var PermissionDefinition = /*#__PURE__*/Permissions_createClass(function PermissionDefinition() {
  Permissions_classCallCheck(this, PermissionDefinition);
  Permissions_defineProperty(this, "value", void 0);
  Permissions_defineProperty(this, "maxLayer", void 0);
});
var Permissions = /*#__PURE__*/function () {
  function Permissions() {
    Permissions_classCallCheck(this, Permissions);
  }
  return Permissions_createClass(Permissions, null, [{
    key: "getNames",
    value: function getNames() {
      return Object.keys(this.list);
    }
  }, {
    key: "getByName",
    value: function getByName(name) {
      return this.list[name];
    }
  }, {
    key: "canBeDefinedOnLayer",
    value: function canBeDefinedOnLayer(permissionName, layer) {
      var def = this.getByName(permissionName);
      if (!def) {
        throw new Error("Invalid permission name: ".concat(permissionName));
      }
      return layer <= this.getByName(permissionName).maxLayer;
    }
  }]);
}();
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
  },
  ChangeOwnColor: {
    value: 1 << 18,
    maxLayer: Layer.Room
  }
});
;// ./src/state-tracker/PermissionsManager.ts
function PermissionsManager_typeof(o) { "@babel/helpers - typeof"; return PermissionsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PermissionsManager_typeof(o); }
function PermissionsManager_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = PermissionsManager_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function PermissionsManager_toConsumableArray(r) { return PermissionsManager_arrayWithoutHoles(r) || PermissionsManager_iterableToArray(r) || PermissionsManager_unsupportedIterableToArray(r) || PermissionsManager_nonIterableSpread(); }
function PermissionsManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function PermissionsManager_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function PermissionsManager_arrayWithoutHoles(r) { if (Array.isArray(r)) return PermissionsManager_arrayLikeToArray(r); }
function PermissionsManager_slicedToArray(r, e) { return PermissionsManager_arrayWithHoles(r) || PermissionsManager_iterableToArrayLimit(r, e) || PermissionsManager_unsupportedIterableToArray(r, e) || PermissionsManager_nonIterableRest(); }
function PermissionsManager_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function PermissionsManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return PermissionsManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? PermissionsManager_arrayLikeToArray(r, a) : void 0; } }
function PermissionsManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function PermissionsManager_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function PermissionsManager_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function PermissionsManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return PermissionsManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (PermissionsManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, PermissionsManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, PermissionsManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), PermissionsManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", PermissionsManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), PermissionsManager_regeneratorDefine2(u), PermissionsManager_regeneratorDefine2(u, o, "Generator"), PermissionsManager_regeneratorDefine2(u, n, function () { return this; }), PermissionsManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (PermissionsManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function PermissionsManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } PermissionsManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { PermissionsManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, PermissionsManager_regeneratorDefine2(e, r, n, t); }
function PermissionsManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function PermissionsManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { PermissionsManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { PermissionsManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function PermissionsManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function PermissionsManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, PermissionsManager_toPropertyKey(o.key), o); } }
function PermissionsManager_createClass(e, r, t) { return r && PermissionsManager_defineProperties(e.prototype, r), t && PermissionsManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function PermissionsManager_callSuper(t, o, e) { return o = PermissionsManager_getPrototypeOf(o), PermissionsManager_possibleConstructorReturn(t, PermissionsManager_isNativeReflectConstruct() ? Reflect.construct(o, e || [], PermissionsManager_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function PermissionsManager_possibleConstructorReturn(t, e) { if (e && ("object" == PermissionsManager_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return PermissionsManager_assertThisInitialized(t); }
function PermissionsManager_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function PermissionsManager_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (PermissionsManager_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function PermissionsManager_superPropGet(t, o, e, r) { var p = PermissionsManager_get(PermissionsManager_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function PermissionsManager_get() { return PermissionsManager_get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = PermissionsManager_superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, PermissionsManager_get.apply(null, arguments); }
function PermissionsManager_superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = PermissionsManager_getPrototypeOf(t));); return t; }
function PermissionsManager_getPrototypeOf(t) { return PermissionsManager_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, PermissionsManager_getPrototypeOf(t); }
function PermissionsManager_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && PermissionsManager_setPrototypeOf(t, e); }
function PermissionsManager_setPrototypeOf(t, e) { return PermissionsManager_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, PermissionsManager_setPrototypeOf(t, e); }
function PermissionsManager_defineProperty(e, r, t) { return (r = PermissionsManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function PermissionsManager_toPropertyKey(t) { var i = PermissionsManager_toPrimitive(t, "string"); return "symbol" == PermissionsManager_typeof(i) ? i : i + ""; }
function PermissionsManager_toPrimitive(t, r) { if ("object" != PermissionsManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != PermissionsManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




var getOvId = function getOvId(location, target) {
  return [location.spaceId, location.roomId, location.topicId, target === null || target === void 0 ? void 0 : target.type, target === null || target === void 0 ? void 0 : target.userId, target === null || target === void 0 ? void 0 : target.roleId].filter(Boolean).join('/');
};
var getOvIdByObject = function getOvIdByObject(overwrites) {
  return getOvId(overwrites.location, overwrites.target);
};
var PermissionsManager = /*#__PURE__*/function (_EventTarget) {
  function PermissionsManager(tracker) {
    var _this;
    PermissionsManager_classCallCheck(this, PermissionsManager);
    _this = PermissionsManager_callSuper(this, PermissionsManager);
    PermissionsManager_defineProperty(_this, "overwrites", new IndexedCollection());
    PermissionsManager_defineProperty(_this, "overwritesPromises", new PromiseRegistry());
    _this.tracker = tracker;
    _this.tracker.client.on('PermissionOverwrites', function (ev) {
      return _this.handlePermissionOverwrites(ev);
    });
    _this.tracker.client.on('PermissionOverwritesUpdated', function (ev) {
      return _this.handlePermissionOverwrites(ev);
    });
    _this.tracker.client.on('SpaceDeleted', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    _this.tracker.client.on('SpaceLeft', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    _this.tracker.client.on('RoomDeleted', function (ev) {
      return _this.handleRoomDeleted(ev);
    });
    _this.tracker.client.on('RoomLeft', function (ev) {
      return _this.handleRoomDeleted(ev);
    });
    _this.tracker.client.on('TopicDeleted', function (ev) {
      return _this.handleTopicDeleted(ev);
    });
    _this.tracker.client.on('RoleDeleted', function (ev) {
      return _this.handleRoleDeleted(ev);
    });
    _this.tracker.client.on('SpaceMemberUpdated', function (ev) {
      return _this.handleSpaceMemberUpdated(ev);
    });
    _this.tracker.client.on('RoomMemberUpdated', function (ev) {
      return _this.handleRoomMemberUpdated(ev);
    });
    _this.tracker.client.on('Session', function (ev) {
      return _this.handleSession(ev);
    });
    return _this;
  }
  PermissionsManager_inherits(PermissionsManager, _EventTarget);
  return PermissionsManager_createClass(PermissionsManager, [{
    key: "getOverwrites",
    value: function () {
      var _getOverwrites = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee2(location, target) {
        var _this2 = this;
        var id;
        return PermissionsManager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              this.validateLocation(location);
              id = getOvId(location, target);
              if (this.overwritesPromises.notExist(id)) {
                this.overwritesPromises.registerByFunction(/*#__PURE__*/PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee() {
                  var result;
                  return PermissionsManager_regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        _context.n = 1;
                        return _this2.tracker.client.send('GetPermissionOverwrites', {
                          location: location,
                          target: target
                        });
                      case 1:
                        result = _context.v;
                        if (!result.error) {
                          _context.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        _this2.handlePermissionOverwrites(result.data);
                      case 3:
                        return _context.a(2);
                    }
                  }, _callee);
                })), id);
              }
              _context2.n = 1;
              return this.overwritesPromises.get(id);
            case 1:
              return _context2.a(2, this.overwrites.get(id));
          }
        }, _callee2, this);
      }));
      function getOverwrites(_x, _x2) {
        return _getOverwrites.apply(this, arguments);
      }
      return getOverwrites;
    }()
  }, {
    key: "on",
    value: function on(eventName, handler) {
      return PermissionsManager_superPropGet(PermissionsManager, "on", this, 3)([eventName, handler]);
    }
  }, {
    key: "check",
    value: function () {
      var _check = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee3(permissionNames, location) {
        var ownedPermissions, missing;
        return PermissionsManager_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (permissionNames.length) {
                _context3.n = 1;
                break;
              }
              throw new Error('Permission names array cannot be empty');
            case 1:
              _context3.n = 2;
              return this.calculatePermissions(location);
            case 2:
              ownedPermissions = _context3.v;
              missing = [];
              permissionNames.forEach(function (name) {
                if (~ownedPermissions & Permissions.getByName(name).value) {
                  missing.push(name);
                }
              });
              return _context3.a(2, {
                ok: missing.length === 0,
                hasAll: missing.length === 0,
                hasAny: missing.length < permissionNames.length,
                missing: missing
              });
          }
        }, _callee3, this);
      }));
      function check(_x3, _x4) {
        return _check.apply(this, arguments);
      }
      return check;
    }()
  }, {
    key: "calculatePermissions",
    value: function () {
      var _calculatePermissions = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee4(location) {
        var _spaceMember$roles, _roomMember$roles, _yield$this$tracker$s, _yield$this$tracker$r, _yield$this$tracker$r2;
        var userId, _yield$this$fetchMemb, _yield$this$fetchMemb2, spaceMember, roomMember, userRoles, promises, filterLocation, _filterLocation, _t, _t2, _t3, _t4, _t5, _t6, _t7, _t8, _t9, _t0, _t1, _t10, _t11;
        return PermissionsManager_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              this.validateLocation(location);
              _context4.n = 1;
              return this.tracker.getMe();
            case 1:
              userId = _context4.v.id;
              _context4.n = 2;
              return this.fetchMembersOrFail(location);
            case 2:
              _yield$this$fetchMemb = _context4.v;
              _yield$this$fetchMemb2 = PermissionsManager_slicedToArray(_yield$this$fetchMemb, 2);
              spaceMember = _yield$this$fetchMemb2[0];
              roomMember = _yield$this$fetchMemb2[1];
              userRoles = [].concat(PermissionsManager_toConsumableArray((_spaceMember$roles = spaceMember === null || spaceMember === void 0 ? void 0 : spaceMember.roles) !== null && _spaceMember$roles !== void 0 ? _spaceMember$roles : []), PermissionsManager_toConsumableArray((_roomMember$roles = roomMember === null || roomMember === void 0 ? void 0 : roomMember.roles) !== null && _roomMember$roles !== void 0 ? _roomMember$roles : []));
              promises = [
              // Global user overwrites
              this.getOverwrites({}, {
                type: 'User',
                userId: userId
              }).then(function (v) {
                return v.overwrites;
              })];
              _t = location.spaceId;
              if (!_t) {
                _context4.n = 6;
                break;
              }
              _context4.n = 3;
              return this.tracker.spaces.get();
            case 3:
              _t4 = _yield$this$tracker$s = _context4.v;
              _t3 = _t4 !== null;
              if (!_t3) {
                _context4.n = 4;
                break;
              }
              _t3 = _yield$this$tracker$s !== void 0;
            case 4:
              _t2 = _t3;
              if (!_t2) {
                _context4.n = 5;
                break;
              }
              _t2 = _yield$this$tracker$s.has(location.spaceId);
            case 5:
              _t = _t2;
            case 6:
              if (!_t) {
                _context4.n = 7;
                break;
              }
              filterLocation = {
                spaceId: location.spaceId
              };
              promises.push(this.collectRoleOverwrites(filterLocation, userRoles));
              promises.push(this.getOverwrites(filterLocation, {
                type: 'User',
                userId: userId
              }).then(function (v) {
                return v.overwrites;
              }));
            case 7:
              _t5 = location.roomId;
              if (!_t5) {
                _context4.n = 11;
                break;
              }
              _context4.n = 8;
              return this.tracker.rooms.get();
            case 8:
              _t8 = _yield$this$tracker$r = _context4.v;
              _t7 = _t8 !== null;
              if (!_t7) {
                _context4.n = 9;
                break;
              }
              _t7 = _yield$this$tracker$r !== void 0;
            case 9:
              _t6 = _t7;
              if (!_t6) {
                _context4.n = 10;
                break;
              }
              _t6 = _yield$this$tracker$r.has(location.roomId);
            case 10:
              _t5 = _t6;
            case 11:
              if (!_t5) {
                _context4.n = 12;
                break;
              }
              _filterLocation = {
                spaceId: location.spaceId,
                roomId: location.roomId
              };
              if (userRoles.length) {
                promises.push(this.collectRoleOverwrites(_filterLocation, userRoles));
              }
              promises.push(this.getOverwrites(_filterLocation, {
                type: 'User',
                userId: userId
              }).then(function (v) {
                return v.overwrites;
              }));
            case 12:
              _t9 = location.topicId;
              if (!_t9) {
                _context4.n = 16;
                break;
              }
              _context4.n = 13;
              return this.tracker.rooms.getTopics(location.roomId);
            case 13:
              _t10 = _yield$this$tracker$r2 = _context4.v;
              _t1 = _t10 !== null;
              if (!_t1) {
                _context4.n = 14;
                break;
              }
              _t1 = _yield$this$tracker$r2 !== void 0;
            case 14:
              _t0 = _t1;
              if (!_t0) {
                _context4.n = 15;
                break;
              }
              _t0 = _yield$this$tracker$r2.has(location.topicId);
            case 15:
              _t9 = _t0;
            case 16:
              if (!_t9) {
                _context4.n = 17;
                break;
              }
              if (userRoles.length) {
                promises.push(this.collectRoleOverwrites(location, userRoles));
              }
              promises.push(this.getOverwrites(location, {
                type: 'User',
                userId: userId
              }).then(function (v) {
                return v.overwrites;
              }));
            case 17:
              _t11 = this;
              _context4.n = 18;
              return Promise.all(promises);
            case 18:
              return _context4.a(2, _t11.resolveOverwritesHierarchy.call(_t11, _context4.v));
          }
        }, _callee4, this);
      }));
      function calculatePermissions(_x5) {
        return _calculatePermissions.apply(this, arguments);
      }
      return calculatePermissions;
    }()
  }, {
    key: "handlePermissionOverwrites",
    value: function handlePermissionOverwrites(ev) {
      this.overwrites.set([getOvIdByObject(ev), ev]);
      this.emit('change');
    }
  }, {
    key: "handleSpaceDeleted",
    value: function handleSpaceDeleted(ev) {
      var _this$overwritesPromi;
      var ids = this.deleteOverwritesByIdPrefix(getOvId({
        spaceId: ev.id
      }));
      (_this$overwritesPromi = this.overwritesPromises).forget.apply(_this$overwritesPromi, PermissionsManager_toConsumableArray(ids));
    }
  }, {
    key: "handleRoomDeleted",
    value: function () {
      var _handleRoomDeleted = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee5(ev) {
        var room, _this$overwritesPromi2, ids;
        return PermissionsManager_regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.tracker.rooms.get();
            case 1:
              room = _context5.v.get(ev.id);
              if (room) {
                ids = this.deleteOverwritesByIdPrefix(getOvId({
                  spaceId: room.spaceId,
                  roomId: room.id
                }));
                (_this$overwritesPromi2 = this.overwritesPromises).forget.apply(_this$overwritesPromi2, PermissionsManager_toConsumableArray(ids));
              }
            case 2:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function handleRoomDeleted(_x6) {
        return _handleRoomDeleted.apply(this, arguments);
      }
      return handleRoomDeleted;
    }()
  }, {
    key: "handleTopicDeleted",
    value: function handleTopicDeleted(ev) {
      var _this$overwritesPromi3;
      var ids = this.deleteOverwritesByIdPrefix(getOvId(ev.location));
      (_this$overwritesPromi3 = this.overwritesPromises).forget.apply(_this$overwritesPromi3, PermissionsManager_toConsumableArray(ids));
    }
  }, {
    key: "handleRoleDeleted",
    value: function handleRoleDeleted(ev) {
      var _this$overwritesPromi4;
      var ids = this.deleteOverwritesByIdPrefix(getOvId({
        spaceId: ev.spaceId
      }, {
        type: 'Role',
        roleId: ev.id
      }));
      (_this$overwritesPromi4 = this.overwritesPromises).forget.apply(_this$overwritesPromi4, PermissionsManager_toConsumableArray(ids));
    }
  }, {
    key: "handleSpaceMemberUpdated",
    value: function handleSpaceMemberUpdated(ev) {
      var _this$tracker$me;
      if (ev.userId === ((_this$tracker$me = this.tracker.me) === null || _this$tracker$me === void 0 ? void 0 : _this$tracker$me.id)) {
        // User roles in space could potentially have changed
        this.emit('change');
      }
    }
  }, {
    key: "handleRoomMemberUpdated",
    value: function handleRoomMemberUpdated(ev) {
      var _this$tracker$me2;
      if (ev.userId === ((_this$tracker$me2 = this.tracker.me) === null || _this$tracker$me2 === void 0 ? void 0 : _this$tracker$me2.id)) {
        // User roles in room could potentially have changed
        this.emit('change');
      }
    }

    /**
     * @return Matched and deleted ids
     */
  }, {
    key: "deleteOverwritesByIdPrefix",
    value: function deleteOverwritesByIdPrefix(prefix) {
      var _this3 = this;
      var ids = [];
      this.overwrites.items.forEach(function (overwrites) {
        var id = getOvIdByObject(overwrites);
        if (id.startsWith(prefix)) {
          ids.push(id);
          _this3.overwrites["delete"](id);
        }
      });
      return ids;
    }
  }, {
    key: "collectRoleOverwrites",
    value: function () {
      var _collectRoleOverwrites = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee6(location, userRoles) {
        var _this4 = this;
        var roleOverwrites;
        return PermissionsManager_regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return Promise.all(userRoles.map(function (roleId) {
                return _this4.getOverwrites(location, {
                  type: 'Role',
                  roleId: roleId
                });
              }));
            case 1:
              roleOverwrites = _context6.v;
              return _context6.a(2, this.resolveOverwritesFromRolesByOrder(location.spaceId, roleOverwrites));
          }
        }, _callee6, this);
      }));
      function collectRoleOverwrites(_x7, _x8) {
        return _collectRoleOverwrites.apply(this, arguments);
      }
      return collectRoleOverwrites;
    }()
  }, {
    key: "resolveOverwritesFromRolesByOrder",
    value: function () {
      var _resolveOverwritesFromRolesByOrder = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee7(spaceId, overwrites) {
        var allows, denies, roles, sortedOverwrites, permissionsLength;
        return PermissionsManager_regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              allows = 0, denies = 0;
              _context7.n = 1;
              return this.tracker.spaces.getRoles(spaceId);
            case 1:
              roles = _context7.v;
              sortedOverwrites = overwrites.sort(function (a, b) {
                return roles.get(a.target.roleId).priority - roles.get(b.target.roleId).priority;
              }); // Max length of bit word
              permissionsLength = overwrites.reduce(function (previousValue, currentValue) {
                var _currentValue$overwri, _currentValue$overwri2, _currentValue$overwri3, _currentValue$overwri4;
                return Math.max(previousValue, (_currentValue$overwri = (_currentValue$overwri2 = currentValue.overwrites.allow) === null || _currentValue$overwri2 === void 0 ? void 0 : _currentValue$overwri2.toString(2).length) !== null && _currentValue$overwri !== void 0 ? _currentValue$overwri : 0, (_currentValue$overwri3 = (_currentValue$overwri4 = currentValue.overwrites.deny) === null || _currentValue$overwri4 === void 0 ? void 0 : _currentValue$overwri4.toString(2).length) !== null && _currentValue$overwri3 !== void 0 ? _currentValue$overwri3 : 0);
              }, 0);
              sortedOverwrites.forEach(function (overwriteEvent) {
                var _overwrites$deny$toSt, _overwrites$deny, _overwrites$allow$toS, _overwrites$allow;
                var overwrites = overwriteEvent.overwrites;
                var revDecDenies = (_overwrites$deny$toSt = (_overwrites$deny = overwrites.deny) === null || _overwrites$deny === void 0 ? void 0 : _overwrites$deny.toString(2).split('').reverse().join('')) !== null && _overwrites$deny$toSt !== void 0 ? _overwrites$deny$toSt : '';
                var revDecAllows = (_overwrites$allow$toS = (_overwrites$allow = overwrites.allow) === null || _overwrites$allow === void 0 ? void 0 : _overwrites$allow.toString(2).split('').reverse().join('')) !== null && _overwrites$allow$toS !== void 0 ? _overwrites$allow$toS : '';
                for (var i = 0; i < permissionsLength; i++) {
                  var _revDecDenies$i, _revDecAllows$i;
                  var deny = parseInt((_revDecDenies$i = revDecDenies[i]) !== null && _revDecDenies$i !== void 0 ? _revDecDenies$i : '0');
                  var allow = parseInt((_revDecAllows$i = revDecAllows[i]) !== null && _revDecAllows$i !== void 0 ? _revDecAllows$i : '0');
                  if (deny) {
                    denies |= 1 << i;
                  }
                  if (allow) {
                    allows |= 1 << i;
                  }
                }
              });
              return _context7.a(2, {
                allow: allows,
                deny: denies
              });
          }
        }, _callee7, this);
      }));
      function resolveOverwritesFromRolesByOrder(_x9, _x0) {
        return _resolveOverwritesFromRolesByOrder.apply(this, arguments);
      }
      return resolveOverwritesFromRolesByOrder;
    }()
  }, {
    key: "resolveOverwritesHierarchy",
    value: function resolveOverwritesHierarchy(permissionOverwritesValues) {
      var result = 0;
      var _iterator = PermissionsManager_createForOfIteratorHelper(permissionOverwritesValues),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var value = _step.value;
          if (value.allow & Permissions.getByName('Root').value) {
            return this.getRootAccessValue();
          }
          result = result & ~value.deny | value.allow;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return result;
    }
  }, {
    key: "getRootAccessValue",
    value: function getRootAccessValue() {
      var result = 0;
      var _iterator2 = PermissionsManager_createForOfIteratorHelper(Permissions.getNames()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var name = _step2.value;
          result |= Permissions.getByName(name).value;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return result;
    }
  }, {
    key: "fetchMembersOrFail",
    value: function () {
      var _fetchMembersOrFail = PermissionsManager_asyncToGenerator(/*#__PURE__*/PermissionsManager_regenerator().m(function _callee8(location) {
        var results, spaceFail, roomFail, layer;
        return PermissionsManager_regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return Promise.all([location.spaceId ? this.tracker.spaces.getMe(location.spaceId) : null, location.roomId ? this.tracker.rooms.getMe(location.roomId) : null]);
            case 1:
              results = _context8.v;
              spaceFail = location.spaceId && !results[0];
              roomFail = location.roomId && !results[1];
              if (!(spaceFail || roomFail)) {
                _context8.n = 2;
                break;
              }
              layer = spaceFail ? "space (".concat(location.spaceId, ")") : "room (".concat(location.roomId, ")");
              throw new Error("Attempting to calculate permissions for a ".concat(layer, " that the user does not belong to"));
            case 2:
              return _context8.a(2, results);
          }
        }, _callee8, this);
      }));
      function fetchMembersOrFail(_x1) {
        return _fetchMembersOrFail.apply(this, arguments);
      }
      return fetchMembersOrFail;
    }()
  }, {
    key: "validateLocation",
    value: function validateLocation(location) {
      if (location.topicId && !location.roomId) {
        throw new Error('Corrupted arguments hierarchy');
      }
    }
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      this.overwrites.deleteAll();
      this.overwritesPromises.forgetAll();
    }
  }]);
}(EventTarget);
;// ./src/state-tracker/EmoticonsManager.ts
function EmoticonsManager_typeof(o) { "@babel/helpers - typeof"; return EmoticonsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, EmoticonsManager_typeof(o); }
function EmoticonsManager_toConsumableArray(r) { return EmoticonsManager_arrayWithoutHoles(r) || EmoticonsManager_iterableToArray(r) || EmoticonsManager_unsupportedIterableToArray(r) || EmoticonsManager_nonIterableSpread(); }
function EmoticonsManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function EmoticonsManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return EmoticonsManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? EmoticonsManager_arrayLikeToArray(r, a) : void 0; } }
function EmoticonsManager_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function EmoticonsManager_arrayWithoutHoles(r) { if (Array.isArray(r)) return EmoticonsManager_arrayLikeToArray(r); }
function EmoticonsManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function EmoticonsManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return EmoticonsManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (EmoticonsManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, EmoticonsManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, EmoticonsManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), EmoticonsManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", EmoticonsManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), EmoticonsManager_regeneratorDefine2(u), EmoticonsManager_regeneratorDefine2(u, o, "Generator"), EmoticonsManager_regeneratorDefine2(u, n, function () { return this; }), EmoticonsManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (EmoticonsManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function EmoticonsManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } EmoticonsManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { EmoticonsManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, EmoticonsManager_regeneratorDefine2(e, r, n, t); }
function EmoticonsManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function EmoticonsManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { EmoticonsManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { EmoticonsManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function EmoticonsManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function EmoticonsManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, EmoticonsManager_toPropertyKey(o.key), o); } }
function EmoticonsManager_createClass(e, r, t) { return r && EmoticonsManager_defineProperties(e.prototype, r), t && EmoticonsManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function EmoticonsManager_defineProperty(e, r, t) { return (r = EmoticonsManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function EmoticonsManager_toPropertyKey(t) { var i = EmoticonsManager_toPrimitive(t, "string"); return "symbol" == EmoticonsManager_typeof(i) ? i : i + ""; }
function EmoticonsManager_toPrimitive(t, r) { if ("object" != EmoticonsManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != EmoticonsManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var GLOBAL_KEY = 'global';
var EmoticonsManager = /*#__PURE__*/function () {
  function EmoticonsManager(tracker) {
    var _this = this;
    EmoticonsManager_classCallCheck(this, EmoticonsManager);
    EmoticonsManager_defineProperty(this, "list", new IndexedCollection());
    EmoticonsManager_defineProperty(this, "emoticonsPromises", new PromiseRegistry());
    this.tracker = tracker;
    this.tracker.client.on('Emoticons', function (ev) {
      return _this.handleEmoticons(ev);
    });
    this.tracker.client.on('NewEmoticon', function (ev) {
      return _this.handleNewEmoticon(ev);
    });
    this.tracker.client.on('EmoticonDeleted', function (ev) {
      return _this.handleEmoticonDeleted(ev);
    });
    this.tracker.client.on('SpaceDeleted', function (ev) {
      return _this.handleSpaceDeleted(ev);
    });
    this.tracker.client.on('Session', function () {
      return _this.handleSession();
    });
  }
  return EmoticonsManager_createClass(EmoticonsManager, [{
    key: "get",
    value: function () {
      var _get = EmoticonsManager_asyncToGenerator(/*#__PURE__*/EmoticonsManager_regenerator().m(function _callee2(spaceId) {
        var _this2 = this;
        var key;
        return EmoticonsManager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              key = spaceId !== null && spaceId !== void 0 ? spaceId : GLOBAL_KEY;
              if (this.emoticonsPromises.notExist(key)) {
                this.emoticonsPromises.registerByFunction(/*#__PURE__*/EmoticonsManager_asyncToGenerator(/*#__PURE__*/EmoticonsManager_regenerator().m(function _callee() {
                  var result;
                  return EmoticonsManager_regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        _context.n = 1;
                        return _this2.tracker.client.send('GetEmoticons', {
                          spaceId: spaceId
                        });
                      case 1:
                        result = _context.v;
                        if (!result.error) {
                          _context.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        _this2.handleEmoticons(result.data);
                      case 3:
                        return _context.a(2);
                    }
                  }, _callee);
                })), key);
              }
              _context2.n = 1;
              return this.emoticonsPromises.get(key);
            case 1:
              return _context2.a(2, this.list.get(key));
          }
        }, _callee2, this);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "handleEmoticons",
    value: function handleEmoticons(event) {
      var _event$location$space;
      var spaceId = (_event$location$space = event.location.spaceId) !== null && _event$location$space !== void 0 ? _event$location$space : GLOBAL_KEY;
      if (!this.list.has(spaceId)) {
        this.list.set([spaceId, new ObservableIndexedObjectCollection('id')]);
      }
      var collection = this.list.get(spaceId);
      collection.set.apply(collection, EmoticonsManager_toConsumableArray(event.emoticons));
    }
  }, {
    key: "handleNewEmoticon",
    value: function handleNewEmoticon(ev) {
      var _ev$emoticon$spaceId;
      var collection = this.list.get((_ev$emoticon$spaceId = ev.emoticon.spaceId) !== null && _ev$emoticon$spaceId !== void 0 ? _ev$emoticon$spaceId : GLOBAL_KEY);
      collection === null || collection === void 0 || collection.set(ev.emoticon);
    }
  }, {
    key: "handleEmoticonDeleted",
    value: function handleEmoticonDeleted(ev) {
      var _ev$spaceId;
      var collection = this.list.get((_ev$spaceId = ev.spaceId) !== null && _ev$spaceId !== void 0 ? _ev$spaceId : GLOBAL_KEY);
      collection === null || collection === void 0 || collection["delete"](ev.emoticonId);
    }
  }, {
    key: "handleSpaceDeleted",
    value: function handleSpaceDeleted(event) {
      this.list["delete"](event.id);
    }
  }, {
    key: "handleSession",
    value: function handleSession() {
      this.list.deleteAll();
      this.emoticonsPromises.forgetAll();
    }
  }]);
}();
;// ./src/state-tracker/UsersManager.ts
function UsersManager_typeof(o) { "@babel/helpers - typeof"; return UsersManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, UsersManager_typeof(o); }
function UsersManager_toConsumableArray(r) { return UsersManager_arrayWithoutHoles(r) || UsersManager_iterableToArray(r) || UsersManager_unsupportedIterableToArray(r) || UsersManager_nonIterableSpread(); }
function UsersManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function UsersManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return UsersManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? UsersManager_arrayLikeToArray(r, a) : void 0; } }
function UsersManager_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function UsersManager_arrayWithoutHoles(r) { if (Array.isArray(r)) return UsersManager_arrayLikeToArray(r); }
function UsersManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function UsersManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return UsersManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (UsersManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, UsersManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, UsersManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), UsersManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", UsersManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), UsersManager_regeneratorDefine2(u), UsersManager_regeneratorDefine2(u, o, "Generator"), UsersManager_regeneratorDefine2(u, n, function () { return this; }), UsersManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (UsersManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function UsersManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } UsersManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { UsersManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, UsersManager_regeneratorDefine2(e, r, n, t); }
function UsersManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function UsersManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { UsersManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { UsersManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function UsersManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function UsersManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, UsersManager_toPropertyKey(o.key), o); } }
function UsersManager_createClass(e, r, t) { return r && UsersManager_defineProperties(e.prototype, r), t && UsersManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function UsersManager_defineProperty(e, r, t) { return (r = UsersManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function UsersManager_toPropertyKey(t) { var i = UsersManager_toPrimitive(t, "string"); return "symbol" == UsersManager_typeof(i) ? i : i + ""; }
function UsersManager_toPrimitive(t, r) { if ("object" != UsersManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != UsersManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var UsersManager = /*#__PURE__*/function () {
  function UsersManager(tracker) {
    var _this = this;
    UsersManager_classCallCheck(this, UsersManager);
    UsersManager_defineProperty(this, "onlineStatus", new EventTarget());
    UsersManager_defineProperty(this, "users", new ObservableIndexedObjectCollection('id'));
    this.tracker = tracker;
    // RoomMemberUpdated & SpaceMemberUpdated events are not contains user object
    tracker.client.on('UserUpdated', function (event) {
      return _this.handleUsers([event.user]);
    });
    tracker.client.on('RoomMemberJoined', function (event) {
      return _this.handleMembers([event.member]);
    });
    tracker.client.on('SpaceMemberJoined', function (event) {
      return _this.handleMembers([event.member]);
    });
    tracker.client.on('SpaceMembers', function (event) {
      return _this.handleMembers(event.members);
    });
    tracker.client.on('RoomMembers', function (event) {
      return _this.handleMembers(event.members);
    });
    tracker.client.on('Messages', function (event) {
      return _this.handleUsers(event.messages.map(function (message) {
        return message.author.user;
      }));
    });
    tracker.client.on('NewMessage', function (event) {
      return _this.handleUsers([event.message.author.user]);
    });
    tracker.client.on('Session', function (event) {
      return _this.handleSession(event);
    });
  }

  /**
   * Get all available (cached) user objects at once.
   */
  return UsersManager_createClass(UsersManager, [{
    key: "getAvailable",
    value: (function () {
      var _getAvailable = UsersManager_asyncToGenerator(/*#__PURE__*/UsersManager_regenerator().m(function _callee() {
        return UsersManager_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              return _context.a(2, this.users);
          }
        }, _callee, this);
      }));
      function getAvailable() {
        return _getAvailable.apply(this, arguments);
      }
      return getAvailable;
    }())
  }, {
    key: "handleMembers",
    value: function handleMembers(members) {
      this.handleUsers(members.map(extractUserFromMember));
    }
  }, {
    key: "handleSession",
    value: function handleSession(session) {
      this.users.deleteAll();
      this.handleUsers([session.user]);
    }
  }, {
    key: "handleUsers",
    value: function handleUsers(users) {
      var _this2 = this,
        _this$users;
      users.forEach(function (newUser) {
        var oldUser = _this2.users.get(newUser.id);
        if (oldUser && oldUser.online !== newUser.online) {
          _this2.onlineStatus.emit('change', newUser);
        }
      });
      (_this$users = this.users).set.apply(_this$users, UsersManager_toConsumableArray(users));
    }
  }]);
}();
;// ./src/state-tracker/RelationshipsManager.ts
function RelationshipsManager_typeof(o) { "@babel/helpers - typeof"; return RelationshipsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, RelationshipsManager_typeof(o); }
function RelationshipsManager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return RelationshipsManager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (RelationshipsManager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, RelationshipsManager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, RelationshipsManager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), RelationshipsManager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", RelationshipsManager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), RelationshipsManager_regeneratorDefine2(u), RelationshipsManager_regeneratorDefine2(u, o, "Generator"), RelationshipsManager_regeneratorDefine2(u, n, function () { return this; }), RelationshipsManager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (RelationshipsManager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function RelationshipsManager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } RelationshipsManager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { RelationshipsManager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, RelationshipsManager_regeneratorDefine2(e, r, n, t); }
function RelationshipsManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function RelationshipsManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { RelationshipsManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { RelationshipsManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function RelationshipsManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function RelationshipsManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, RelationshipsManager_toPropertyKey(o.key), o); } }
function RelationshipsManager_createClass(e, r, t) { return r && RelationshipsManager_defineProperties(e.prototype, r), t && RelationshipsManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function RelationshipsManager_defineProperty(e, r, t) { return (r = RelationshipsManager_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function RelationshipsManager_toPropertyKey(t) { var i = RelationshipsManager_toPrimitive(t, "string"); return "symbol" == RelationshipsManager_typeof(i) ? i : i + ""; }
function RelationshipsManager_toPrimitive(t, r) { if ("object" != RelationshipsManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != RelationshipsManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var getId = function getId(refUserId, type) {
  return "".concat(refUserId, "-").concat(type);
};
var getIdFromRelationship = function getIdFromRelationship(relationship) {
  return getId(relationship.refUser.id, relationship.type);
};
var RelationshipsManager = /*#__PURE__*/function () {
  function RelationshipsManager(tracker) {
    var _this = this;
    RelationshipsManager_classCallCheck(this, RelationshipsManager);
    RelationshipsManager_defineProperty(this, "relationships", new ObservableIndexedObjectCollection(getIdFromRelationship));
    RelationshipsManager_defineProperty(this, "promises", new PromiseRegistry());
    this.tracker = tracker;
    this.tracker.client.on('Relationships', function (ev) {
      return _this.handleRelationships(ev);
    });
    this.tracker.client.on('NewRelationship', function (ev) {
      return _this.handleNewRelationship(ev);
    });
    this.tracker.client.on('RelationshipDeleted', function (ev) {
      return _this.handleRelationshipDeleted(ev);
    });
    this.tracker.client.on('Session', function () {
      return _this.handleSession();
    });
  }
  return RelationshipsManager_createClass(RelationshipsManager, [{
    key: "get",
    value: function () {
      var _get = RelationshipsManager_asyncToGenerator(/*#__PURE__*/RelationshipsManager_regenerator().m(function _callee2() {
        var _this2 = this;
        return RelationshipsManager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.promises.notExist('all')) {
                this.promises.registerByFunction(/*#__PURE__*/RelationshipsManager_asyncToGenerator(/*#__PURE__*/RelationshipsManager_regenerator().m(function _callee() {
                  var result;
                  return RelationshipsManager_regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        _context.n = 1;
                        return _this2.tracker.client.send('GetRelationships', {});
                      case 1:
                        result = _context.v;
                        if (!result.error) {
                          _context.n = 2;
                          break;
                        }
                        throw result.error;
                      case 2:
                        return _context.a(2);
                    }
                  }, _callee);
                })), 'all');
              }
              _context2.n = 1;
              return this.promises.get('all');
            case 1:
              return _context2.a(2, this.relationships);
          }
        }, _callee2, this);
      }));
      function get() {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "exists",
    value: function () {
      var _exists = RelationshipsManager_asyncToGenerator(/*#__PURE__*/RelationshipsManager_regenerator().m(function _callee3(refUserId, type) {
        return RelationshipsManager_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.get();
            case 1:
              return _context3.a(2, this.relationships.has(getId(refUserId, type)));
          }
        }, _callee3, this);
      }));
      function exists(_x, _x2) {
        return _exists.apply(this, arguments);
      }
      return exists;
    }()
  }, {
    key: "handleRelationships",
    value: function handleRelationships(ev) {
      var _this3 = this;
      this.relationships.deleteAll();
      ev.relationships.forEach(function (relationship) {
        _this3.relationships.set(relationship);
      });
    }
  }, {
    key: "handleNewRelationship",
    value: function handleNewRelationship(ev) {
      if (this.promises.has('all')) {
        this.relationships.set(ev.relationship);
      }
    }
  }, {
    key: "handleRelationshipDeleted",
    value: function handleRelationshipDeleted(ev) {
      if (this.promises.has('all')) {
        this.relationships["delete"](getIdFromRelationship(ev.relationship));
      }
    }
  }, {
    key: "handleSession",
    value: function handleSession() {
      this.promises.forgetAll();
      this.relationships.deleteAll();
    }
  }]);
}();
;// ./src/state-tracker/ChatStateTracker.ts
function ChatStateTracker_typeof(o) { "@babel/helpers - typeof"; return ChatStateTracker_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ChatStateTracker_typeof(o); }
function ChatStateTracker_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return ChatStateTracker_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (ChatStateTracker_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, ChatStateTracker_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, ChatStateTracker_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), ChatStateTracker_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", ChatStateTracker_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), ChatStateTracker_regeneratorDefine2(u), ChatStateTracker_regeneratorDefine2(u, o, "Generator"), ChatStateTracker_regeneratorDefine2(u, n, function () { return this; }), ChatStateTracker_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (ChatStateTracker_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function ChatStateTracker_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } ChatStateTracker_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { ChatStateTracker_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, ChatStateTracker_regeneratorDefine2(e, r, n, t); }
function ChatStateTracker_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function ChatStateTracker_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { ChatStateTracker_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { ChatStateTracker_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ChatStateTracker_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ChatStateTracker_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ChatStateTracker_toPropertyKey(o.key), o); } }
function ChatStateTracker_createClass(e, r, t) { return r && ChatStateTracker_defineProperties(e.prototype, r), t && ChatStateTracker_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ChatStateTracker_defineProperty(e, r, t) { return (r = ChatStateTracker_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function ChatStateTracker_toPropertyKey(t) { var i = ChatStateTracker_toPrimitive(t, "string"); return "symbol" == ChatStateTracker_typeof(i) ? i : i + ""; }
function ChatStateTracker_toPrimitive(t, r) { if ("object" != ChatStateTracker_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ChatStateTracker_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







var ChatStateTracker = /*#__PURE__*/function () {
  function ChatStateTracker(client) {
    var _this = this;
    ChatStateTracker_classCallCheck(this, ChatStateTracker);
    ChatStateTracker_defineProperty(this, "client", void 0);
    /**
     * State of your permissions.
     */
    ChatStateTracker_defineProperty(this, "permissions", void 0);
    /**
     * State of the rooms you are in.
     */
    ChatStateTracker_defineProperty(this, "rooms", void 0);
    /**
     * State of the spaces you are in.
     */
    ChatStateTracker_defineProperty(this, "spaces", void 0);
    /**
     * State of the emoticons (global and space-related).
     */
    ChatStateTracker_defineProperty(this, "emoticons", void 0);
    /**
     * Users related state.
     */
    ChatStateTracker_defineProperty(this, "users", void 0);
    /**
     * State of relationships with other users.
     */
    ChatStateTracker_defineProperty(this, "relationships", void 0);
    ChatStateTracker_defineProperty(this, "_me", null);
    ChatStateTracker_defineProperty(this, "deferredSession", new DeferredTask());
    this.client = client;
    this.client.on('Session', function (ev) {
      return _this.handleSession(ev);
    });
    this.permissions = new PermissionsManager(this);
    this.rooms = new RoomsManager(this);
    this.spaces = new SpacesManager(this);
    this.emoticons = new EmoticonsManager(this);
    this.users = new UsersManager(this);
    this.relationships = new RelationshipsManager(this);
  }
  return ChatStateTracker_createClass(ChatStateTracker, [{
    key: "me",
    get: function get() {
      return this._me;
    }
  }, {
    key: "getMe",
    value: function () {
      var _getMe = ChatStateTracker_asyncToGenerator(/*#__PURE__*/ChatStateTracker_regenerator().m(function _callee() {
        return ChatStateTracker_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.deferredSession.promise;
            case 1:
              return _context.a(2, this._me);
          }
        }, _callee, this);
      }));
      function getMe() {
        return _getMe.apply(this, arguments);
      }
      return getMe;
    }()
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      this._me = ev.user;
      this.deferredSession.resolve();
    }
  }]);
}();
;// ./src/WebSocketChatClient.ts
function WebSocketChatClient_typeof(o) { "@babel/helpers - typeof"; return WebSocketChatClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, WebSocketChatClient_typeof(o); }
function WebSocketChatClient_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return WebSocketChatClient_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (WebSocketChatClient_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, WebSocketChatClient_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, WebSocketChatClient_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), WebSocketChatClient_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", WebSocketChatClient_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), WebSocketChatClient_regeneratorDefine2(u), WebSocketChatClient_regeneratorDefine2(u, o, "Generator"), WebSocketChatClient_regeneratorDefine2(u, n, function () { return this; }), WebSocketChatClient_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (WebSocketChatClient_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function WebSocketChatClient_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } WebSocketChatClient_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { WebSocketChatClient_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, WebSocketChatClient_regeneratorDefine2(e, r, n, t); }
function WebSocketChatClient_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function WebSocketChatClient_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { WebSocketChatClient_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { WebSocketChatClient_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function WebSocketChatClient_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function WebSocketChatClient_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, WebSocketChatClient_toPropertyKey(o.key), o); } }
function WebSocketChatClient_createClass(e, r, t) { return r && WebSocketChatClient_defineProperties(e.prototype, r), t && WebSocketChatClient_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function WebSocketChatClient_callSuper(t, o, e) { return o = WebSocketChatClient_getPrototypeOf(o), WebSocketChatClient_possibleConstructorReturn(t, WebSocketChatClient_isNativeReflectConstruct() ? Reflect.construct(o, e || [], WebSocketChatClient_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function WebSocketChatClient_possibleConstructorReturn(t, e) { if (e && ("object" == WebSocketChatClient_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return WebSocketChatClient_assertThisInitialized(t); }
function WebSocketChatClient_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function WebSocketChatClient_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (WebSocketChatClient_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function WebSocketChatClient_getPrototypeOf(t) { return WebSocketChatClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, WebSocketChatClient_getPrototypeOf(t); }
function WebSocketChatClient_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && WebSocketChatClient_setPrototypeOf(t, e); }
function WebSocketChatClient_setPrototypeOf(t, e) { return WebSocketChatClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, WebSocketChatClient_setPrototypeOf(t, e); }
function WebSocketChatClient_defineProperty(e, r, t) { return (r = WebSocketChatClient_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function WebSocketChatClient_toPropertyKey(t) { var i = WebSocketChatClient_toPrimitive(t, "string"); return "symbol" == WebSocketChatClient_typeof(i) ? i : i + ""; }
function WebSocketChatClient_toPrimitive(t, r) { if ("object" != WebSocketChatClient_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != WebSocketChatClient_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var WebSocketChatClientEvent = /*#__PURE__*/function (WebSocketChatClientEvent) {
  WebSocketChatClientEvent["connect"] = "connect";
  WebSocketChatClientEvent["disconnect"] = "disconnect";
  WebSocketChatClientEvent["message"] = "message";
  WebSocketChatClientEvent["error"] = "error";
  return WebSocketChatClientEvent;
}(WebSocketChatClientEvent || {});
var WebSocketChatClient = /*#__PURE__*/function (_AbstractChatClient) {
  function WebSocketChatClient(options) {
    var _this$options$stateTr;
    var _this;
    WebSocketChatClient_classCallCheck(this, WebSocketChatClient);
    _this = WebSocketChatClient_callSuper(this, WebSocketChatClient);
    WebSocketChatClient_defineProperty(_this, "Event", WebSocketChatClientEvent);
    WebSocketChatClient_defineProperty(_this, "state", void 0);
    WebSocketChatClient_defineProperty(_this, "ws", null);
    WebSocketChatClient_defineProperty(_this, "sendQueue", []);
    WebSocketChatClient_defineProperty(_this, "connectingTimeoutId", void 0);
    WebSocketChatClient_defineProperty(_this, "authenticated", void 0);
    WebSocketChatClient_defineProperty(_this, "authenticatedResolvers", void 0);
    _this.options = options;
    if ((_this$options$stateTr = _this.options.stateTracking) !== null && _this$options$stateTr !== void 0 ? _this$options$stateTr : true) {
      _this.state = new ChatStateTracker(_this);
    }
    return _this;
  }
  WebSocketChatClient_inherits(WebSocketChatClient, _AbstractChatClient);
  return WebSocketChatClient_createClass(WebSocketChatClient, [{
    key: "connect",
    value: function () {
      var _connect = WebSocketChatClient_asyncToGenerator(/*#__PURE__*/WebSocketChatClient_regenerator().m(function _callee() {
        var _this$options$queryPa,
          _this2 = this,
          _this$options$connect;
        var params;
        return WebSocketChatClient_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              params = new URLSearchParams((_this$options$queryPa = this.options.queryParams) !== null && _this$options$queryPa !== void 0 ? _this$options$queryPa : {});
              params.set('token', this.options.token);
              this.ws = new WebSocket("".concat(this.options.url, "?").concat(params));
              this.ws.onclose = function (ev) {
                return _this2.onClose(ev);
              };
              this.ws.onmessage = function (ev) {
                return _this2.onMessage(ev);
              };
              this.connectingTimeoutId = setTimeout(function () {
                return _this2.triggerConnectionTimeout();
              }, (_this$options$connect = this.options.connectingTimeoutMs) !== null && _this$options$connect !== void 0 ? _this$options$connect : 10000);
              this.authenticated = false;
              return _context.a(2, new Promise(function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                return _this2.authenticatedResolvers = args;
              }));
          }
        }, _callee, this);
      }));
      function connect() {
        return _connect.apply(this, arguments);
      }
      return connect;
    }()
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this$ws;
      this.sendQueue = [];
      (_this$ws = this.ws) === null || _this$ws === void 0 || _this$ws.close();
      this.ws = null;
    }
  }, {
    key: "send",
    value: function () {
      var _send = WebSocketChatClient_asyncToGenerator(/*#__PURE__*/WebSocketChatClient_regenerator().m(function _callee2(commandType, commandData) {
        var envelope, promise;
        return WebSocketChatClient_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              envelope = this.createEnvelope(commandType, commandData);
              promise = this.createPromiseFromCommandEnvelope(envelope);
              if (!this.isPendingReadyWsState()) {
                _context2.n = 1;
                break;
              }
              this.sendQueue.push(envelope);
              return _context2.a(2, promise);
            case 1:
              this.sendEnvelope(envelope);
              return _context2.a(2, promise);
          }
        }, _callee2, this);
      }));
      function send(_x, _x2) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "sendEnvelope",
    value: function sendEnvelope(envelope) {
      var _this$ws$readyState, _this$ws2;
      if (this.isReadyToSendWsState()) {
        this.ws.send(JSON.stringify(envelope));
        return;
      }
      this.handleEnvelopeSendError(envelope, new Error("Cannot send; invalid websocket state=".concat((_this$ws$readyState = (_this$ws2 = this.ws) === null || _this$ws2 === void 0 ? void 0 : _this$ws2.readyState) !== null && _this$ws$readyState !== void 0 ? _this$ws$readyState : '[no connection]')));
    }
  }, {
    key: "onMessage",
    value: function onMessage(event) {
      var envelope = JSON.parse(event.data);
      this.handleIncomingEnvelope(envelope);
      this.emit(envelope.type, envelope.data);
      this.emit(this.Event.message, envelope);

      // Login successfully
      if (!this.authenticated) {
        var isAuthenticated = envelope.type !== 'Bye';
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
  }, {
    key: "onClose",
    value: function onClose(event) {
      clearTimeout(this.connectingTimeoutId);
      var reconnect = event.code !== 1000; // Connection was closed because of error
      if (reconnect) {
        void this.connect();
      }
      this.emit(this.Event.disconnect, reconnect);
    }
  }, {
    key: "sendFromQueue",
    value: function sendFromQueue() {
      var _this3 = this;
      // Send awaiting data to server
      var lastDelay = 0;
      var _loop = function _loop() {
        var _this3$options$awaitQ;
        var envelope = _this3.sendQueue[dataIndex];
        setTimeout(function () {
          return _this3.sendEnvelope(envelope);
        }, lastDelay);
        lastDelay += (_this3$options$awaitQ = _this3.options.awaitQueueSendDelayMs) !== null && _this3$options$awaitQ !== void 0 ? _this3$options$awaitQ : 500;
      };
      for (var dataIndex in this.sendQueue) {
        _loop();
      }
      this.sendQueue = [];
      clearTimeout(this.connectingTimeoutId);
    }
  }, {
    key: "triggerConnectionTimeout",
    value: function triggerConnectionTimeout() {
      this.disconnect();
      this.emit(this.Event.error, new Error('Connection timeout'));
    }
  }, {
    key: "isPendingReadyWsState",
    value: function isPendingReadyWsState() {
      return this.ws && this.ws.readyState === this.ws.CONNECTING || !this.authenticated;
    }
  }, {
    key: "isReadyToSendWsState",
    value: function isReadyToSendWsState() {
      return this.ws && this.ws.readyState === this.ws.OPEN && this.authenticated;
    }
  }]);
}(AbstractChatClient);
;// ./src/WebApiChatClient.ts
function WebApiChatClient_typeof(o) { "@babel/helpers - typeof"; return WebApiChatClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, WebApiChatClient_typeof(o); }
function WebApiChatClient_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return WebApiChatClient_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (WebApiChatClient_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, WebApiChatClient_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, WebApiChatClient_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), WebApiChatClient_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", WebApiChatClient_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), WebApiChatClient_regeneratorDefine2(u), WebApiChatClient_regeneratorDefine2(u, o, "Generator"), WebApiChatClient_regeneratorDefine2(u, n, function () { return this; }), WebApiChatClient_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (WebApiChatClient_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function WebApiChatClient_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } WebApiChatClient_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { WebApiChatClient_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, WebApiChatClient_regeneratorDefine2(e, r, n, t); }
function WebApiChatClient_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function WebApiChatClient_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { WebApiChatClient_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { WebApiChatClient_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function WebApiChatClient_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function WebApiChatClient_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, WebApiChatClient_toPropertyKey(o.key), o); } }
function WebApiChatClient_createClass(e, r, t) { return r && WebApiChatClient_defineProperties(e.prototype, r), t && WebApiChatClient_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function WebApiChatClient_callSuper(t, o, e) { return o = WebApiChatClient_getPrototypeOf(o), WebApiChatClient_possibleConstructorReturn(t, WebApiChatClient_isNativeReflectConstruct() ? Reflect.construct(o, e || [], WebApiChatClient_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function WebApiChatClient_possibleConstructorReturn(t, e) { if (e && ("object" == WebApiChatClient_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return WebApiChatClient_assertThisInitialized(t); }
function WebApiChatClient_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function WebApiChatClient_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (WebApiChatClient_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function WebApiChatClient_getPrototypeOf(t) { return WebApiChatClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, WebApiChatClient_getPrototypeOf(t); }
function WebApiChatClient_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && WebApiChatClient_setPrototypeOf(t, e); }
function WebApiChatClient_setPrototypeOf(t, e) { return WebApiChatClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, WebApiChatClient_setPrototypeOf(t, e); }
function WebApiChatClient_defineProperty(e, r, t) { return (r = WebApiChatClient_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function WebApiChatClient_toPropertyKey(t) { var i = WebApiChatClient_toPrimitive(t, "string"); return "symbol" == WebApiChatClient_typeof(i) ? i : i + ""; }
function WebApiChatClient_toPrimitive(t, r) { if ("object" != WebApiChatClient_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != WebApiChatClient_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var WebApiChatClientEvent = /*#__PURE__*/function (WebApiChatClientEvent) {
  WebApiChatClientEvent["message"] = "message";
  WebApiChatClientEvent["error"] = "error";
  WebApiChatClientEvent["destroy"] = "destroy";
  return WebApiChatClientEvent;
}(WebApiChatClientEvent || {});
var WebApiChatClient = /*#__PURE__*/function (_AbstractChatClient) {
  function WebApiChatClient(options) {
    var _this;
    WebApiChatClient_classCallCheck(this, WebApiChatClient);
    _this = WebApiChatClient_callSuper(this, WebApiChatClient);
    WebApiChatClient_defineProperty(_this, "Event", WebApiChatClientEvent);
    WebApiChatClient_defineProperty(_this, "sendStack", void 0);
    _this.options = options;
    return _this;
  }
  WebApiChatClient_inherits(WebApiChatClient, _AbstractChatClient);
  return WebApiChatClient_createClass(WebApiChatClient, [{
    key: "send",
    value: function () {
      var _send = WebApiChatClient_asyncToGenerator(/*#__PURE__*/WebApiChatClient_regenerator().m(function _callee(commandType, commandData) {
        var envelope;
        return WebApiChatClient_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              envelope = this.createEnvelope(commandType, commandData);
              this.sendStack.push({
                data: envelope,
                attempts: 0,
                lastTimeoutId: null
              });
              this.makeApiCall(this.sendStack.length - 1);
              return _context.a(2, this.createPromiseFromCommandEnvelope(envelope));
          }
        }, _callee, this);
      }));
      function send(_x, _x2) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;
      // Cancel all awaiting requests
      this.sendStack.forEach(function (item) {
        if (item.lastTimeoutId) {
          clearTimeout(item.lastTimeoutId);
        }
        _this2.awaitingResponse["delete"](item.data.ref);
      });
      this.sendStack = [];
      this.emit(this.Event.destroy, false);
    }
  }, {
    key: "onMessage",
    value: function () {
      var _onMessage = WebApiChatClient_asyncToGenerator(/*#__PURE__*/WebApiChatClient_regenerator().m(function _callee2(reqId, response) {
        var envelope;
        return WebApiChatClient_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              this.sendStack.splice(reqId, 1);
              _context2.n = 1;
              return response.json();
            case 1:
              envelope = _context2.v;
              this.handleIncomingEnvelope(envelope);
              this.emit(envelope.type, envelope.data);
              this.emit(this.Event.message, envelope);
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function onMessage(_x3, _x4) {
        return _onMessage.apply(this, arguments);
      }
      return onMessage;
    }()
  }, {
    key: "onError",
    value: function onError(reqId, body) {
      var _this$options$attempt,
        _this3 = this,
        _this$options$attempt2;
      if (this.sendStack[reqId].attempts >= ((_this$options$attempt = this.options.attemptsToSend) !== null && _this$options$attempt !== void 0 ? _this$options$attempt : 10)) {
        this.sendStack.splice(reqId, 1);
        this.handleEnvelopeSendError(this.sendStack[reqId].data, new Error("Cannot send ".concat(body, "; aborting after reaching the maximum connection errors")));
        return;
      }
      this.sendStack[reqId].lastTimeoutId = setTimeout(function () {
        return _this3.makeApiCall(reqId);
      }, (_this$options$attempt2 = this.options.attemptDelayMs) !== null && _this$options$attempt2 !== void 0 ? _this$options$attempt2 : 3000);
    }
  }, {
    key: "makeApiCall",
    value: function makeApiCall(reqId) {
      var _this$options$queryPa,
        _this4 = this;
      this.sendStack[reqId].attempts++;
      var bodyJson = JSON.stringify(this.sendStack[reqId].data);
      var headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      headers.Authorization = "Bearer ".concat(this.options.token);
      var params = new URLSearchParams((_this$options$queryPa = this.options.queryParams) !== null && _this$options$queryPa !== void 0 ? _this$options$queryPa : {});
      var url = "".concat(this.options.url).concat(params ? '?' + params : '');
      fetch(url, {
        headers: headers,
        body: bodyJson,
        method: 'POST'
      }).then(function (response) {
        return _this4.onMessage(reqId, response);
      })["catch"](function () {
        return _this4.onError(reqId, bodyJson);
      });
    }
  }]);
}(AbstractChatClient);
;// ./src/AbstractRestClient.ts
function AbstractRestClient_typeof(o) { "@babel/helpers - typeof"; return AbstractRestClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AbstractRestClient_typeof(o); }
function AbstractRestClient_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return AbstractRestClient_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (AbstractRestClient_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, AbstractRestClient_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, AbstractRestClient_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), AbstractRestClient_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", AbstractRestClient_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), AbstractRestClient_regeneratorDefine2(u), AbstractRestClient_regeneratorDefine2(u, o, "Generator"), AbstractRestClient_regeneratorDefine2(u, n, function () { return this; }), AbstractRestClient_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (AbstractRestClient_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function AbstractRestClient_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } AbstractRestClient_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { AbstractRestClient_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, AbstractRestClient_regeneratorDefine2(e, r, n, t); }
function AbstractRestClient_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function AbstractRestClient_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? AbstractRestClient_ownKeys(Object(t), !0).forEach(function (r) { AbstractRestClient_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : AbstractRestClient_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function AbstractRestClient_defineProperty(e, r, t) { return (r = AbstractRestClient_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function AbstractRestClient_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function AbstractRestClient_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { AbstractRestClient_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { AbstractRestClient_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function AbstractRestClient_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AbstractRestClient_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AbstractRestClient_toPropertyKey(o.key), o); } }
function AbstractRestClient_createClass(e, r, t) { return r && AbstractRestClient_defineProperties(e.prototype, r), t && AbstractRestClient_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function AbstractRestClient_toPropertyKey(t) { var i = AbstractRestClient_toPrimitive(t, "string"); return "symbol" == AbstractRestClient_typeof(i) ? i : i + ""; }
function AbstractRestClient_toPrimitive(t, r) { if ("object" != AbstractRestClient_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AbstractRestClient_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AbstractRestClient = /*#__PURE__*/function () {
  function AbstractRestClient(options) {
    AbstractRestClient_classCallCheck(this, AbstractRestClient);
    this.options = options;
  }
  return AbstractRestClient_createClass(AbstractRestClient, [{
    key: "send",
    value: function () {
      var _send = AbstractRestClient_asyncToGenerator(/*#__PURE__*/AbstractRestClient_regenerator().m(function _callee(method, uri) {
        var data,
          url,
          body,
          headers,
          result,
          _args = arguments;
        return AbstractRestClient_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              data = _args.length > 2 && _args[2] !== undefined ? _args[2] : undefined;
              url = this.getUrl(uri);
              body = undefined;
              if (data) {
                if (['GET', 'DELETE'].includes(method)) {
                  url += new URLSearchParams(data).toString();
                } else {
                  body = JSON.stringify(data);
                }
              }
              headers = AbstractRestClient_objectSpread({
                'Content-Type': 'application/json',
                Accept: 'application/json'
              }, this.getAuthHeaders());
              _context.n = 1;
              return fetch(url, {
                method: method,
                body: body,
                headers: headers
              });
            case 1:
              result = _context.v;
              return _context.a(2, this.convertFetchResponse(result));
          }
        }, _callee, this);
      }));
      function send(_x, _x2) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "getAuthHeaders",
    value: function getAuthHeaders() {
      var headers = {};
      if (this.options.token) {
        headers.Authorization = "Bearer ".concat(this.options.token);
      }
      return headers;
    }
  }, {
    key: "getUrl",
    value: function getUrl(uri) {
      var _this$options$url;
      return this.removeEndingSlash((_this$options$url = this.options.url) !== null && _this$options$url !== void 0 ? _this$options$url : this.defaultUrl) + '/' + this.removeStartingSlash(uri);
    }
  }, {
    key: "convertFetchResponse",
    value: function () {
      var _convertFetchResponse = AbstractRestClient_asyncToGenerator(/*#__PURE__*/AbstractRestClient_regenerator().m(function _callee2(result) {
        var _result$headers$get;
        var _t, _t2, _t3, _t4;
        return AbstractRestClient_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _t = result.ok;
              _t2 = result.status;
              if (!((_result$headers$get = result.headers.get('content-type')) !== null && _result$headers$get !== void 0 && _result$headers$get.includes('json'))) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return result.json();
            case 1:
              _t3 = _context2.v;
              _context2.n = 4;
              break;
            case 2:
              _context2.n = 3;
              return result.text();
            case 3:
              _t3 = _context2.v;
            case 4:
              _t4 = _t3;
              return _context2.a(2, {
                ok: _t,
                status: _t2,
                data: _t4
              });
          }
        }, _callee2);
      }));
      function convertFetchResponse(_x3) {
        return _convertFetchResponse.apply(this, arguments);
      }
      return convertFetchResponse;
    }()
  }, {
    key: "removeStartingSlash",
    value: function removeStartingSlash(text) {
      return text.replace(/^\/+/, '');
    }
  }, {
    key: "removeEndingSlash",
    value: function removeEndingSlash(text) {
      return text.replace(/\/+$/, '');
    }
  }]);
}();
;// ./src/AuthClient.ts
function AuthClient_typeof(o) { "@babel/helpers - typeof"; return AuthClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AuthClient_typeof(o); }
function AuthClient_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return AuthClient_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (AuthClient_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, AuthClient_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, AuthClient_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), AuthClient_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", AuthClient_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), AuthClient_regeneratorDefine2(u), AuthClient_regeneratorDefine2(u, o, "Generator"), AuthClient_regeneratorDefine2(u, n, function () { return this; }), AuthClient_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (AuthClient_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function AuthClient_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } AuthClient_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { AuthClient_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, AuthClient_regeneratorDefine2(e, r, n, t); }
function AuthClient_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function AuthClient_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { AuthClient_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { AuthClient_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function AuthClient_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AuthClient_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AuthClient_toPropertyKey(o.key), o); } }
function AuthClient_createClass(e, r, t) { return r && AuthClient_defineProperties(e.prototype, r), t && AuthClient_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function AuthClient_callSuper(t, o, e) { return o = AuthClient_getPrototypeOf(o), AuthClient_possibleConstructorReturn(t, AuthClient_isNativeReflectConstruct() ? Reflect.construct(o, e || [], AuthClient_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function AuthClient_possibleConstructorReturn(t, e) { if (e && ("object" == AuthClient_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return AuthClient_assertThisInitialized(t); }
function AuthClient_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function AuthClient_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (AuthClient_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function AuthClient_getPrototypeOf(t) { return AuthClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, AuthClient_getPrototypeOf(t); }
function AuthClient_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && AuthClient_setPrototypeOf(t, e); }
function AuthClient_setPrototypeOf(t, e) { return AuthClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, AuthClient_setPrototypeOf(t, e); }
function AuthClient_defineProperty(e, r, t) { return (r = AuthClient_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function AuthClient_toPropertyKey(t) { var i = AuthClient_toPrimitive(t, "string"); return "symbol" == AuthClient_typeof(i) ? i : i + ""; }
function AuthClient_toPrimitive(t, r) { if ("object" != AuthClient_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AuthClient_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var AuthClient = /*#__PURE__*/function (_AbstractRestClient) {
  function AuthClient() {
    var _this;
    AuthClient_classCallCheck(this, AuthClient);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = AuthClient_callSuper(this, AuthClient, [].concat(args));
    AuthClient_defineProperty(_this, "defaultUrl", 'https://polfan.pl/webservice/api');
    return _this;
  }
  AuthClient_inherits(AuthClient, _AbstractRestClient);
  return AuthClient_createClass(AuthClient, [{
    key: "deleteToken",
    value: function () {
      var _deleteToken = AuthClient_asyncToGenerator(/*#__PURE__*/AuthClient_regenerator().m(function _callee(token) {
        var response;
        return AuthClient_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.send('DELETE', "auth/tokens/".concat(token));
            case 1:
              response = _context.v;
              if (response.ok) {
                _context.n = 2;
                break;
              }
              throw new Error("Cannot delete access token: ".concat(response.data.errors[0]));
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function deleteToken(_x) {
        return _deleteToken.apply(this, arguments);
      }
      return deleteToken;
    }()
  }, {
    key: "getMe",
    value: function () {
      var _getMe = AuthClient_asyncToGenerator(/*#__PURE__*/AuthClient_regenerator().m(function _callee2() {
        var response;
        return AuthClient_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.send('GET', 'auth/me');
            case 1:
              response = _context2.v;
              if (!response.ok) {
                _context2.n = 2;
                break;
              }
              response.data.id = response.data.id.toString();
              return _context2.a(2, response.data);
            case 2:
              throw new Error("Cannot get current user account: ".concat(response.data.errors[0]));
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function getMe() {
        return _getMe.apply(this, arguments);
      }
      return getMe;
    }()
  }], [{
    key: "createToken",
    value: function () {
      var _createToken = AuthClient_asyncToGenerator(/*#__PURE__*/AuthClient_regenerator().m(function _callee3(login, password) {
        var clientName,
          response,
          _args3 = arguments;
        return AuthClient_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              clientName = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 'pserv-js-client';
              _context3.n = 1;
              return new AuthClient({
                token: null
              }).send('POST', 'auth/tokens', {
                login: login,
                password: password,
                client_name: clientName
              });
            case 1:
              response = _context3.v;
              if (!response.ok) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, response.data);
            case 2:
              throw new Error("Cannot create user token: ".concat(response.data.errors[0]));
            case 3:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function createToken(_x2, _x3) {
        return _createToken.apply(this, arguments);
      }
      return createToken;
    }()
  }]);
}(AbstractRestClient);
;// ./src/FilesClient.ts
function FilesClient_typeof(o) { "@babel/helpers - typeof"; return FilesClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, FilesClient_typeof(o); }
function FilesClient_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return FilesClient_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (FilesClient_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, FilesClient_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, FilesClient_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), FilesClient_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", FilesClient_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), FilesClient_regeneratorDefine2(u), FilesClient_regeneratorDefine2(u, o, "Generator"), FilesClient_regeneratorDefine2(u, n, function () { return this; }), FilesClient_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (FilesClient_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function FilesClient_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } FilesClient_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { FilesClient_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, FilesClient_regeneratorDefine2(e, r, n, t); }
function FilesClient_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function FilesClient_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? FilesClient_ownKeys(Object(t), !0).forEach(function (r) { FilesClient_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : FilesClient_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function FilesClient_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function FilesClient_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { FilesClient_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { FilesClient_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function FilesClient_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function FilesClient_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, FilesClient_toPropertyKey(o.key), o); } }
function FilesClient_createClass(e, r, t) { return r && FilesClient_defineProperties(e.prototype, r), t && FilesClient_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function FilesClient_callSuper(t, o, e) { return o = FilesClient_getPrototypeOf(o), FilesClient_possibleConstructorReturn(t, FilesClient_isNativeReflectConstruct() ? Reflect.construct(o, e || [], FilesClient_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function FilesClient_possibleConstructorReturn(t, e) { if (e && ("object" == FilesClient_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return FilesClient_assertThisInitialized(t); }
function FilesClient_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function FilesClient_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (FilesClient_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function FilesClient_getPrototypeOf(t) { return FilesClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, FilesClient_getPrototypeOf(t); }
function FilesClient_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && FilesClient_setPrototypeOf(t, e); }
function FilesClient_setPrototypeOf(t, e) { return FilesClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, FilesClient_setPrototypeOf(t, e); }
function FilesClient_defineProperty(e, r, t) { return (r = FilesClient_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function FilesClient_toPropertyKey(t) { var i = FilesClient_toPrimitive(t, "string"); return "symbol" == FilesClient_typeof(i) ? i : i + ""; }
function FilesClient_toPrimitive(t, r) { if ("object" != FilesClient_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != FilesClient_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var FilesClient = /*#__PURE__*/function (_AbstractRestClient) {
  function FilesClient() {
    var _this;
    FilesClient_classCallCheck(this, FilesClient);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = FilesClient_callSuper(this, FilesClient, [].concat(args));
    FilesClient_defineProperty(_this, "defaultUrl", 'https://files.devana.pl');
    return _this;
  }
  FilesClient_inherits(FilesClient, _AbstractRestClient);
  return FilesClient_createClass(FilesClient, [{
    key: "uploadFile",
    value: function () {
      var _uploadFile = FilesClient_asyncToGenerator(/*#__PURE__*/FilesClient_regenerator().m(function _callee(file) {
        var _name;
        var name, headers, response;
        return FilesClient_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              name = encodeURIComponent((_name = file.name) !== null && _name !== void 0 ? _name : '');
              headers = FilesClient_objectSpread(FilesClient_objectSpread({}, this.getAuthHeaders()), {}, {
                Accept: 'application/json',
                'Content-Disposition': "attachment; filename=\"".concat(name, "\""),
                'Content-Length': file.size
              });
              _context.n = 1;
              return fetch(this.getUrl('files'), {
                method: 'POST',
                body: file,
                headers: headers
              });
            case 1:
              response = _context.v;
              return _context.a(2, this.convertFetchResponse(response));
          }
        }, _callee, this);
      }));
      function uploadFile(_x) {
        return _uploadFile.apply(this, arguments);
      }
      return uploadFile;
    }()
  }, {
    key: "getFileMeta",
    value: function () {
      var _getFileMeta = FilesClient_asyncToGenerator(/*#__PURE__*/FilesClient_regenerator().m(function _callee2(id) {
        return FilesClient_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, this.send('GET', 'files/' + id));
          }
        }, _callee2, this);
      }));
      function getFileMeta(_x2) {
        return _getFileMeta.apply(this, arguments);
      }
      return getFileMeta;
    }()
  }, {
    key: "getFileMetaBulk",
    value: function () {
      var _getFileMetaBulk = FilesClient_asyncToGenerator(/*#__PURE__*/FilesClient_regenerator().m(function _callee3(ids) {
        var searchParams;
        return FilesClient_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              searchParams = new URLSearchParams();
              ids.forEach(function (id) {
                return searchParams.append('id[]', id);
              });
              return _context3.a(2, this.send('GET', 'files?' + searchParams));
          }
        }, _callee3, this);
      }));
      function getFileMetaBulk(_x3) {
        return _getFileMetaBulk.apply(this, arguments);
      }
      return getFileMetaBulk;
    }()
  }]);
}(AbstractRestClient);
;// ./src/index.ts








module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.cjs.js.map