(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PServ"] = factory();
	else
		root["PServ"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
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
  "File": () => (/* reexport */ FilesClient_namespaceObject.File),
  "FilesClient": () => (/* reexport */ FilesClient),
  "IndexedCollection": () => (/* reexport */ IndexedCollection),
  "IndexedObjectCollection": () => (/* reexport */ IndexedObjectCollection),
  "Layer": () => (/* reexport */ Layer),
  "MyAccountInterface": () => (/* reexport */ AuthClient_namespaceObject.MyAccountInterface),
  "ObservableIndexedCollection": () => (/* reexport */ ObservableIndexedCollection),
  "ObservableIndexedObjectCollection": () => (/* reexport */ ObservableIndexedObjectCollection),
  "PermissionDefinition": () => (/* reexport */ PermissionDefinition),
  "Permissions": () => (/* reexport */ Permissions),
  "TokenInterface": () => (/* reexport */ AuthClient_namespaceObject.TokenInterface),
  "WebApiChatClient": () => (/* reexport */ WebApiChatClient),
  "WebSocketChatClient": () => (/* reexport */ WebSocketChatClient)
});

// NAMESPACE OBJECT: ./src/AuthClient.ts
var AuthClient_namespaceObject = {};
__webpack_require__.r(AuthClient_namespaceObject);
__webpack_require__.d(AuthClient_namespaceObject, {
  "L": () => (AuthClient)
});

// NAMESPACE OBJECT: ./src/FilesClient.ts
var FilesClient_namespaceObject = {};
__webpack_require__.r(FilesClient_namespaceObject);
__webpack_require__.d(FilesClient_namespaceObject, {
  "Q": () => (FilesClient)
});

