"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default2;

var JFlowInstance = _interopRequireWildcard(require("../../core/flow"));

var _objectDiff = _interopRequireDefault(require("object-diff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default2(nameNode) {
  var bulder = typeof nameNode === 'string' ? JFlowInstance[nameNode] : nameNode;
  return {
    inject: ['addToStack', 'removeFromStack', 'addNameToRootStack'],
    props: {
      configs: {
        type: Object,
        "default": function _default() {
          return {};
        }
      },
      visible: {
        type: Boolean,
        "default": true
      },
      jflowId: {
        type: String
      }
    },
    watch: {
      configs: function configs(val, oldVal) {
        // console.log(val, JSON.stringify(val) === JSON.stringify(oldVal), )
        var diffed = (0, _objectDiff["default"])(val, oldVal);

        if (Object.keys(diffed).length === 0) {
          return;
        } // 
        // const reflowKeys = Object.keys(diffed).filter(k => {
        //     const lk = k.toLowerCase();
        //     return !(lk.endsWith('color') || k.endsWith('style'));
        // });


        this._jflowInstance.setConfig(val); // console.log('recalculateUp')
        // this._jflowInstance.recalculateUp();
        // console.log(reflowKeys.length, val)
        // if(reflowKeys.length) {
        //     this._jflowInstance._belongs.recalculateUp();
        // } 
        // this._jflowInstance._jflow._render();

      },
      '$listeners': function $listeners(val, oldVal) {
        var _this = this;

        var news = [];
        var deletes = [];
        var vnew = Object.keys(val).map(function (e) {
          return {
            event: e,
            handler: val[e]
          };
        });
        var vold = Object.keys(oldVal).map(function (e) {
          return {
            event: e,
            handler: oldVal[e]
          };
        });
        vnew.forEach(function (v) {
          var hnew = v.handler;

          if (!vold.find(function (q) {
            return q.handler === hnew;
          })) {
            news.push(v);
          }
        });
        vold.forEach(function (v) {
          var hold = v.handler;

          if (!vnew.find(function (q) {
            return q.handler === hold;
          })) {
            deletes.push(v);
          }
        });
        news.forEach(function (v) {
          _this._jflowInstance.addEventListener(v.event, v.handler);
        });
        deletes.forEach(function (v) {
          _this._jflowInstance.removeEventListener(v.event, v.handler);
        });
      },
      visible: function visible(val) {
        this._jflowInstance.visible = val; // this._jflowInstance._belongs.recalculateUp();
        // this._jflowInstance._jflow._render();
      }
    },
    render: function render(createElement) {
      return null;
    },
    created: function created() {
      this._jflowInstance = new bulder(this.configs);
      this._jflowInstance.visible = this.visible;
      this.bindListeners();
      this.addToStack(this._jflowInstance, this.jflowId);
    },
    // updated() {
    //     console.log('recalculateUp')
    // },
    destroyed: function destroyed() {
      this.removeFromStack(this._jflowInstance);
    },
    methods: {
      bindListeners: function bindListeners() {
        var _this2 = this;

        Object.keys(this.$listeners).map(function (event) {
          var func = _this2.$listeners[event];

          _this2._jflowInstance.addEventListener(event, func);
        });
      }
    }
  };
}
//# sourceMappingURL=JFlowInstance.js.map
