"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _flow = _interopRequireDefault(require("../../core/flow"));

var _StackMixin = _interopRequireDefault(require("./StackMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default2 = {
  mixins: [_StackMixin["default"]],
  provide: function provide() {
    return {
      renderJFlow: this.renderJFlow,
      addNameToRootStack: this.addNameToRootStack
    };
  },
  props: {
    configs: {
      type: Object,
      "default": function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      nodes: [],
      links: []
    };
  },
  render: function render(createElement) {
    var _this = this;

    if (!this.nodes.length) {
      return createElement('div', this.$slots["default"]);
    } else {
      var vnodes = this.nodes.map(function (_ref) {
        var type = _ref.type,
            configs = _ref.configs,
            meta = _ref.meta;

        if (!_this.$scopedSlots[type]) {
          if (_this.$scopedSlots['jflowcommon']) {
            type = 'jflowcommon';
          } else {
            return;
          }
        }

        var _this$$scopedSlots$ty = _this.$scopedSlots[type]({
          configs: configs,
          meta: meta
        }),
            _this$$scopedSlots$ty2 = _slicedToArray(_this$$scopedSlots$ty, 1),
            vnode = _this$$scopedSlots$ty2[0];

        meta.getJflowInstance = function () {
          // 只支持一个元素
          var instance = vnode.componentInstance;

          while (instance && !instance._jflowInstance) {
            instance = instance.$children[0];
          } // TODO 优化下这里的逻辑


          instance._jflowInstance._layoutNode = meta;
          return instance._jflowInstance;
        };

        vnode.key = configs.id;
        return vnode;
      });
      var vlinks = this.links.map(function (meta) {
        var type = meta.type || 'plainlink';

        if (!_this.$scopedSlots[type]) {
          return null;
        }

        var _this$$scopedSlots$ty3 = _this.$scopedSlots[type]({
          configs: meta
        }),
            _this$$scopedSlots$ty4 = _slicedToArray(_this$$scopedSlots$ty3, 1),
            vnode = _this$$scopedSlots$ty4[0];

        vnode.key = "".concat(meta.from, "-").concat(meta.to, "-").concat(meta.part);
        return vnode;
      });
      return createElement('div', [].concat(_toConsumableArray(vnodes), _toConsumableArray(vlinks)));
    }
  },
  created: function created() {
    this._jflowInstance = new _flow["default"](this.configs);
  },
  mounted: function mounted() {
    var _this2 = this;

    // this._jflowInstance = new JFlow(this.configs);
    this.nodes = this._jflowInstance._layout.flowStack.map(function (meta) {
      return {
        type: meta.type,
        configs: meta.configs,
        meta: meta.layoutMeta
      };
    });
    this.links = this._jflowInstance._layout.flowLinkStack.slice();
    this.$nextTick(function () {
      _this2._jflowInstance.$mount(_this2.$el); // this._jflowInstance.addEventListener('drop', (e) => {
      //     const astblock = e.detail.instance;
      //     const node = {
      //         type: astblock.type,
      //         configs: astblock,
      //         meta: {},
      //     };
      //     this.nodes.push(node);
      //     this.$nextTick(() => {
      //         node.meta.getJflowInstance().anchor = e.detail.point
      //         this.renderJFlow();
      //     })
      // })

    });
    Object.keys(this.$listeners).map(function (event) {
      var func = _this2.$listeners[event].bind(_this2);

      _this2._jflowInstance.addEventListener(event, func);
    });
  },
  methods: {
    /**
     * 绘制之前，vnode渲染之后
     * @name j-jflow~preCallback
     * @function
     */

    /**
     * 重排
     * @param {j-jflow~preCallback} preCallback - JFlow 绘制之前，vnode渲染之后
     */
    reflow: function reflow(preCallback) {
      var _this3 = this;

      var layoutNodes = this._jflowInstance._layout.flowStack.map(function (meta) {
        return {
          type: meta.type,
          configs: meta.configs,
          meta: meta.layoutMeta
        };
      });
      /* no free Nodes
      const freeNodes = []
      this.nodes.forEach(n => {
          if(!layoutNodes.find(ln => ln.configs.id === n.configs.id)){
              freeNodes.push(n)
          }
      })
      this.nodes = layoutNodes.concat(freeNodes);
      */


      this.nodes = layoutNodes;
      this.links = this._jflowInstance._layout.flowLinkStack.slice();
      this.$nextTick(function () {
        if (preCallback) {
          preCallback();
        }

        _this3._jflowInstance.recalculate();

        _this3._jflowInstance._render();
      });
    },

    /**
     * 获取单签 JFlow 实例
     * @return {Jflow} - JFlow对象
     */
    getInstance: function getInstance() {
      return this._jflowInstance;
    },

    /**
     * 手动触发绘制
     */
    renderJFlow: function renderJFlow() {
      this._jflowInstance._render();
    },
    addNameToRootStack: function addNameToRootStack(instance, jflowId) {
      this.stack.push({
        jflowId: jflowId,
        instance: instance
      });
    }
  }
};
exports["default"] = _default2;
//# sourceMappingURL=JFlow.js.map