;// CONCATENATED MODULE: ./src/EventTarget.ts
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var EventTarget = /*#__PURE__*/function () {
  function EventTarget() {
    _classCallCheck(this, EventTarget);
    _defineProperty(this, "events", new Map());
    _defineProperty(this, "onceEvents", new Map());
  }
  _createClass(EventTarget, [{
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
      (_map$get2 = map.get(eventName)) === null || _map$get2 === void 0 ? void 0 : _map$get2.forEach(function (callback) {
        return callback(event);
      });
    }
  }]);
  return EventTarget;
}();
;// CONCATENATED MODULE: ./src/AbstractChatClient.ts
function AbstractChatClient_typeof(obj) { "@babel/helpers - typeof"; return AbstractChatClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, AbstractChatClient_typeof(obj); }
function AbstractChatClient_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function AbstractChatClient_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, AbstractChatClient_toPropertyKey(descriptor.key), descriptor); } }
function AbstractChatClient_createClass(Constructor, protoProps, staticProps) { if (protoProps) AbstractChatClient_defineProperties(Constructor.prototype, protoProps); if (staticProps) AbstractChatClient_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (AbstractChatClient_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function AbstractChatClient_defineProperty(obj, key, value) { key = AbstractChatClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AbstractChatClient_toPropertyKey(arg) { var key = AbstractChatClient_toPrimitive(arg, "string"); return AbstractChatClient_typeof(key) === "symbol" ? key : String(key); }
function AbstractChatClient_toPrimitive(input, hint) { if (AbstractChatClient_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (AbstractChatClient_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var AbstractChatClient = /*#__PURE__*/function (_EventTarget) {
  _inherits(AbstractChatClient, _EventTarget);
  var _super = _createSuper(AbstractChatClient);
  function AbstractChatClient() {
    var _this;
    AbstractChatClient_classCallCheck(this, AbstractChatClient);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    AbstractChatClient_defineProperty(_assertThisInitialized(_this), "awaitingResponse", new Map());
    AbstractChatClient_defineProperty(_assertThisInitialized(_this), "sentCounter", 0);
    return _this;
  }
  AbstractChatClient_createClass(AbstractChatClient, [{
    key: "on",
    value: function on(eventName, handler) {
      return _get(_getPrototypeOf(AbstractChatClient.prototype), "on", this).call(this, eventName, handler);
    }
  }, {
    key: "once",
    value: function once(eventName, handler) {
      return _get(_getPrototypeOf(AbstractChatClient.prototype), "once", this).call(this, eventName, handler);
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
      this.awaitingResponse.get(envelope.ref)[0](error);
      this.awaitingResponse["delete"](envelope.ref);
    }
  }]);
  return AbstractChatClient;
}(EventTarget);
;// CONCATENATED MODULE: ./src/IndexedObjectCollection.ts
function IndexedObjectCollection_typeof(obj) { "@babel/helpers - typeof"; return IndexedObjectCollection_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, IndexedObjectCollection_typeof(obj); }
function IndexedObjectCollection_get() { if (typeof Reflect !== "undefined" && Reflect.get) { IndexedObjectCollection_get = Reflect.get.bind(); } else { IndexedObjectCollection_get = function _get(target, property, receiver) { var base = IndexedObjectCollection_superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return IndexedObjectCollection_get.apply(this, arguments); }
function IndexedObjectCollection_superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = IndexedObjectCollection_getPrototypeOf(object); if (object === null) break; } return object; }
function IndexedObjectCollection_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) IndexedObjectCollection_setPrototypeOf(subClass, superClass); }
function IndexedObjectCollection_setPrototypeOf(o, p) { IndexedObjectCollection_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return IndexedObjectCollection_setPrototypeOf(o, p); }
function IndexedObjectCollection_createSuper(Derived) { var hasNativeReflectConstruct = IndexedObjectCollection_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = IndexedObjectCollection_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = IndexedObjectCollection_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return IndexedObjectCollection_possibleConstructorReturn(this, result); }; }
function IndexedObjectCollection_possibleConstructorReturn(self, call) { if (call && (IndexedObjectCollection_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return IndexedObjectCollection_assertThisInitialized(self); }
function IndexedObjectCollection_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function IndexedObjectCollection_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function IndexedObjectCollection_getPrototypeOf(o) { IndexedObjectCollection_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return IndexedObjectCollection_getPrototypeOf(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function IndexedObjectCollection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function IndexedObjectCollection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, IndexedObjectCollection_toPropertyKey(descriptor.key), descriptor); } }
function IndexedObjectCollection_createClass(Constructor, protoProps, staticProps) { if (protoProps) IndexedObjectCollection_defineProperties(Constructor.prototype, protoProps); if (staticProps) IndexedObjectCollection_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function IndexedObjectCollection_defineProperty(obj, key, value) { key = IndexedObjectCollection_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function IndexedObjectCollection_toPropertyKey(arg) { var key = IndexedObjectCollection_toPrimitive(arg, "string"); return IndexedObjectCollection_typeof(key) === "symbol" ? key : String(key); }
function IndexedObjectCollection_toPrimitive(input, hint) { if (IndexedObjectCollection_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (IndexedObjectCollection_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var IndexedCollection = /*#__PURE__*/function () {
  function IndexedCollection() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    IndexedObjectCollection_classCallCheck(this, IndexedCollection);
    IndexedObjectCollection_defineProperty(this, "_items", new Map());
    this.set.apply(this, _toConsumableArray(items));
  }
  IndexedObjectCollection_createClass(IndexedCollection, [{
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
        var _item = _items[_i];
        this._items.set(_item[0], _item[1]);
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
    key: "map",
    value: function map(callback) {
      return Array.from(this.items.entries()).map(function (entry) {
        return callback(entry[1], entry[0]);
      });
    }
  }]);
  return IndexedCollection;
}();
var IndexedObjectCollection = /*#__PURE__*/function () {
  function IndexedObjectCollection(id) {
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    IndexedObjectCollection_classCallCheck(this, IndexedObjectCollection);
    this.id = id;
    IndexedObjectCollection_defineProperty(this, "_items", void 0);
    this._items = new IndexedCollection();
    this.set.apply(this, _toConsumableArray(items));
  }
  IndexedObjectCollection_createClass(IndexedObjectCollection, [{
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
          var _value = _step.value;
          if (limit && result.length === limit) {
            break;
          }
          if (_value[field] === valueToFind) {
            result.set(_value);
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
    key: "map",
    value: function map(callback) {
      return this.items.map(callback);
    }
  }, {
    key: "getId",
    value: function getId(item) {
      return typeof this.id === 'function' ? this.id(item) : item[this.id];
    }
  }]);
  return IndexedObjectCollection;
}();
var ObservableIndexedCollection = /*#__PURE__*/function (_IndexedCollection) {
  IndexedObjectCollection_inherits(ObservableIndexedCollection, _IndexedCollection);
  var _super = IndexedObjectCollection_createSuper(ObservableIndexedCollection);
  function ObservableIndexedCollection() {
    var _this3;
    var _this2;
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    IndexedObjectCollection_classCallCheck(this, ObservableIndexedCollection);
    _this2 = _super.call(this);
    IndexedObjectCollection_defineProperty(IndexedObjectCollection_assertThisInitialized(_this2), "eventTarget", void 0);
    _this2.eventTarget = new EventTarget();
    (_this3 = _this2).set.apply(_this3, _toConsumableArray(items));
    return _this2;
  }
  IndexedObjectCollection_createClass(ObservableIndexedCollection, [{
    key: "set",
    value: function set() {
      for (var _len4 = arguments.length, items = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        items[_key4] = arguments[_key4];
      }
      if (items.length) {
        var _get2;
        (_get2 = IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(ObservableIndexedCollection.prototype), "set", this)).call.apply(_get2, [this].concat(items));
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
        var _get3;
        (_get3 = IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(ObservableIndexedCollection.prototype), "delete", this)).call.apply(_get3, [this].concat(ids));
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
        IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(ObservableIndexedCollection.prototype), "deleteAll", this).call(this);
        this.eventTarget.emit('change', {
          deletedItems: Array.from(ids)
        });
      }
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
  return ObservableIndexedCollection;
}(IndexedCollection);
var ObservableIndexedObjectCollection = /*#__PURE__*/function (_IndexedObjectCollect) {
  IndexedObjectCollection_inherits(ObservableIndexedObjectCollection, _IndexedObjectCollect);
  var _super2 = IndexedObjectCollection_createSuper(ObservableIndexedObjectCollection);
  function ObservableIndexedObjectCollection(id) {
    var _this5;
    var _this4;
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    IndexedObjectCollection_classCallCheck(this, ObservableIndexedObjectCollection);
    _this4 = _super2.call(this, id);
    _this4.id = id;
    IndexedObjectCollection_defineProperty(IndexedObjectCollection_assertThisInitialized(_this4), "eventTarget", void 0);
    _this4.eventTarget = new EventTarget();
    (_this5 = _this4).set.apply(_this5, _toConsumableArray(items));
    return _this4;
  }
  IndexedObjectCollection_createClass(ObservableIndexedObjectCollection, [{
    key: "set",
    value: function set() {
      var _this6 = this;
      for (var _len6 = arguments.length, items = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        items[_key6] = arguments[_key6];
      }
      if (items.length) {
        var _get4;
        (_get4 = IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(ObservableIndexedObjectCollection.prototype), "set", this)).call.apply(_get4, [this].concat(items));
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
        var _get5;
        (_get5 = IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(ObservableIndexedObjectCollection.prototype), "delete", this)).call.apply(_get5, [this].concat(ids));
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
        IndexedObjectCollection_get(IndexedObjectCollection_getPrototypeOf(ObservableIndexedObjectCollection.prototype), "deleteAll", this).call(this);
        this.eventTarget.emit('change', {
          deletedItems: Array.from(ids)
        });
      }
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
  return ObservableIndexedObjectCollection;
}(IndexedObjectCollection);
;// CONCATENATED MODULE: ./src/state-tracker/AsyncUtils.ts
function AsyncUtils_typeof(obj) { "@babel/helpers - typeof"; return AsyncUtils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, AsyncUtils_typeof(obj); }
function AsyncUtils_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, AsyncUtils_toPropertyKey(descriptor.key), descriptor); } }
function AsyncUtils_createClass(Constructor, protoProps, staticProps) { if (protoProps) AsyncUtils_defineProperties(Constructor.prototype, protoProps); if (staticProps) AsyncUtils_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function AsyncUtils_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function AsyncUtils_defineProperty(obj, key, value) { key = AsyncUtils_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AsyncUtils_toPropertyKey(arg) { var key = AsyncUtils_toPrimitive(arg, "string"); return AsyncUtils_typeof(key) === "symbol" ? key : String(key); }
function AsyncUtils_toPrimitive(input, hint) { if (AsyncUtils_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (AsyncUtils_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

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
  AsyncUtils_createClass(PromiseRegistry, [{
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
  return PromiseRegistry;
}();
;// CONCATENATED MODULE: ./src/state-tracker/TopicHistoryWindow.ts
function TopicHistoryWindow_typeof(obj) { "@babel/helpers - typeof"; return TopicHistoryWindow_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, TopicHistoryWindow_typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { TopicHistoryWindow_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function TopicHistoryWindow_toConsumableArray(arr) { return TopicHistoryWindow_arrayWithoutHoles(arr) || TopicHistoryWindow_iterableToArray(arr) || TopicHistoryWindow_unsupportedIterableToArray(arr) || TopicHistoryWindow_nonIterableSpread(); }
function TopicHistoryWindow_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function TopicHistoryWindow_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return TopicHistoryWindow_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TopicHistoryWindow_arrayLikeToArray(o, minLen); }
function TopicHistoryWindow_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function TopicHistoryWindow_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return TopicHistoryWindow_arrayLikeToArray(arr); }
function TopicHistoryWindow_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == TopicHistoryWindow_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function TopicHistoryWindow_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function TopicHistoryWindow_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, TopicHistoryWindow_toPropertyKey(descriptor.key), descriptor); } }
function TopicHistoryWindow_createClass(Constructor, protoProps, staticProps) { if (protoProps) TopicHistoryWindow_defineProperties(Constructor.prototype, protoProps); if (staticProps) TopicHistoryWindow_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function TopicHistoryWindow_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) TopicHistoryWindow_setPrototypeOf(subClass, superClass); }
function TopicHistoryWindow_setPrototypeOf(o, p) { TopicHistoryWindow_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return TopicHistoryWindow_setPrototypeOf(o, p); }
function TopicHistoryWindow_createSuper(Derived) { var hasNativeReflectConstruct = TopicHistoryWindow_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = TopicHistoryWindow_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = TopicHistoryWindow_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return TopicHistoryWindow_possibleConstructorReturn(this, result); }; }
function TopicHistoryWindow_possibleConstructorReturn(self, call) { if (call && (TopicHistoryWindow_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return TopicHistoryWindow_assertThisInitialized(self); }
function TopicHistoryWindow_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function TopicHistoryWindow_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function TopicHistoryWindow_getPrototypeOf(o) { TopicHistoryWindow_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return TopicHistoryWindow_getPrototypeOf(o); }
function TopicHistoryWindow_defineProperty(obj, key, value) { key = TopicHistoryWindow_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function TopicHistoryWindow_toPropertyKey(arg) { var key = TopicHistoryWindow_toPrimitive(arg, "string"); return TopicHistoryWindow_typeof(key) === "symbol" ? key : String(key); }
function TopicHistoryWindow_toPrimitive(input, hint) { if (TopicHistoryWindow_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (TopicHistoryWindow_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var WindowState;
(function (WindowState) {
  WindowState[WindowState["LIVE"] = 0] = "LIVE";
  WindowState[WindowState["LATEST"] = 1] = "LATEST";
  WindowState[WindowState["PAST"] = 2] = "PAST";
  WindowState[WindowState["OLDEST"] = 3] = "OLDEST";
})(WindowState || (WindowState = {}));
var TraversableRemoteCollection = /*#__PURE__*/function (_ObservableIndexedObj) {
  TopicHistoryWindow_inherits(TraversableRemoteCollection, _ObservableIndexedObj);
  var _super = TopicHistoryWindow_createSuper(TraversableRemoteCollection);
  function TraversableRemoteCollection() {
    var _this;
    TopicHistoryWindow_classCallCheck(this, TraversableRemoteCollection);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    TopicHistoryWindow_defineProperty(TopicHistoryWindow_assertThisInitialized(_this), "limit", 50);
    TopicHistoryWindow_defineProperty(TopicHistoryWindow_assertThisInitialized(_this), "currentState", WindowState.LIVE);
    TopicHistoryWindow_defineProperty(TopicHistoryWindow_assertThisInitialized(_this), "fetchingState", undefined);
    TopicHistoryWindow_defineProperty(TopicHistoryWindow_assertThisInitialized(_this), "oldestId", null);
    return _this;
  }
  TopicHistoryWindow_createClass(TraversableRemoteCollection, [{
    key: "state",
    get:
    /**
     * Current mode od collection window. To change mode, call one of available fetch methods.
     */
    function get() {
      return this.currentState;
    }

    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
  }, {
    key: "hasLatest",
    get: function get() {
      return [WindowState.LATEST, WindowState.LIVE].includes(this.state);
    }
  }, {
    key: "hasOldest",
    get: function get() {
      return this.state === WindowState.OLDEST || this.oldestId !== null && this.has(this.oldestId);
    }
  }, {
    key: "resetToLatest",
    value: function () {
      var _resetToLatest = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.fetchingState || this.currentState === WindowState.LATEST)) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return");
              case 2:
                this.fetchingState = WindowState.LATEST;
                _context.prev = 3;
                _context.next = 6;
                return this.fetchLatestItems();
              case 6:
                result = _context.sent;
              case 7:
                _context.prev = 7;
                this.fetchingState = undefined;
                return _context.finish(7);
              case 10:
                this.deleteAll();
                this.addItems(result, 'tail');
                this.currentState = WindowState.LATEST;
              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3,, 7, 10]]);
      }));
      function resetToLatest() {
        return _resetToLatest.apply(this, arguments);
      }
      return resetToLatest;
    }()
  }, {
    key: "fetchPrevious",
    value: function () {
      var _fetchPrevious = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var result, firstItem;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.fetchingState || this.hasOldest)) {
                  _context2.next = 2;
                  break;
                }
                return _context2.abrupt("return");
              case 2:
                this.fetchingState = WindowState.PAST;
                _context2.prev = 3;
                _context2.next = 6;
                return this.fetchItemsBefore();
              case 6:
                result = _context2.sent;
              case 7:
                _context2.prev = 7;
                this.fetchingState = undefined;
                return _context2.finish(7);
              case 10:
                if (result) {
                  _context2.next = 12;
                  break;
                }
                return _context2.abrupt("return", this.resetToLatest());
              case 12:
                if (result.length) {
                  _context2.next = 19;
                  break;
                }
                firstItem = this.getAt(0);
                this.oldestId = firstItem ? this.getId(firstItem) : null;
                _context2.next = 17;
                return this.refreshFetchedState();
              case 17:
                // LATEST state has priority over OLDEST
                if (this.currentState === WindowState.PAST) {
                  this.currentState = WindowState.OLDEST;
                }
                return _context2.abrupt("return");
              case 19:
                this.addItems(result, 'head');
                _context2.next = 22;
                return this.refreshFetchedState();
              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3,, 7, 10]]);
      }));
      function fetchPrevious() {
        return _fetchPrevious.apply(this, arguments);
      }
      return fetchPrevious;
    }()
  }, {
    key: "fetchNext",
    value: function () {
      var _fetchNext = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.fetchingState || this.hasLatest)) {
                  _context3.next = 2;
                  break;
                }
                return _context3.abrupt("return");
              case 2:
                this.fetchingState = WindowState.PAST;
                _context3.prev = 3;
                _context3.next = 6;
                return this.fetchItemsAfter();
              case 6:
                result = _context3.sent;
              case 7:
                _context3.prev = 7;
                this.fetchingState = undefined;
                return _context3.finish(7);
              case 10:
                if (result) {
                  _context3.next = 14;
                  break;
                }
                _context3.next = 13;
                return this.resetToLatest();
              case 13:
                return _context3.abrupt("return");
              case 14:
                if (!result.length) {
                  _context3.next = 19;
                  break;
                }
                this.addItems(result, 'tail');
                _context3.next = 18;
                return this.refreshFetchedState();
              case 18:
                return _context3.abrupt("return");
              case 19:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3,, 7, 10]]);
      }));
      function fetchNext() {
        return _fetchNext.apply(this, arguments);
      }
      return fetchNext;
    }()
  }, {
    key: "refreshFetchedState",
    value: function () {
      var _refreshFetchedState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.isLatestItemLoaded();
              case 2:
                if (!_context4.sent) {
                  _context4.next = 6;
                  break;
                }
                _context4.t0 = WindowState.LATEST;
                _context4.next = 7;
                break;
              case 6:
                _context4.t0 = WindowState.PAST;
              case 7:
                this.currentState = _context4.t0;
              case 8:
              case "end":
                return _context4.stop();
            }
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
  return TraversableRemoteCollection;
}(ObservableIndexedObjectCollection);
var TopicHistoryWindow = /*#__PURE__*/function (_TraversableRemoteCol) {
  TopicHistoryWindow_inherits(TopicHistoryWindow, _TraversableRemoteCol);
  var _super2 = TopicHistoryWindow_createSuper(TopicHistoryWindow);
  /**
   * Reexported available window modes enum.
   */

  function TopicHistoryWindow(roomId, topicId, tracker) {
    var _this2;
    TopicHistoryWindow_classCallCheck(this, TopicHistoryWindow);
    _this2 = _super2.call(this, 'id');
    _this2.roomId = roomId;
    _this2.topicId = topicId;
    _this2.tracker = tracker;
    TopicHistoryWindow_defineProperty(TopicHistoryWindow_assertThisInitialized(_this2), "WindowState", WindowState);
    _this2.tracker.client.on('Session', function (ev) {
      return _this2.handleSession(ev);
    });
    _this2.tracker.client.on('NewMessage', function (ev) {
      return _this2.handleNewMessage(ev);
    });
    return _this2;
  }

  /**
   * For internal use.
   * @internal
   */
  TopicHistoryWindow_createClass(TopicHistoryWindow, [{
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
      var _handleNewMessage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(ev) {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if ([WindowState.LATEST, WindowState.LIVE].includes(this.state) && ev.message.location.roomId === this.roomId && ev.message.location.topicId === this.topicId) {
                  this.addItems([ev.message], 'tail');
                }
              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
      function handleNewMessage(_x) {
        return _handleNewMessage.apply(this, arguments);
      }
      return handleNewMessage;
    }()
  }, {
    key: "handleSession",
    value: function handleSession(ev) {
      this.resetToLatest();
    }
  }, {
    key: "fetchItemsAfter",
    value: function () {
      var _fetchItemsAfter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        var _this$getAt;
        var afterId, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                afterId = (_this$getAt = this.getAt(this.length - 1)) === null || _this$getAt === void 0 ? void 0 : _this$getAt.id;
                if (afterId) {
                  _context6.next = 3;
                  break;
                }
                return _context6.abrupt("return", null);
              case 3:
                _context6.next = 5;
                return this.tracker.client.send('GetMessages', {
                  location: {
                    roomId: this.roomId,
                    topicId: this.topicId
                  },
                  after: afterId
                });
              case 5:
                result = _context6.sent;
                if (!result.error) {
                  _context6.next = 8;
                  break;
                }
                throw new Error("Cannot fetch messages: ".concat(result.error.message));
              case 8:
                return _context6.abrupt("return", result.data.messages);
              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
      function fetchItemsAfter() {
        return _fetchItemsAfter.apply(this, arguments);
      }
      return fetchItemsAfter;
    }()
  }, {
    key: "fetchItemsBefore",
    value: function () {
      var _fetchItemsBefore = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        var _this$getAt2;
        var beforeId, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                beforeId = (_this$getAt2 = this.getAt(0)) === null || _this$getAt2 === void 0 ? void 0 : _this$getAt2.id;
                if (beforeId) {
                  _context7.next = 3;
                  break;
                }
                return _context7.abrupt("return", null);
              case 3:
                _context7.next = 5;
                return this.tracker.client.send('GetMessages', {
                  location: {
                    roomId: this.roomId,
                    topicId: this.topicId
                  },
                  before: beforeId
                });
              case 5:
                result = _context7.sent;
                if (!result.error) {
                  _context7.next = 8;
                  break;
                }
                throw new Error("Cannot fetch messages: ".concat(result.error.message));
              case 8:
                return _context7.abrupt("return", result.data.messages);
              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
      function fetchItemsBefore() {
        return _fetchItemsBefore.apply(this, arguments);
      }
      return fetchItemsBefore;
    }()
  }, {
    key: "fetchLatestItems",
    value: function () {
      var _fetchLatestItems = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        var result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.tracker.client.send('GetMessages', {
                  location: {
                    roomId: this.roomId,
                    topicId: this.topicId
                  }
                });
              case 2:
                result = _context8.sent;
                if (!result.error) {
                  _context8.next = 5;
                  break;
                }
                throw new Error("Cannot fetch messages: ".concat(result.error.message));
              case 5:
                return _context8.abrupt("return", result.data.messages);
              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
      function fetchLatestItems() {
        return _fetchLatestItems.apply(this, arguments);
      }
      return fetchLatestItems;
    }()
  }, {
    key: "getTopic",
    value: function () {
      var _getTopic = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.tracker.rooms.getTopics(this.roomId, [this.topicId]);
              case 2:
                return _context9.abrupt("return", _context9.sent.get(this.topicId));
              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));
      function getTopic() {
        return _getTopic.apply(this, arguments);
      }
      return getTopic;
    }()
  }, {
    key: "getLatestMessageId",
    value: function () {
      var _getLatestMessageId = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
        var _yield$this$getTopic, _yield$this$getTopic$;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.getTopic();
              case 2:
                _context10.t1 = _yield$this$getTopic = _context10.sent;
                _context10.t0 = _context10.t1 === null;
                if (_context10.t0) {
                  _context10.next = 6;
                  break;
                }
                _context10.t0 = _yield$this$getTopic === void 0;
              case 6:
                if (!_context10.t0) {
                  _context10.next = 10;
                  break;
                }
                _context10.t2 = void 0;
                _context10.next = 11;
                break;
              case 10:
                _context10.t2 = (_yield$this$getTopic$ = _yield$this$getTopic.lastMessage) === null || _yield$this$getTopic$ === void 0 ? void 0 : _yield$this$getTopic$.id;
              case 11:
                return _context10.abrupt("return", _context10.t2);
              case 12:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));
      function getLatestMessageId() {
        return _getLatestMessageId.apply(this, arguments);
      }
      return getLatestMessageId;
    }()
  }, {
    key: "isLatestItemLoaded",
    value: function () {
      var _isLatestItemLoaded = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        var lastMessageId;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.getLatestMessageId();
              case 2:
                lastMessageId = _context11.sent;
                return _context11.abrupt("return", lastMessageId ? this.has(lastMessageId) : true);
              case 4:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));
      function isLatestItemLoaded() {
        return _isLatestItemLoaded.apply(this, arguments);
      }
      return isLatestItemLoaded;
    }()
  }]);
  return TopicHistoryWindow;
}(TraversableRemoteCollection);
;// CONCATENATED MODULE: ./src/state-tracker/RoomMessagesHistory.ts
function RoomMessagesHistory_typeof(obj) { "@babel/helpers - typeof"; return RoomMessagesHistory_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, RoomMessagesHistory_typeof(obj); }
function RoomMessagesHistory_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ RoomMessagesHistory_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == RoomMessagesHistory_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function RoomMessagesHistory_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function RoomMessagesHistory_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { RoomMessagesHistory_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { RoomMessagesHistory_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function RoomMessagesHistory_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function RoomMessagesHistory_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, RoomMessagesHistory_toPropertyKey(descriptor.key), descriptor); } }
function RoomMessagesHistory_createClass(Constructor, protoProps, staticProps) { if (protoProps) RoomMessagesHistory_defineProperties(Constructor.prototype, protoProps); if (staticProps) RoomMessagesHistory_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function RoomMessagesHistory_defineProperty(obj, key, value) { key = RoomMessagesHistory_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function RoomMessagesHistory_toPropertyKey(arg) { var key = RoomMessagesHistory_toPrimitive(arg, "string"); return RoomMessagesHistory_typeof(key) === "symbol" ? key : String(key); }
function RoomMessagesHistory_toPrimitive(input, hint) { if (RoomMessagesHistory_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (RoomMessagesHistory_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var RoomMessagesHistory = /*#__PURE__*/function () {
  function RoomMessagesHistory(room, tracker) {
    var _this = this;
    RoomMessagesHistory_classCallCheck(this, RoomMessagesHistory);
    this.room = room;
    this.tracker = tracker;
    RoomMessagesHistory_defineProperty(this, "historyWindows", new IndexedCollection());
    this.tracker.client.on('RoomUpdated', function (ev) {
      return _this.handleRoomUpdated(ev);
    });
    this.tracker.client.on('NewTopic', function (ev) {
      return _this.handleNewTopic(ev);
    });
    this.tracker.client.on('TopicDeleted', function (ev) {
      return _this.handleTopicDeleted(ev);
    });
    if (this.room.defaultTopic) {
      this.createHistoryWindowForTopic(this.room.defaultTopic);
    }
  }

  /**
   * Returns a history window object for the given topic ID, allowing you to view message history.
   */
  RoomMessagesHistory_createClass(RoomMessagesHistory, [{
    key: "getMessagesWindow",
    value: function () {
      var _getMessagesWindow = RoomMessagesHistory_asyncToGenerator( /*#__PURE__*/RoomMessagesHistory_regeneratorRuntime().mark(function _callee(topicId) {
        var historyWindow, topic;
        return RoomMessagesHistory_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                historyWindow = this.historyWindows.get(topicId);
                if (historyWindow) {
                  _context.next = 6;
                  break;
                }
                _context.next = 4;
                return this.tracker.rooms.getTopics(this.room.id, [topicId]);
              case 4:
                topic = _context.sent.get(topicId);
                if (topic) {
                  this.createHistoryWindowForTopic(topic);
                }
              case 6:
                return _context.abrupt("return", this.historyWindows.get(topicId));
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function getMessagesWindow(_x) {
        return _getMessagesWindow.apply(this, arguments);
      }
      return getMessagesWindow;
    }()
  }, {
    key: "handleRoomUpdated",
    value: function handleRoomUpdated(ev) {
      if (this.room.id === ev.room.id) {
        this.room = ev.room;
        if (ev.room.defaultTopic) {
          this.createHistoryWindowForTopic(ev.room.defaultTopic);
        }
      }
    }
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
      this.historyWindows.set([topic.id, new TopicHistoryWindow(this.room.id, topic.id, this.tracker)]);

      // If new topic refers to some message from this room, update other structures
      if (topic.refMessage) {
        var refHistoryWindow = this.historyWindows.get(topic.refMessage.location.topicId);
        refHistoryWindow === null || refHistoryWindow === void 0 ? void 0 : refHistoryWindow._updateMessageReference(topic);
      }
    }
  }]);
  return RoomMessagesHistory;
}();
;// CONCATENATED MODULE: ./src/state-tracker/MessagesManager.ts
function MessagesManager_typeof(obj) { "@babel/helpers - typeof"; return MessagesManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, MessagesManager_typeof(obj); }
function MessagesManager_toConsumableArray(arr) { return MessagesManager_arrayWithoutHoles(arr) || MessagesManager_iterableToArray(arr) || MessagesManager_unsupportedIterableToArray(arr) || MessagesManager_nonIterableSpread(); }
function MessagesManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function MessagesManager_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function MessagesManager_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return MessagesManager_arrayLikeToArray(arr); }
function MessagesManager_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function MessagesManager_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? MessagesManager_ownKeys(Object(source), !0).forEach(function (key) { MessagesManager_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : MessagesManager_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function MessagesManager_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = MessagesManager_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function MessagesManager_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MessagesManager_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MessagesManager_arrayLikeToArray(o, minLen); }
function MessagesManager_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function MessagesManager_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ MessagesManager_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == MessagesManager_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function MessagesManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function MessagesManager_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { MessagesManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { MessagesManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function MessagesManager_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function MessagesManager_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, MessagesManager_toPropertyKey(descriptor.key), descriptor); } }
function MessagesManager_createClass(Constructor, protoProps, staticProps) { if (protoProps) MessagesManager_defineProperties(Constructor.prototype, protoProps); if (staticProps) MessagesManager_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function MessagesManager_defineProperty(obj, key, value) { key = MessagesManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function MessagesManager_toPropertyKey(arg) { var key = MessagesManager_toPrimitive(arg, "string"); return MessagesManager_typeof(key) === "symbol" ? key : String(key); }
function MessagesManager_toPrimitive(input, hint) { if (MessagesManager_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (MessagesManager_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var MessagesManager = /*#__PURE__*/function () {
  function MessagesManager(tracker) {
    var _this = this;
    MessagesManager_classCallCheck(this, MessagesManager);
    this.tracker = tracker;
    MessagesManager_defineProperty(this, "roomHistories", new IndexedCollection());
    MessagesManager_defineProperty(this, "followedTopics", new IndexedCollection());
    MessagesManager_defineProperty(this, "followedTopicsPromises", new PromiseRegistry());
    MessagesManager_defineProperty(this, "deferredSession", new DeferredTask());
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
  MessagesManager_createClass(MessagesManager, [{
    key: "getRoomHistory",
    value: function () {
      var _getRoomHistory = MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee(roomId) {
        return MessagesManager_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.deferredSession.promise;
              case 2:
                return _context.abrupt("return", this.roomHistories.get(roomId));
              case 3:
              case "end":
                return _context.stop();
            }
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
  }, {
    key: "cacheSpaceFollowedTopics",
    value: function () {
      var _cacheSpaceFollowedTopics = MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee2(spaceId) {
        var _this2 = this;
        var roomIds, resultPromise, result;
        return MessagesManager_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = spaceId;
                if (!_context2.t0) {
                  _context2.next = 5;
                  break;
                }
                _context2.next = 4;
                return this.tracker.spaces.get();
              case 4:
                _context2.t0 = !_context2.sent.has(spaceId);
              case 5:
                if (!_context2.t0) {
                  _context2.next = 7;
                  break;
                }
                throw new Error("You are not in space ".concat(spaceId));
              case 7:
                _context2.next = 9;
                return this.tracker.rooms.get();
              case 9:
                roomIds = _context2.sent.findBy('spaceId', spaceId).items.map(function (room) {
                  return room.id;
                });
                if (roomIds.length) {
                  _context2.next = 12;
                  break;
                }
                return _context2.abrupt("return");
              case 12:
                resultPromise = this.tracker.client.send('GetFollowedTopics', {
                  location: {
                    spaceId: spaceId
                  }
                });
                roomIds.forEach(function (roomId) {
                  return _this2.followedTopicsPromises.register(resultPromise, roomId);
                });
                _context2.next = 16;
                return resultPromise;
              case 16:
                result = _context2.sent;
                if (!result.error) {
                  _context2.next = 19;
                  break;
                }
                throw result.error;
              case 19:
                this.setFollowedTopicsArray(roomIds, result.data.followedTopics);
              case 20:
              case "end":
                return _context2.stop();
            }
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
  }, {
    key: "getRoomFollowedTopics",
    value: function () {
      var _getRoomFollowedTopics = MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee4(roomId) {
        var _this3 = this;
        return MessagesManager_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.tracker.rooms.get();
              case 2:
                if (_context4.sent.has(roomId)) {
                  _context4.next = 4;
                  break;
                }
                return _context4.abrupt("return", undefined);
              case 4:
                if (this.followedTopics.has(roomId)) {
                  _context4.next = 8;
                  break;
                }
                if (this.followedTopicsPromises.notExist(roomId)) {
                  this.followedTopicsPromises.registerByFunction( /*#__PURE__*/MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee3() {
                    var result;
                    return MessagesManager_regeneratorRuntime().wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return _this3.tracker.client.send('GetFollowedTopics', {
                              location: {
                                roomId: roomId
                              }
                            });
                          case 2:
                            result = _context3.sent;
                            if (!result.error) {
                              _context3.next = 5;
                              break;
                            }
                            throw result.error;
                          case 5:
                            _this3.setFollowedTopicsArray([roomId], result.data.followedTopics);
                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  })), roomId);
                }
                _context4.next = 8;
                return this.followedTopicsPromises.get(roomId);
              case 8:
                return _context4.abrupt("return", this.followedTopics.get(roomId));
              case 9:
              case "end":
                return _context4.stop();
            }
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
  }, {
    key: "ackRoomFollowedTopics",
    value: function () {
      var _ackRoomFollowedTopics = MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee5(roomId) {
        var collection, _iterator, _step, followedTopic;
        return MessagesManager_regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getRoomFollowedTopics(roomId);
              case 2:
                collection = _context5.sent;
                if (collection) {
                  _context5.next = 5;
                  break;
                }
                return _context5.abrupt("return");
              case 5:
                _iterator = MessagesManager_createForOfIteratorHelper(collection.items);
                _context5.prev = 6;
                _iterator.s();
              case 8:
                if ((_step = _iterator.n()).done) {
                  _context5.next = 15;
                  break;
                }
                followedTopic = _step.value;
                if (!followedTopic.missed) {
                  _context5.next = 13;
                  break;
                }
                _context5.next = 13;
                return this.tracker.client.send('Ack', {
                  location: followedTopic.location
                });
              case 13:
                _context5.next = 8;
                break;
              case 15:
                _context5.next = 20;
                break;
              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](6);
                _iterator.e(_context5.t0);
              case 20:
                _context5.prev = 20;
                _iterator.f();
                return _context5.finish(20);
              case 23:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[6, 17, 20, 23]]);
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
  }, {
    key: "calculateRoomMissedMessages",
    value: function () {
      var _calculateRoomMissedMessages = MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee6(roomId) {
        var collection;
        return MessagesManager_regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.getRoomFollowedTopics(roomId);
              case 2:
                collection = _context6.sent;
                if (!collection) {
                  _context6.next = 5;
                  break;
                }
                return _context6.abrupt("return", collection.items.reduce(function (previousValue, currentValue) {
                  var _currentValue$missed;
                  return previousValue + ((_currentValue$missed = currentValue.missed) !== null && _currentValue$missed !== void 0 ? _currentValue$missed : 0);
                }, 0));
              case 5:
                return _context6.abrupt("return", undefined);
              case 6:
              case "end":
                return _context6.stop();
            }
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
  }, {
    key: "_deleteByTopicIds",
    value: function _deleteByTopicIds(roomId) {
      var _this$followedTopics$;
      for (var _len = arguments.length, topicIds = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        topicIds[_key - 1] = arguments[_key];
      }
      (_this$followedTopics$ = this.followedTopics.get(roomId)) === null || _this$followedTopics$ === void 0 ? void 0 : _this$followedTopics$["delete"].apply(_this$followedTopics$, topicIds);
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
      (_this$followedTopics$2 = this.followedTopics.get(ev.followedTopic.location.roomId)) === null || _this$followedTopics$2 === void 0 ? void 0 : _this$followedTopics$2.set(ev.followedTopic);
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
      (_this$followedTopics$3 = this.followedTopics.get(ev.location.roomId)) === null || _this$followedTopics$3 === void 0 ? void 0 : _this$followedTopics$3["delete"](ev.location.topicId);
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
      var _handleNewTopic = MessagesManager_asyncToGenerator( /*#__PURE__*/MessagesManager_regeneratorRuntime().mark(function _callee7(ev) {
        var result, followedTopic;
        return MessagesManager_regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.followedTopics.has(ev.roomId)) {
                  _context7.next = 6;
                  break;
                }
                _context7.next = 3;
                return this.tracker.client.send('GetFollowedTopics', {
                  location: {
                    roomId: ev.roomId,
                    topicId: ev.topic.id
                  }
                });
              case 3:
                result = _context7.sent;
                followedTopic = result.data.followedTopics[0];
                if (followedTopic) {
                  this.followedTopics.get(ev.roomId).set(followedTopic);
                }
              case 6:
              case "end":
                return _context7.stop();
            }
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
      (_this$followedTopics$4 = this.followedTopics.get(ev.location.roomId)) === null || _this$followedTopics$4 === void 0 ? void 0 : _this$followedTopics$4["delete"](ev.location.topicId);
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
      if (!roomFollowedTopics || !followedTopic) {
        // Skip if we don't follow this room or targeted topic
        return;
      }
      var isMe = ev.message.user.id === ((_this$tracker$me = this.tracker.me) === null || _this$tracker$me === void 0 ? void 0 : _this$tracker$me.id);
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
  return MessagesManager;
}();
;// CONCATENATED MODULE: ./src/state-tracker/RoomsManager.ts
function RoomsManager_typeof(obj) { "@babel/helpers - typeof"; return RoomsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, RoomsManager_typeof(obj); }
function RoomsManager_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function RoomsManager_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? RoomsManager_ownKeys(Object(source), !0).forEach(function (key) { RoomsManager_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : RoomsManager_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function RoomsManager_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = RoomsManager_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function RoomsManager_toConsumableArray(arr) { return RoomsManager_arrayWithoutHoles(arr) || RoomsManager_iterableToArray(arr) || RoomsManager_unsupportedIterableToArray(arr) || RoomsManager_nonIterableSpread(); }
function RoomsManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function RoomsManager_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return RoomsManager_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return RoomsManager_arrayLikeToArray(o, minLen); }
function RoomsManager_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function RoomsManager_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return RoomsManager_arrayLikeToArray(arr); }
function RoomsManager_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function RoomsManager_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ RoomsManager_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == RoomsManager_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function RoomsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function RoomsManager_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { RoomsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { RoomsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function RoomsManager_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function RoomsManager_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, RoomsManager_toPropertyKey(descriptor.key), descriptor); } }
function RoomsManager_createClass(Constructor, protoProps, staticProps) { if (protoProps) RoomsManager_defineProperties(Constructor.prototype, protoProps); if (staticProps) RoomsManager_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function RoomsManager_defineProperty(obj, key, value) { key = RoomsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function RoomsManager_toPropertyKey(arg) { var key = RoomsManager_toPrimitive(arg, "string"); return RoomsManager_typeof(key) === "symbol" ? key : String(key); }
function RoomsManager_toPrimitive(input, hint) { if (RoomsManager_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (RoomsManager_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var RoomsManager = /*#__PURE__*/function () {
  function RoomsManager(tracker) {
    var _this = this;
    RoomsManager_classCallCheck(this, RoomsManager);
    this.tracker = tracker;
    RoomsManager_defineProperty(this, "messages", void 0);
    RoomsManager_defineProperty(this, "list", new ObservableIndexedObjectCollection('id'));
    RoomsManager_defineProperty(this, "topics", new IndexedCollection());
    RoomsManager_defineProperty(this, "members", new IndexedCollection());
    RoomsManager_defineProperty(this, "deferredSession", new DeferredTask());
    RoomsManager_defineProperty(this, "membersPromises", new PromiseRegistry());
    RoomsManager_defineProperty(this, "topicsPromises", new PromiseRegistry());
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
  RoomsManager_createClass(RoomsManager, [{
    key: "getMembers",
    value: function () {
      var _getMembers = RoomsManager_asyncToGenerator( /*#__PURE__*/RoomsManager_regeneratorRuntime().mark(function _callee2(roomId) {
        var _this2 = this;
        return RoomsManager_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.membersPromises.notExist(roomId)) {
                  this.membersPromises.registerByFunction( /*#__PURE__*/RoomsManager_asyncToGenerator( /*#__PURE__*/RoomsManager_regeneratorRuntime().mark(function _callee() {
                    var result;
                    return RoomsManager_regeneratorRuntime().wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this2.tracker.client.send('GetRoomMembers', {
                              id: roomId
                            });
                          case 2:
                            result = _context.sent;
                            if (!result.error) {
                              _context.next = 5;
                              break;
                            }
                            throw result.error;
                          case 5:
                            _this2.handleRoomMembers(result.data);
                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  })), roomId);
                }
                _context2.next = 3;
                return this.membersPromises.get(roomId);
              case 3:
                return _context2.abrupt("return", this.members.get(roomId));
              case 4:
              case "end":
                return _context2.stop();
            }
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
  }, {
    key: "getMe",
    value: function () {
      var _getMe = RoomsManager_asyncToGenerator( /*#__PURE__*/RoomsManager_regeneratorRuntime().mark(function _callee3(roomId) {
        var userId, members;
        return RoomsManager_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.tracker.getMe();
              case 2:
                userId = _context3.sent.id;
                if (this.list.has(roomId)) {
                  _context3.next = 5;
                  break;
                }
                return _context3.abrupt("return", undefined);
              case 5:
                _context3.next = 7;
                return this.getMembers(roomId);
              case 7:
                members = _context3.sent;
                return _context3.abrupt("return", members === null || members === void 0 ? void 0 : members.items.find(function (member) {
                  var _member$user$id, _member$user;
                  return ((_member$user$id = (_member$user = member.user) === null || _member$user === void 0 ? void 0 : _member$user.id) !== null && _member$user$id !== void 0 ? _member$user$id : member.spaceMember.user.id) === userId;
                }));
              case 9:
              case "end":
                return _context3.stop();
            }
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
  }, {
    key: "get",
    value: function () {
      var _get = RoomsManager_asyncToGenerator( /*#__PURE__*/RoomsManager_regeneratorRuntime().mark(function _callee4() {
        return RoomsManager_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.deferredSession.promise;
              case 2:
                return _context4.abrupt("return", this.list);
              case 3:
              case "end":
                return _context4.stop();
            }
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
  }, {
    key: "getTopics",
    value: function () {
      var _getTopics = RoomsManager_asyncToGenerator( /*#__PURE__*/RoomsManager_regeneratorRuntime().mark(function _callee5(roomId, tryToFetchTopicIds) {
        var _this3 = this;
        var canFetch, idsToFetch, promise, _iterator, _step, topicId;
        return RoomsManager_regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.deferredSession.promise;
              case 2:
                if (!(tryToFetchTopicIds !== null && tryToFetchTopicIds !== void 0 && tryToFetchTopicIds.length)) {
                  _context5.next = 23;
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
                _context5.prev = 7;
                _iterator.s();
              case 9:
                if ((_step = _iterator.n()).done) {
                  _context5.next = 15;
                  break;
                }
                topicId = _step.value;
                _context5.next = 13;
                return this.topicsPromises.get(roomId + topicId);
              case 13:
                _context5.next = 9;
                break;
              case 15:
                _context5.next = 20;
                break;
              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](7);
                _iterator.e(_context5.t0);
              case 20:
                _context5.prev = 20;
                _iterator.f();
                return _context5.finish(20);
              case 23:
                return _context5.abrupt("return", this.topics.get(roomId));
              case 24:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[7, 17, 20, 23]]);
      }));
      function getTopics(_x3, _x4) {
        return _getTopics.apply(this, arguments);
      }
      return getTopics;
    }()
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
        var _this$topics$get$map, _this$topics$get, _this$messages;
        var roomId = _roomIds[_i];
        var topicIds = (_this$topics$get$map = (_this$topics$get = this.topics.get(roomId)) === null || _this$topics$get === void 0 ? void 0 : _this$topics$get.map(function (topic) {
          return topic.id;
        })) !== null && _this$topics$get$map !== void 0 ? _this$topics$get$map : [];
        (_this$messages = this.messages)._deleteByTopicIds.apply(_this$messages, [roomId].concat(RoomsManager_toConsumableArray(topicIds)));
      }
      (_this$topics = this.topics)["delete"].apply(_this$topics, roomIds);
    }
  }, {
    key: "deleteRoomsBySpaceId",
    value: function deleteRoomsBySpaceId(spaceId) {
      this.deleteRoom.apply(this, RoomsManager_toConsumableArray(this.list.findBy('spaceId', spaceId).map(function (room) {
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
      this.list.set(ev.room);
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
                roles: null
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
    }
  }, {
    key: "handleNewMessage",
    value: function handleNewMessage(ev) {
      var topics = this.topics.get(ev.message.location.roomId);
      var topic = topics === null || topics === void 0 ? void 0 : topics.get(ev.message.location.topicId);
      if (topic) {
        topics.set(RoomsManager_objectSpread(RoomsManager_objectSpread({}, topic), {}, {
          messageCount: topic.messageCount + 1,
          lastMessage: ev.message
        }));
      }
    }
  }]);
  return RoomsManager;
}();
;// CONCATENATED MODULE: ./src/state-tracker/functions.ts
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
;// CONCATENATED MODULE: ./src/state-tracker/SpacesManager.ts
function SpacesManager_typeof(obj) { "@babel/helpers - typeof"; return SpacesManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, SpacesManager_typeof(obj); }
function SpacesManager_toConsumableArray(arr) { return SpacesManager_arrayWithoutHoles(arr) || SpacesManager_iterableToArray(arr) || SpacesManager_unsupportedIterableToArray(arr) || SpacesManager_nonIterableSpread(); }
function SpacesManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function SpacesManager_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return SpacesManager_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SpacesManager_arrayLikeToArray(o, minLen); }
function SpacesManager_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function SpacesManager_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return SpacesManager_arrayLikeToArray(arr); }
function SpacesManager_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function SpacesManager_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function SpacesManager_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? SpacesManager_ownKeys(Object(source), !0).forEach(function (key) { SpacesManager_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : SpacesManager_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function SpacesManager_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ SpacesManager_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == SpacesManager_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function SpacesManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function SpacesManager_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { SpacesManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { SpacesManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function SpacesManager_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function SpacesManager_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, SpacesManager_toPropertyKey(descriptor.key), descriptor); } }
function SpacesManager_createClass(Constructor, protoProps, staticProps) { if (protoProps) SpacesManager_defineProperties(Constructor.prototype, protoProps); if (staticProps) SpacesManager_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function SpacesManager_defineProperty(obj, key, value) { key = SpacesManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function SpacesManager_toPropertyKey(arg) { var key = SpacesManager_toPrimitive(arg, "string"); return SpacesManager_typeof(key) === "symbol" ? key : String(key); }
function SpacesManager_toPrimitive(input, hint) { if (SpacesManager_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (SpacesManager_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var SpacesManager = /*#__PURE__*/function () {
  function SpacesManager(tracker) {
    var _this = this;
    SpacesManager_classCallCheck(this, SpacesManager);
    this.tracker = tracker;
    SpacesManager_defineProperty(this, "list", new ObservableIndexedObjectCollection('id'));
    SpacesManager_defineProperty(this, "roles", new IndexedCollection());
    SpacesManager_defineProperty(this, "rooms", new IndexedCollection());
    SpacesManager_defineProperty(this, "roomIdToSpaceId", new IndexedCollection());
    SpacesManager_defineProperty(this, "members", new IndexedCollection());
    SpacesManager_defineProperty(this, "deferredSession", new DeferredTask());
    SpacesManager_defineProperty(this, "roomsPromises", new PromiseRegistry());
    SpacesManager_defineProperty(this, "membersPromises", new PromiseRegistry());
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
  SpacesManager_createClass(SpacesManager, [{
    key: "get",
    value: function () {
      var _get = SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee() {
        return SpacesManager_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.deferredSession.promise;
              case 2:
                return _context.abrupt("return", this.list);
              case 3:
              case "end":
                return _context.stop();
            }
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
  }, {
    key: "getRoles",
    value: function () {
      var _getRoles = SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee2(spaceId) {
        return SpacesManager_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.deferredSession.promise;
              case 2:
                return _context2.abrupt("return", this.roles.get(spaceId));
              case 3:
              case "end":
                return _context2.stop();
            }
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
  }, {
    key: "getRooms",
    value: function () {
      var _getRooms = SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee4(spaceId) {
        var _this2 = this;
        return SpacesManager_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.roomsPromises.notExist(spaceId)) {
                  this.roomsPromises.registerByFunction( /*#__PURE__*/SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee3() {
                    var result;
                    return SpacesManager_regeneratorRuntime().wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return _this2.tracker.client.send('GetSpaceRooms', {
                              id: spaceId
                            });
                          case 2:
                            result = _context3.sent;
                            if (!result.error) {
                              _context3.next = 5;
                              break;
                            }
                            throw result.error;
                          case 5:
                            _this2.handleSpaceRooms(result.data);
                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  })), spaceId);
                }
                _context4.next = 3;
                return this.roomsPromises.get(spaceId);
              case 3:
                return _context4.abrupt("return", this.rooms.get(spaceId));
              case 4:
              case "end":
                return _context4.stop();
            }
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
  }, {
    key: "getMembers",
    value: function () {
      var _getMembers = SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee6(spaceId) {
        var _this3 = this;
        return SpacesManager_regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.membersPromises.notExist(spaceId)) {
                  this.membersPromises.registerByFunction( /*#__PURE__*/SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee5() {
                    var result;
                    return SpacesManager_regeneratorRuntime().wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this3.tracker.client.send('GetSpaceMembers', {
                              id: spaceId
                            });
                          case 2:
                            result = _context5.sent;
                            if (!result.error) {
                              _context5.next = 5;
                              break;
                            }
                            throw result.error;
                          case 5:
                            _this3.handleSpaceMembers(result.data);
                          case 6:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  })), spaceId);
                }
                _context6.next = 3;
                return this.membersPromises.get(spaceId);
              case 3:
                return _context6.abrupt("return", this.members.get(spaceId));
              case 4:
              case "end":
                return _context6.stop();
            }
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
  }, {
    key: "getMe",
    value: function () {
      var _getMe = SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee7(spaceId) {
        var userId, members;
        return SpacesManager_regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.tracker.getMe();
              case 2:
                userId = _context7.sent.id;
                if (this.list.has(spaceId)) {
                  _context7.next = 5;
                  break;
                }
                return _context7.abrupt("return", undefined);
              case 5:
                _context7.next = 7;
                return this.getMembers(spaceId);
              case 7:
                members = _context7.sent;
                return _context7.abrupt("return", members === null || members === void 0 ? void 0 : members.items.find(function (member) {
                  return member.user.id === userId;
                }));
              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
      function getMe(_x4) {
        return _getMe.apply(this, arguments);
      }
      return getMe;
    }()
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
      (_this$rooms$get = this.rooms.get(ev.spaceId)) === null || _this$rooms$get === void 0 ? void 0 : _this$rooms$get.set(ev.summary);
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
      var _handleRoomDeleted = SpacesManager_asyncToGenerator( /*#__PURE__*/SpacesManager_regeneratorRuntime().mark(function _callee8(ev) {
        var _this$rooms$get2;
        var spaceId, space, spaceChanged;
        return SpacesManager_regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                spaceId = this.roomIdToSpaceId.get(ev.id);
                this.roomIdToSpaceId["delete"](ev.id);
                if (spaceId) {
                  _context8.next = 4;
                  break;
                }
                return _context8.abrupt("return");
              case 4:
                space = this.list.get(spaceId);
                spaceChanged = false;
                (_this$rooms$get2 = this.rooms.get(spaceId)) === null || _this$rooms$get2 === void 0 ? void 0 : _this$rooms$get2["delete"](ev.id);
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
              case 10:
              case "end":
                return _context8.stop();
            }
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
      var _this$rooms$get$map, _this$rooms$get3, _this$roomIdToSpaceId;
      var roomIds = (_this$rooms$get$map = (_this$rooms$get3 = this.rooms.get(ev.id)) === null || _this$rooms$get3 === void 0 ? void 0 : _this$rooms$get3.map(function (item) {
        return item.id;
      })) !== null && _this$rooms$get$map !== void 0 ? _this$rooms$get$map : [];
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
  return SpacesManager;
}();
;// CONCATENATED MODULE: ./src/Permissions.ts
function Permissions_typeof(obj) { "@babel/helpers - typeof"; return Permissions_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, Permissions_typeof(obj); }
function Permissions_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, Permissions_toPropertyKey(descriptor.key), descriptor); } }
function Permissions_createClass(Constructor, protoProps, staticProps) { if (protoProps) Permissions_defineProperties(Constructor.prototype, protoProps); if (staticProps) Permissions_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function Permissions_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Permissions_defineProperty(obj, key, value) { key = Permissions_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function Permissions_toPropertyKey(arg) { var key = Permissions_toPrimitive(arg, "string"); return Permissions_typeof(key) === "symbol" ? key : String(key); }
function Permissions_toPrimitive(input, hint) { if (Permissions_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (Permissions_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Layer;
(function (Layer) {
  Layer[Layer["Global"] = 0] = "Global";
  Layer[Layer["Space"] = 1] = "Space";
  Layer[Layer["Room"] = 2] = "Room";
  Layer[Layer["Topic"] = 3] = "Topic";
})(Layer || (Layer = {}));
var PermissionDefinition = /*#__PURE__*/Permissions_createClass(function PermissionDefinition() {
  Permissions_classCallCheck(this, PermissionDefinition);
  Permissions_defineProperty(this, "value", void 0);
  Permissions_defineProperty(this, "maxLayer", void 0);
});
var Permissions = /*#__PURE__*/function () {
  function Permissions() {
    Permissions_classCallCheck(this, Permissions);
  }
  Permissions_createClass(Permissions, null, [{
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
  return Permissions;
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
  }
});
;// CONCATENATED MODULE: ./src/state-tracker/PermissionsManager.ts
function PermissionsManager_typeof(obj) { "@babel/helpers - typeof"; return PermissionsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, PermissionsManager_typeof(obj); }
function PermissionsManager_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = PermissionsManager_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function PermissionsManager_toConsumableArray(arr) { return PermissionsManager_arrayWithoutHoles(arr) || PermissionsManager_iterableToArray(arr) || PermissionsManager_unsupportedIterableToArray(arr) || PermissionsManager_nonIterableSpread(); }
function PermissionsManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function PermissionsManager_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function PermissionsManager_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return PermissionsManager_arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || PermissionsManager_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function PermissionsManager_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return PermissionsManager_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return PermissionsManager_arrayLikeToArray(o, minLen); }
function PermissionsManager_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function PermissionsManager_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ PermissionsManager_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == PermissionsManager_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function PermissionsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function PermissionsManager_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { PermissionsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { PermissionsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function PermissionsManager_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function PermissionsManager_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, PermissionsManager_toPropertyKey(descriptor.key), descriptor); } }
function PermissionsManager_createClass(Constructor, protoProps, staticProps) { if (protoProps) PermissionsManager_defineProperties(Constructor.prototype, protoProps); if (staticProps) PermissionsManager_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function PermissionsManager_get() { if (typeof Reflect !== "undefined" && Reflect.get) { PermissionsManager_get = Reflect.get.bind(); } else { PermissionsManager_get = function _get(target, property, receiver) { var base = PermissionsManager_superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return PermissionsManager_get.apply(this, arguments); }
function PermissionsManager_superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = PermissionsManager_getPrototypeOf(object); if (object === null) break; } return object; }
function PermissionsManager_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) PermissionsManager_setPrototypeOf(subClass, superClass); }
function PermissionsManager_setPrototypeOf(o, p) { PermissionsManager_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return PermissionsManager_setPrototypeOf(o, p); }
function PermissionsManager_createSuper(Derived) { var hasNativeReflectConstruct = PermissionsManager_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = PermissionsManager_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = PermissionsManager_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return PermissionsManager_possibleConstructorReturn(this, result); }; }
function PermissionsManager_possibleConstructorReturn(self, call) { if (call && (PermissionsManager_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return PermissionsManager_assertThisInitialized(self); }
function PermissionsManager_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function PermissionsManager_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function PermissionsManager_getPrototypeOf(o) { PermissionsManager_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return PermissionsManager_getPrototypeOf(o); }
function PermissionsManager_defineProperty(obj, key, value) { key = PermissionsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function PermissionsManager_toPropertyKey(arg) { var key = PermissionsManager_toPrimitive(arg, "string"); return PermissionsManager_typeof(key) === "symbol" ? key : String(key); }
function PermissionsManager_toPrimitive(input, hint) { if (PermissionsManager_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (PermissionsManager_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }




var getOvId = function getOvId(location, target) {
  return [location.spaceId, location.roomId, location.topicId, target === null || target === void 0 ? void 0 : target.type, target === null || target === void 0 ? void 0 : target.userId, target === null || target === void 0 ? void 0 : target.roleId].filter(Boolean).join('/');
};
var getOvIdByObject = function getOvIdByObject(overwrites) {
  return getOvId(overwrites.location, overwrites.target);
};
var PermissionsManager = /*#__PURE__*/function (_EventTarget) {
  PermissionsManager_inherits(PermissionsManager, _EventTarget);
  var _super = PermissionsManager_createSuper(PermissionsManager);
  function PermissionsManager(tracker) {
    var _this;
    PermissionsManager_classCallCheck(this, PermissionsManager);
    _this = _super.call(this);
    _this.tracker = tracker;
    PermissionsManager_defineProperty(PermissionsManager_assertThisInitialized(_this), "overwrites", new IndexedCollection());
    PermissionsManager_defineProperty(PermissionsManager_assertThisInitialized(_this), "overwritesPromises", new PromiseRegistry());
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
  PermissionsManager_createClass(PermissionsManager, [{
    key: "getOverwrites",
    value: function () {
      var _getOverwrites = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee2(location, target) {
        var _this2 = this;
        var id;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.validateLocation(location);
                id = getOvId(location, target);
                if (this.overwritesPromises.notExist(id)) {
                  this.overwritesPromises.registerByFunction( /*#__PURE__*/PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee() {
                    var result;
                    return PermissionsManager_regeneratorRuntime().wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this2.tracker.client.send('GetPermissionOverwrites', {
                              location: location,
                              target: target
                            });
                          case 2:
                            result = _context.sent;
                            if (!result.error) {
                              _context.next = 5;
                              break;
                            }
                            throw result.error;
                          case 5:
                            _this2.handlePermissionOverwrites(result.data);
                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  })), id);
                }
                _context2.next = 5;
                return this.overwritesPromises.get(id);
              case 5:
                return _context2.abrupt("return", this.overwrites.get(id));
              case 6:
              case "end":
                return _context2.stop();
            }
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
      return PermissionsManager_get(PermissionsManager_getPrototypeOf(PermissionsManager.prototype), "on", this).call(this, eventName, handler);
    }
  }, {
    key: "check",
    value: function () {
      var _check = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee3(permissionNames, location) {
        var ownedPermissions, missing;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (permissionNames.length) {
                  _context3.next = 2;
                  break;
                }
                throw new Error('Permission names array cannot be empty');
              case 2:
                _context3.next = 4;
                return this.calculatePermissions(location);
              case 4:
                ownedPermissions = _context3.sent;
                missing = [];
                permissionNames.forEach(function (name) {
                  if (~ownedPermissions & Permissions.getByName(name).value) {
                    missing.push(name);
                  }
                });
                return _context3.abrupt("return", {
                  ok: missing.length === 0,
                  hasAll: missing.length === 0,
                  hasAny: missing.length < permissionNames.length,
                  missing: missing
                });
              case 8:
              case "end":
                return _context3.stop();
            }
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
      var _calculatePermissions = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee4(location) {
        var _spaceMember$roles, _roomMember$roles, _yield$this$tracker$s, _yield$this$tracker$r, _yield$this$tracker$r2;
        var userId, _yield$this$fetchMemb, _yield$this$fetchMemb2, spaceMember, roomMember, userRoles, promises, filterLocation, _filterLocation;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.validateLocation(location);
                _context4.next = 3;
                return this.tracker.getMe();
              case 3:
                userId = _context4.sent.id;
                _context4.next = 6;
                return this.fetchMembersOrFail(location);
              case 6:
                _yield$this$fetchMemb = _context4.sent;
                _yield$this$fetchMemb2 = _slicedToArray(_yield$this$fetchMemb, 2);
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
                _context4.t0 = location.spaceId;
                if (!_context4.t0) {
                  _context4.next = 24;
                  break;
                }
                _context4.next = 16;
                return this.tracker.spaces.get();
              case 16:
                _context4.t3 = _yield$this$tracker$s = _context4.sent;
                _context4.t2 = _context4.t3 !== null;
                if (!_context4.t2) {
                  _context4.next = 20;
                  break;
                }
                _context4.t2 = _yield$this$tracker$s !== void 0;
              case 20:
                _context4.t1 = _context4.t2;
                if (!_context4.t1) {
                  _context4.next = 23;
                  break;
                }
                _context4.t1 = _yield$this$tracker$s.has(location.spaceId);
              case 23:
                _context4.t0 = _context4.t1;
              case 24:
                if (!_context4.t0) {
                  _context4.next = 28;
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
              case 28:
                _context4.t4 = location.roomId;
                if (!_context4.t4) {
                  _context4.next = 40;
                  break;
                }
                _context4.next = 32;
                return this.tracker.rooms.get();
              case 32:
                _context4.t7 = _yield$this$tracker$r = _context4.sent;
                _context4.t6 = _context4.t7 !== null;
                if (!_context4.t6) {
                  _context4.next = 36;
                  break;
                }
                _context4.t6 = _yield$this$tracker$r !== void 0;
              case 36:
                _context4.t5 = _context4.t6;
                if (!_context4.t5) {
                  _context4.next = 39;
                  break;
                }
                _context4.t5 = _yield$this$tracker$r.has(location.roomId);
              case 39:
                _context4.t4 = _context4.t5;
              case 40:
                if (!_context4.t4) {
                  _context4.next = 44;
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
              case 44:
                _context4.t8 = location.topicId;
                if (!_context4.t8) {
                  _context4.next = 56;
                  break;
                }
                _context4.next = 48;
                return this.tracker.rooms.getTopics(location.roomId);
              case 48:
                _context4.t11 = _yield$this$tracker$r2 = _context4.sent;
                _context4.t10 = _context4.t11 !== null;
                if (!_context4.t10) {
                  _context4.next = 52;
                  break;
                }
                _context4.t10 = _yield$this$tracker$r2 !== void 0;
              case 52:
                _context4.t9 = _context4.t10;
                if (!_context4.t9) {
                  _context4.next = 55;
                  break;
                }
                _context4.t9 = _yield$this$tracker$r2.has(location.topicId);
              case 55:
                _context4.t8 = _context4.t9;
              case 56:
                if (!_context4.t8) {
                  _context4.next = 59;
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
              case 59:
                _context4.t12 = this;
                _context4.next = 62;
                return Promise.all(promises);
              case 62:
                _context4.t13 = _context4.sent;
                return _context4.abrupt("return", _context4.t12.resolveOverwritesHierarchy.call(_context4.t12, _context4.t13));
              case 64:
              case "end":
                return _context4.stop();
            }
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
      var _handleRoomDeleted = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee5(ev) {
        var room, _this$overwritesPromi2, ids;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.tracker.rooms.get();
              case 2:
                room = _context5.sent.get(ev.id);
                if (room) {
                  ids = this.deleteOverwritesByIdPrefix(getOvId({
                    spaceId: room.spaceId,
                    roomId: room.id
                  }));
                  (_this$overwritesPromi2 = this.overwritesPromises).forget.apply(_this$overwritesPromi2, PermissionsManager_toConsumableArray(ids));
                }
              case 4:
              case "end":
                return _context5.stop();
            }
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
      var _collectRoleOverwrites = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee6(location, userRoles) {
        var _this4 = this;
        var roleOverwrites;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return Promise.all(userRoles.map(function (roleId) {
                  return _this4.getOverwrites(location, {
                    type: 'Role',
                    roleId: roleId
                  });
                }));
              case 2:
                roleOverwrites = _context6.sent;
                return _context6.abrupt("return", this.resolveOverwritesFromRolesByOrder(location.spaceId, roleOverwrites));
              case 4:
              case "end":
                return _context6.stop();
            }
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
      var _resolveOverwritesFromRolesByOrder = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee7(spaceId, overwrites) {
        var allows, denies, roles, sortedOverwrites, permissionsLength;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                allows = 0, denies = 0;
                _context7.next = 3;
                return this.tracker.spaces.getRoles(spaceId);
              case 3:
                roles = _context7.sent;
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
                return _context7.abrupt("return", {
                  allow: allows,
                  deny: denies
                });
              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
      function resolveOverwritesFromRolesByOrder(_x9, _x10) {
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
      var _fetchMembersOrFail = PermissionsManager_asyncToGenerator( /*#__PURE__*/PermissionsManager_regeneratorRuntime().mark(function _callee8(location) {
        var results, spaceFail, roomFail, layer;
        return PermissionsManager_regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return Promise.all([location.spaceId ? this.tracker.spaces.getMe(location.spaceId) : null, location.roomId ? this.tracker.rooms.getMe(location.roomId) : null]);
              case 2:
                results = _context8.sent;
                spaceFail = location.spaceId && !results[0];
                roomFail = location.roomId && !results[1];
                if (!(spaceFail || roomFail)) {
                  _context8.next = 8;
                  break;
                }
                layer = spaceFail ? "space (".concat(location.spaceId, ")") : "room (".concat(location.roomId, ")");
                throw new Error("Attempting to calculate permissions for a ".concat(layer, " that the user does not belong to"));
              case 8:
                return _context8.abrupt("return", results);
              case 9:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
      function fetchMembersOrFail(_x11) {
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
  return PermissionsManager;
}(EventTarget);
;// CONCATENATED MODULE: ./src/state-tracker/EmoticonsManager.ts
function EmoticonsManager_typeof(obj) { "@babel/helpers - typeof"; return EmoticonsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, EmoticonsManager_typeof(obj); }
function EmoticonsManager_toConsumableArray(arr) { return EmoticonsManager_arrayWithoutHoles(arr) || EmoticonsManager_iterableToArray(arr) || EmoticonsManager_unsupportedIterableToArray(arr) || EmoticonsManager_nonIterableSpread(); }
function EmoticonsManager_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function EmoticonsManager_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return EmoticonsManager_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return EmoticonsManager_arrayLikeToArray(o, minLen); }
function EmoticonsManager_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function EmoticonsManager_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return EmoticonsManager_arrayLikeToArray(arr); }
function EmoticonsManager_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function EmoticonsManager_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ EmoticonsManager_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == EmoticonsManager_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function EmoticonsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function EmoticonsManager_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { EmoticonsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { EmoticonsManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function EmoticonsManager_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function EmoticonsManager_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, EmoticonsManager_toPropertyKey(descriptor.key), descriptor); } }
function EmoticonsManager_createClass(Constructor, protoProps, staticProps) { if (protoProps) EmoticonsManager_defineProperties(Constructor.prototype, protoProps); if (staticProps) EmoticonsManager_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function EmoticonsManager_defineProperty(obj, key, value) { key = EmoticonsManager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function EmoticonsManager_toPropertyKey(arg) { var key = EmoticonsManager_toPrimitive(arg, "string"); return EmoticonsManager_typeof(key) === "symbol" ? key : String(key); }
function EmoticonsManager_toPrimitive(input, hint) { if (EmoticonsManager_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (EmoticonsManager_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var GLOBAL_KEY = 'global';
var EmoticonsManager = /*#__PURE__*/function () {
  function EmoticonsManager(tracker) {
    var _this = this;
    EmoticonsManager_classCallCheck(this, EmoticonsManager);
    this.tracker = tracker;
    EmoticonsManager_defineProperty(this, "list", new IndexedCollection());
    EmoticonsManager_defineProperty(this, "emoticonsPromises", new PromiseRegistry());
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
  EmoticonsManager_createClass(EmoticonsManager, [{
    key: "get",
    value: function () {
      var _get = EmoticonsManager_asyncToGenerator( /*#__PURE__*/EmoticonsManager_regeneratorRuntime().mark(function _callee2(spaceId) {
        var _this2 = this;
        return EmoticonsManager_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.emoticonsPromises.notExist(spaceId)) {
                  this.emoticonsPromises.registerByFunction( /*#__PURE__*/EmoticonsManager_asyncToGenerator( /*#__PURE__*/EmoticonsManager_regeneratorRuntime().mark(function _callee() {
                    var result;
                    return EmoticonsManager_regeneratorRuntime().wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this2.tracker.client.send('GetEmoticons', {
                              spaceId: spaceId
                            });
                          case 2:
                            result = _context.sent;
                            if (!result.error) {
                              _context.next = 5;
                              break;
                            }
                            throw result.error;
                          case 5:
                            _this2.handleEmoticons(result.data);
                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  })), spaceId !== null && spaceId !== void 0 ? spaceId : GLOBAL_KEY);
                }
                _context2.next = 3;
                return this.emoticonsPromises.get(spaceId);
              case 3:
                return _context2.abrupt("return", this.list.get(spaceId));
              case 4:
              case "end":
                return _context2.stop();
            }
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
      collection === null || collection === void 0 ? void 0 : collection.set(ev.emoticon);
    }
  }, {
    key: "handleEmoticonDeleted",
    value: function handleEmoticonDeleted(ev) {
      var _ev$spaceId;
      var collection = this.list.get((_ev$spaceId = ev.spaceId) !== null && _ev$spaceId !== void 0 ? _ev$spaceId : GLOBAL_KEY);
      collection === null || collection === void 0 ? void 0 : collection["delete"](ev.emoticonId);
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
  return EmoticonsManager;
}();
;// CONCATENATED MODULE: ./src/state-tracker/ChatStateTracker.ts
function ChatStateTracker_typeof(obj) { "@babel/helpers - typeof"; return ChatStateTracker_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, ChatStateTracker_typeof(obj); }
function ChatStateTracker_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ ChatStateTracker_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == ChatStateTracker_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function ChatStateTracker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function ChatStateTracker_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ChatStateTracker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ChatStateTracker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ChatStateTracker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ChatStateTracker_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, ChatStateTracker_toPropertyKey(descriptor.key), descriptor); } }
function ChatStateTracker_createClass(Constructor, protoProps, staticProps) { if (protoProps) ChatStateTracker_defineProperties(Constructor.prototype, protoProps); if (staticProps) ChatStateTracker_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function ChatStateTracker_defineProperty(obj, key, value) { key = ChatStateTracker_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function ChatStateTracker_toPropertyKey(arg) { var key = ChatStateTracker_toPrimitive(arg, "string"); return ChatStateTracker_typeof(key) === "symbol" ? key : String(key); }
function ChatStateTracker_toPrimitive(input, hint) { if (ChatStateTracker_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (ChatStateTracker_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }





var ChatStateTracker = /*#__PURE__*/function () {
  /**
   * State of your permissions.
   */

  /**
   * State of the rooms you are in.
   */

  /**
   * State of the spaces you are in.
   */

  /**
   * State of the emoticons (global and space-related).
   */

  function ChatStateTracker(client) {
    var _this = this;
    ChatStateTracker_classCallCheck(this, ChatStateTracker);
    this.client = client;
    ChatStateTracker_defineProperty(this, "permissions", new PermissionsManager(this));
    ChatStateTracker_defineProperty(this, "rooms", new RoomsManager(this));
    ChatStateTracker_defineProperty(this, "spaces", new SpacesManager(this));
    ChatStateTracker_defineProperty(this, "emoticons", new EmoticonsManager(this));
    ChatStateTracker_defineProperty(this, "_me", null);
    ChatStateTracker_defineProperty(this, "deferredSession", new DeferredTask());
    this.client.on('Session', function (ev) {
      return _this.handleSession(ev);
    });
  }
  ChatStateTracker_createClass(ChatStateTracker, [{
    key: "me",
    get: function get() {
      return this._me;
    }
  }, {
    key: "getMe",
    value: function () {
      var _getMe = ChatStateTracker_asyncToGenerator( /*#__PURE__*/ChatStateTracker_regeneratorRuntime().mark(function _callee() {
        return ChatStateTracker_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.deferredSession.promise;
              case 2:
                return _context.abrupt("return", this._me);
              case 3:
              case "end":
                return _context.stop();
            }
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
  return ChatStateTracker;
}();
;// CONCATENATED MODULE: ./src/WebSocketChatClient.ts
function WebSocketChatClient_typeof(obj) { "@babel/helpers - typeof"; return WebSocketChatClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, WebSocketChatClient_typeof(obj); }
function WebSocketChatClient_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ WebSocketChatClient_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == WebSocketChatClient_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function WebSocketChatClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function WebSocketChatClient_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { WebSocketChatClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { WebSocketChatClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function WebSocketChatClient_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function WebSocketChatClient_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, WebSocketChatClient_toPropertyKey(descriptor.key), descriptor); } }
function WebSocketChatClient_createClass(Constructor, protoProps, staticProps) { if (protoProps) WebSocketChatClient_defineProperties(Constructor.prototype, protoProps); if (staticProps) WebSocketChatClient_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function WebSocketChatClient_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) WebSocketChatClient_setPrototypeOf(subClass, superClass); }
function WebSocketChatClient_setPrototypeOf(o, p) { WebSocketChatClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return WebSocketChatClient_setPrototypeOf(o, p); }
function WebSocketChatClient_createSuper(Derived) { var hasNativeReflectConstruct = WebSocketChatClient_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = WebSocketChatClient_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = WebSocketChatClient_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return WebSocketChatClient_possibleConstructorReturn(this, result); }; }
function WebSocketChatClient_possibleConstructorReturn(self, call) { if (call && (WebSocketChatClient_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return WebSocketChatClient_assertThisInitialized(self); }
function WebSocketChatClient_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function WebSocketChatClient_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function WebSocketChatClient_getPrototypeOf(o) { WebSocketChatClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return WebSocketChatClient_getPrototypeOf(o); }
function WebSocketChatClient_defineProperty(obj, key, value) { key = WebSocketChatClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function WebSocketChatClient_toPropertyKey(arg) { var key = WebSocketChatClient_toPrimitive(arg, "string"); return WebSocketChatClient_typeof(key) === "symbol" ? key : String(key); }
function WebSocketChatClient_toPrimitive(input, hint) { if (WebSocketChatClient_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (WebSocketChatClient_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var WebSocketChatClientEvent;
(function (WebSocketChatClientEvent) {
  WebSocketChatClientEvent["connect"] = "connect";
  WebSocketChatClientEvent["disconnect"] = "disconnect";
  WebSocketChatClientEvent["message"] = "message";
  WebSocketChatClientEvent["error"] = "error";
})(WebSocketChatClientEvent || (WebSocketChatClientEvent = {}));
var WebSocketChatClient = /*#__PURE__*/function (_AbstractChatClient) {
  WebSocketChatClient_inherits(WebSocketChatClient, _AbstractChatClient);
  var _super = WebSocketChatClient_createSuper(WebSocketChatClient);
  function WebSocketChatClient(options) {
    var _this$options$stateTr;
    var _this;
    WebSocketChatClient_classCallCheck(this, WebSocketChatClient);
    _this = _super.call(this);
    _this.options = options;
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "Event", WebSocketChatClientEvent);
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "state", void 0);
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "ws", null);
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "sendQueue", []);
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "connectingTimeoutId", void 0);
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "authenticated", void 0);
    WebSocketChatClient_defineProperty(WebSocketChatClient_assertThisInitialized(_this), "authenticatedResolvers", void 0);
    if (!_this.options.token && !_this.options.temporaryNick) {
      throw new Error('Token or temporary nick is required');
    }
    if ((_this$options$stateTr = _this.options.stateTracking) !== null && _this$options$stateTr !== void 0 ? _this$options$stateTr : true) {
      _this.state = new ChatStateTracker(WebSocketChatClient_assertThisInitialized(_this));
    }
    return _this;
  }
  WebSocketChatClient_createClass(WebSocketChatClient, [{
    key: "connect",
    value: function () {
      var _connect = WebSocketChatClient_asyncToGenerator( /*#__PURE__*/WebSocketChatClient_regeneratorRuntime().mark(function _callee() {
        var _this2 = this,
          _this$options$connect;
        var authString;
        return WebSocketChatClient_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                authString = this.options.token ? "token=".concat(this.options.token) : "nick=".concat(this.options.temporaryNick);
                this.ws = new WebSocket("".concat(this.options.url, "?").concat(authString));
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
                return _context.abrupt("return", new Promise(function () {
                  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }
                  return _this2.authenticatedResolvers = args;
                }));
              case 7:
              case "end":
                return _context.stop();
            }
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
      (_this$ws = this.ws) === null || _this$ws === void 0 ? void 0 : _this$ws.close();
      this.ws = null;
    }
  }, {
    key: "send",
    value: function () {
      var _send = WebSocketChatClient_asyncToGenerator( /*#__PURE__*/WebSocketChatClient_regeneratorRuntime().mark(function _callee2(commandType, commandData) {
        var envelope, promise;
        return WebSocketChatClient_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!this.ws || [this.ws.CLOSED, this.ws.CLOSING].includes(this.ws.readyState))) {
                  _context2.next = 2;
                  break;
                }
                throw new Error('Cannot send; close or closing connection state');
              case 2:
                envelope = this.createEnvelope(commandType, commandData);
                promise = this.createPromiseFromCommandEnvelope(envelope);
                if (!(this.ws.readyState === this.ws.CONNECTING || !this.authenticated)) {
                  _context2.next = 7;
                  break;
                }
                this.sendQueue.push(envelope);
                return _context2.abrupt("return", promise);
              case 7:
                if (!(this.ws.readyState !== this.ws.OPEN)) {
                  _context2.next = 9;
                  break;
                }
                throw new Error("Invalid websocket state=".concat(this.ws.readyState));
              case 9:
                this.sendEnvelope(envelope);
                return _context2.abrupt("return", promise);
              case 11:
              case "end":
                return _context2.stop();
            }
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
      this.ws.send(JSON.stringify(envelope));
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
        var isAuthenticated = envelope.type !== 'Error';
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
        this.connect();
      }
      this.emit(this.Event.disconnect, reconnect);
    }
  }, {
    key: "sendFromQueue",
    value: function sendFromQueue() {
      var _this3 = this;
      // Send awaiting data to server
      var lastDelay = 0;
      var _loop = function _loop(dataIndex) {
        var _this3$options$awaitQ;
        var envelope = _this3.sendQueue[dataIndex];
        setTimeout(function () {
          return _this3.sendEnvelope(envelope);
        }, lastDelay);
        lastDelay += (_this3$options$awaitQ = _this3.options.awaitQueueSendDelayMs) !== null && _this3$options$awaitQ !== void 0 ? _this3$options$awaitQ : 500;
      };
      for (var dataIndex in this.sendQueue) {
        _loop(dataIndex);
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
  }]);
  return WebSocketChatClient;
}(AbstractChatClient);
;// CONCATENATED MODULE: ./src/WebApiChatClient.ts
function WebApiChatClient_typeof(obj) { "@babel/helpers - typeof"; return WebApiChatClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, WebApiChatClient_typeof(obj); }
function WebApiChatClient_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ WebApiChatClient_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == WebApiChatClient_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function WebApiChatClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function WebApiChatClient_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { WebApiChatClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { WebApiChatClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function WebApiChatClient_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function WebApiChatClient_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, WebApiChatClient_toPropertyKey(descriptor.key), descriptor); } }
function WebApiChatClient_createClass(Constructor, protoProps, staticProps) { if (protoProps) WebApiChatClient_defineProperties(Constructor.prototype, protoProps); if (staticProps) WebApiChatClient_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function WebApiChatClient_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) WebApiChatClient_setPrototypeOf(subClass, superClass); }
function WebApiChatClient_setPrototypeOf(o, p) { WebApiChatClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return WebApiChatClient_setPrototypeOf(o, p); }
function WebApiChatClient_createSuper(Derived) { var hasNativeReflectConstruct = WebApiChatClient_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = WebApiChatClient_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = WebApiChatClient_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return WebApiChatClient_possibleConstructorReturn(this, result); }; }
function WebApiChatClient_possibleConstructorReturn(self, call) { if (call && (WebApiChatClient_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return WebApiChatClient_assertThisInitialized(self); }
function WebApiChatClient_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function WebApiChatClient_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function WebApiChatClient_getPrototypeOf(o) { WebApiChatClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return WebApiChatClient_getPrototypeOf(o); }
function WebApiChatClient_defineProperty(obj, key, value) { key = WebApiChatClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function WebApiChatClient_toPropertyKey(arg) { var key = WebApiChatClient_toPrimitive(arg, "string"); return WebApiChatClient_typeof(key) === "symbol" ? key : String(key); }
function WebApiChatClient_toPrimitive(input, hint) { if (WebApiChatClient_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (WebApiChatClient_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var WebApiChatClientEvent;
(function (WebApiChatClientEvent) {
  WebApiChatClientEvent["message"] = "message";
  WebApiChatClientEvent["error"] = "error";
  WebApiChatClientEvent["destroy"] = "destroy";
})(WebApiChatClientEvent || (WebApiChatClientEvent = {}));
var WebApiChatClient = /*#__PURE__*/function (_AbstractChatClient) {
  WebApiChatClient_inherits(WebApiChatClient, _AbstractChatClient);
  var _super = WebApiChatClient_createSuper(WebApiChatClient);
  function WebApiChatClient(options) {
    var _this;
    WebApiChatClient_classCallCheck(this, WebApiChatClient);
    _this = _super.call(this);
    _this.options = options;
    WebApiChatClient_defineProperty(WebApiChatClient_assertThisInitialized(_this), "Event", WebApiChatClientEvent);
    WebApiChatClient_defineProperty(WebApiChatClient_assertThisInitialized(_this), "sendStack", void 0);
    if (!_this.options.token && !_this.options.temporaryNick) {
      throw new Error('Token or temporary nick is required');
    }
    return _this;
  }
  WebApiChatClient_createClass(WebApiChatClient, [{
    key: "send",
    value: function () {
      var _send = WebApiChatClient_asyncToGenerator( /*#__PURE__*/WebApiChatClient_regeneratorRuntime().mark(function _callee(commandType, commandData) {
        var envelope;
        return WebApiChatClient_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                envelope = this.createEnvelope(commandType, commandData);
                this.sendStack.push({
                  data: envelope,
                  attempts: 0,
                  lastTimeoutId: null
                });
                this.makeApiCall(this.sendStack.length - 1);
                return _context.abrupt("return", this.createPromiseFromCommandEnvelope(envelope));
              case 4:
              case "end":
                return _context.stop();
            }
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
      var _onMessage = WebApiChatClient_asyncToGenerator( /*#__PURE__*/WebApiChatClient_regeneratorRuntime().mark(function _callee2(reqId, response) {
        var envelope;
        return WebApiChatClient_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.sendStack.splice(reqId, 1);
                _context2.next = 3;
                return response.json();
              case 3:
                envelope = _context2.sent;
                this.handleIncomingEnvelope(envelope);
                this.emit(envelope.type, envelope.data);
                this.emit(this.Event.message, envelope);
              case 7:
              case "end":
                return _context2.stop();
            }
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
      var _this4 = this;
      this.sendStack[reqId].attempts++;
      var bodyJson = JSON.stringify(this.sendStack[reqId].data);
      var headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      if (this.options.token) {
        headers.Authorization = "Bearer ".concat(this.options.token);
      } else if (this.options.temporaryNick) {
        headers.Authorization = "Temp ".concat(this.options.temporaryNick);
      }
      fetch(this.options.url, {
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
  return WebApiChatClient;
}(AbstractChatClient);
;// CONCATENATED MODULE: ./src/AbstractRestClient.ts
function AbstractRestClient_typeof(obj) { "@babel/helpers - typeof"; return AbstractRestClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, AbstractRestClient_typeof(obj); }
function AbstractRestClient_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ AbstractRestClient_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == AbstractRestClient_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function AbstractRestClient_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function AbstractRestClient_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? AbstractRestClient_ownKeys(Object(source), !0).forEach(function (key) { AbstractRestClient_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : AbstractRestClient_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function AbstractRestClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function AbstractRestClient_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { AbstractRestClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { AbstractRestClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function AbstractRestClient_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function AbstractRestClient_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, AbstractRestClient_toPropertyKey(descriptor.key), descriptor); } }
function AbstractRestClient_createClass(Constructor, protoProps, staticProps) { if (protoProps) AbstractRestClient_defineProperties(Constructor.prototype, protoProps); if (staticProps) AbstractRestClient_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function AbstractRestClient_defineProperty(obj, key, value) { key = AbstractRestClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AbstractRestClient_toPropertyKey(arg) { var key = AbstractRestClient_toPrimitive(arg, "string"); return AbstractRestClient_typeof(key) === "symbol" ? key : String(key); }
function AbstractRestClient_toPrimitive(input, hint) { if (AbstractRestClient_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (AbstractRestClient_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var AbstractRestClient = /*#__PURE__*/function () {
  function AbstractRestClient(options) {
    AbstractRestClient_classCallCheck(this, AbstractRestClient);
    this.options = options;
    AbstractRestClient_defineProperty(this, "defaultUrl", void 0);
  }
  AbstractRestClient_createClass(AbstractRestClient, [{
    key: "send",
    value: function () {
      var _send = AbstractRestClient_asyncToGenerator( /*#__PURE__*/AbstractRestClient_regeneratorRuntime().mark(function _callee(method, uri) {
        var data,
          url,
          body,
          headers,
          result,
          _args = arguments;
        return AbstractRestClient_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
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
                _context.next = 7;
                return fetch(url, {
                  method: method,
                  body: body,
                  headers: headers
                });
              case 7:
                result = _context.sent;
                return _context.abrupt("return", this.convertFetchResponse(result));
              case 9:
              case "end":
                return _context.stop();
            }
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
      var _convertFetchResponse = AbstractRestClient_asyncToGenerator( /*#__PURE__*/AbstractRestClient_regeneratorRuntime().mark(function _callee2(result) {
        var _result$headers$get;
        return AbstractRestClient_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = result.ok;
                _context2.t1 = result.status;
                if (!((_result$headers$get = result.headers.get('content-type')) !== null && _result$headers$get !== void 0 && _result$headers$get.includes('json'))) {
                  _context2.next = 8;
                  break;
                }
                _context2.next = 5;
                return result.json();
              case 5:
                _context2.t2 = _context2.sent;
                _context2.next = 11;
                break;
              case 8:
                _context2.next = 10;
                return result.text();
              case 10:
                _context2.t2 = _context2.sent;
              case 11:
                _context2.t3 = _context2.t2;
                return _context2.abrupt("return", {
                  ok: _context2.t0,
                  status: _context2.t1,
                  data: _context2.t3
                });
              case 13:
              case "end":
                return _context2.stop();
            }
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
  return AbstractRestClient;
}();
;// CONCATENATED MODULE: ./src/AuthClient.ts
function AuthClient_typeof(obj) { "@babel/helpers - typeof"; return AuthClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, AuthClient_typeof(obj); }
function AuthClient_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ AuthClient_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == AuthClient_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function AuthClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function AuthClient_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { AuthClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { AuthClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function AuthClient_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function AuthClient_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, AuthClient_toPropertyKey(descriptor.key), descriptor); } }
function AuthClient_createClass(Constructor, protoProps, staticProps) { if (protoProps) AuthClient_defineProperties(Constructor.prototype, protoProps); if (staticProps) AuthClient_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function AuthClient_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) AuthClient_setPrototypeOf(subClass, superClass); }
function AuthClient_setPrototypeOf(o, p) { AuthClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return AuthClient_setPrototypeOf(o, p); }
function AuthClient_createSuper(Derived) { var hasNativeReflectConstruct = AuthClient_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = AuthClient_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = AuthClient_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return AuthClient_possibleConstructorReturn(this, result); }; }
function AuthClient_possibleConstructorReturn(self, call) { if (call && (AuthClient_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return AuthClient_assertThisInitialized(self); }
function AuthClient_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function AuthClient_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function AuthClient_getPrototypeOf(o) { AuthClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return AuthClient_getPrototypeOf(o); }
function AuthClient_defineProperty(obj, key, value) { key = AuthClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function AuthClient_toPropertyKey(arg) { var key = AuthClient_toPrimitive(arg, "string"); return AuthClient_typeof(key) === "symbol" ? key : String(key); }
function AuthClient_toPrimitive(input, hint) { if (AuthClient_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (AuthClient_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var AuthClient = /*#__PURE__*/function (_AbstractRestClient) {
  AuthClient_inherits(AuthClient, _AbstractRestClient);
  var _super = AuthClient_createSuper(AuthClient);
  function AuthClient() {
    var _this;
    AuthClient_classCallCheck(this, AuthClient);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    AuthClient_defineProperty(AuthClient_assertThisInitialized(_this), "defaultUrl", 'https://polfan.pl/webservice/api');
    return _this;
  }
  AuthClient_createClass(AuthClient, [{
    key: "deleteToken",
    value: function () {
      var _deleteToken = AuthClient_asyncToGenerator( /*#__PURE__*/AuthClient_regeneratorRuntime().mark(function _callee(token) {
        var response;
        return AuthClient_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.send('DELETE', "auth/tokens/".concat(token));
              case 2:
                response = _context.sent;
                if (response.ok) {
                  _context.next = 5;
                  break;
                }
                throw new Error("Cannot delete access token: ".concat(response.data.errors[0]));
              case 5:
              case "end":
                return _context.stop();
            }
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
      var _getMe = AuthClient_asyncToGenerator( /*#__PURE__*/AuthClient_regeneratorRuntime().mark(function _callee2() {
        var response;
        return AuthClient_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.send('GET', 'auth/me');
              case 2:
                response = _context2.sent;
                if (!response.ok) {
                  _context2.next = 6;
                  break;
                }
                response.data.id = response.data.id.toString();
                return _context2.abrupt("return", response.data);
              case 6:
                throw new Error("Cannot get current user account: ".concat(response.data.errors[0]));
              case 7:
              case "end":
                return _context2.stop();
            }
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
      var _createToken = AuthClient_asyncToGenerator( /*#__PURE__*/AuthClient_regeneratorRuntime().mark(function _callee3(login, password) {
        var clientName,
          response,
          _args3 = arguments;
        return AuthClient_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                clientName = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 'pserv-js-client';
                _context3.next = 3;
                return new AuthClient({
                  token: null
                }).send('POST', 'auth/tokens', {
                  login: login,
                  password: password,
                  client_name: clientName
                });
              case 3:
                response = _context3.sent;
                if (!response.ok) {
                  _context3.next = 6;
                  break;
                }
                return _context3.abrupt("return", response.data);
              case 6:
                throw new Error("Cannot create user token: ".concat(response.data.errors[0]));
              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      function createToken(_x2, _x3) {
        return _createToken.apply(this, arguments);
      }
      return createToken;
    }()
  }]);
  return AuthClient;
}(AbstractRestClient);
;// CONCATENATED MODULE: ./src/FilesClient.ts
function FilesClient_typeof(obj) { "@babel/helpers - typeof"; return FilesClient_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, FilesClient_typeof(obj); }
function FilesClient_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ FilesClient_regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == FilesClient_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function FilesClient_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function FilesClient_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? FilesClient_ownKeys(Object(source), !0).forEach(function (key) { FilesClient_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : FilesClient_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function FilesClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function FilesClient_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { FilesClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { FilesClient_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function FilesClient_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function FilesClient_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, FilesClient_toPropertyKey(descriptor.key), descriptor); } }
function FilesClient_createClass(Constructor, protoProps, staticProps) { if (protoProps) FilesClient_defineProperties(Constructor.prototype, protoProps); if (staticProps) FilesClient_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function FilesClient_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) FilesClient_setPrototypeOf(subClass, superClass); }
function FilesClient_setPrototypeOf(o, p) { FilesClient_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return FilesClient_setPrototypeOf(o, p); }
function FilesClient_createSuper(Derived) { var hasNativeReflectConstruct = FilesClient_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = FilesClient_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = FilesClient_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return FilesClient_possibleConstructorReturn(this, result); }; }
function FilesClient_possibleConstructorReturn(self, call) { if (call && (FilesClient_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return FilesClient_assertThisInitialized(self); }
function FilesClient_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function FilesClient_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function FilesClient_getPrototypeOf(o) { FilesClient_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return FilesClient_getPrototypeOf(o); }
function FilesClient_defineProperty(obj, key, value) { key = FilesClient_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function FilesClient_toPropertyKey(arg) { var key = FilesClient_toPrimitive(arg, "string"); return FilesClient_typeof(key) === "symbol" ? key : String(key); }
function FilesClient_toPrimitive(input, hint) { if (FilesClient_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (FilesClient_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var FilesClient = /*#__PURE__*/function (_AbstractRestClient) {
  FilesClient_inherits(FilesClient, _AbstractRestClient);
  var _super = FilesClient_createSuper(FilesClient);
  function FilesClient() {
    var _this;
    FilesClient_classCallCheck(this, FilesClient);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    FilesClient_defineProperty(FilesClient_assertThisInitialized(_this), "defaultUrl", 'https://polfan.pl/webservice/api/files');
    return _this;
  }
  FilesClient_createClass(FilesClient, [{
    key: "uploadFile",
    value: function () {
      var _uploadFile = FilesClient_asyncToGenerator( /*#__PURE__*/FilesClient_regeneratorRuntime().mark(function _callee(file) {
        var formData, headers, response;
        return FilesClient_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                formData = new FormData();
                formData.append('file', file);
                headers = FilesClient_objectSpread(FilesClient_objectSpread({}, this.getAuthHeaders()), {}, {
                  Accept: 'application/json'
                });
                _context.next = 5;
                return fetch(this.defaultUrl, {
                  method: 'POST',
                  body: formData,
                  headers: headers
                });
              case 5:
                response = _context.sent;
                return _context.abrupt("return", this.convertFetchResponse(response));
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function uploadFile(_x) {
        return _uploadFile.apply(this, arguments);
      }
      return uploadFile;
    }()
  }, {
    key: "getFileMetadata",
    value: function () {
      var _getFileMetadata = FilesClient_asyncToGenerator( /*#__PURE__*/FilesClient_regeneratorRuntime().mark(function _callee2(id) {
        return FilesClient_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.send('GET', '/' + id));
              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function getFileMetadata(_x2) {
        return _getFileMetadata.apply(this, arguments);
      }
      return getFileMetadata;
    }()
  }]);
  return FilesClient;
}(AbstractRestClient);
;// CONCATENATED MODULE: ./src/index.ts







/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map