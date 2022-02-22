"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default2;

var JFlowInstance = _interopRequireWildcard(require("../../core/flow"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default2(nameNode, isLink) {
  return {
    inject: ['addToLinkStack', 'removeFromLinkStack', 'getInstanceByJFlowId'],
    props: {
      configs: {
        type: Object,
        "default": function _default() {
          return {};
        }
      },
      from: String,
      to: String
    },
    watch: {
      from: function from() {
        this.resetLink();
      },
      to: function to() {
        this.resetLink();
      },
      configs: function configs(val, oldVal) {
        if (val.backgroundColor !== oldVal.backgroundColor) {
          this._jflowInstance.backgroundColor = val.backgroundColor;
        }
      }
    },
    render: function render(createElement) {
      return null;
    },
    created: function created() {
      var fromInstance = this.getInstanceByJFlowId(this.from);
      var toInstance = this.getInstanceByJFlowId(this.to);
      var key = this.$vnode.key;

      if (fromInstance && toInstance) {
        this._jflowInstance = new JFlowInstance[nameNode](_objectSpread(_objectSpread({}, this.configs), {}, {
          key: key,
          from: fromInstance,
          to: toInstance
        }));
        this.bindListeners();
        this.addToLinkStack(this._jflowInstance);
      }
    },
    methods: {
      resetLink: function resetLink() {
        var fromInstance = this.getInstanceByJFlowId(this.from);
        var toInstance = this.getInstanceByJFlowId(this.to);
        this._jflowInstance.from = fromInstance;
        this._jflowInstance.to = toInstance;
      },
      bindListeners: function bindListeners() {
        var _this = this;

        Object.keys(this.$listeners).map(function (event) {
          var func = _this.$listeners[event];

          _this._jflowInstance.addEventListener(event, func);
        });
      }
    },
    destroyed: function destroyed() {
      if (this._jflowInstance) {
        this.removeFromLinkStack(this._jflowInstance);
      }
    }
  };
}
//# sourceMappingURL=JFlowLink.js.map
