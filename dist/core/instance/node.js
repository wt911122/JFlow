"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _instance = _interopRequireDefault(require("./instance"));

var _constance = require("../utils/constance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * 绝对定位 配置， 绝对定位不受布局影响，相对于当前组来定位
 * @typedef {object} Node~AbsolutePosition 
 * @property {number} top       - 上距离
 * @property {number} bottom    - 下距离
 * @property {number} right     - 右距离
 * @property {number} left      - 左距离
 */

/**
 * Node 配置
 * @typedef {Instance~Configs} Node~Configs 
 * @property {number[]} anchor - 坐标
 * @property {Node~AbsolutePosition} absolutePosition - 绝对定位位置
 */

/**
 * 节点基类
 * @constructor Node
 * @extends Instance
 * @param {Node~Configs} configs - 节点配置
 */
var Node = /*#__PURE__*/function (_Instance) {
  _inherits(Node, _Instance);

  var _super = _createSuper(Node);

  function Node() {
    var _this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Node);

    _this = _super.call(this, configs);
    _this._rawConfigs = configs; // for layout
    // this._intersections = [];

    _this.anchor = configs.anchor || [0, 0];
    _this.absolutePosition = configs.absolutePosition; // this.margin =   configs.margin || 5;

    return _this;
  }

  _createClass(Node, [{
    key: "setConfig",
    value: function setConfig(configs) {
      var _this2 = this;

      Object.keys(configs).forEach(function (k) {
        if (configs[k] !== undefined && configs[k] !== null) {
          _this2[k] = configs[k];
          _this2._rawConfigs[k] = configs[k];
        }
      });
    } // end: from | to
    // from 逆时针, to 顺时针
    // checkLinked(interDir, end) {
    //     if(this._intersections.find(i => i === interDir)) {
    //         interDir = nextDirection(interDir, end === 'to');
    //     } else {
    //         this._intersections.push(interDir)
    //     }
    //     return interDir;
    // }

    /* renderFocus(ctx) {
        const points = this.getBoundingRect();
        if(points.length !== 4) return;
        const margin = this.margin;
        const [p0, p1, p2, p3] = points;
        const width = p1[0] - p0[0];
        const height = p3[1] - p0[1];
        const w = width * 0.2;
        const h = height * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0[0] - margin, p0[1] - margin + h);
        ctx.lineTo(p0[0] - margin, p0[1] - margin);
        ctx.lineTo(p0[0] - margin + w, p0[1] - margin);
        ctx.stroke();
         ctx.beginPath();
        ctx.moveTo(p1[0] + margin - w, p1[1] - margin);
        ctx.lineTo(p1[0] + margin, p1[1] - margin);
        ctx.lineTo(p1[0] + margin, p1[1] - margin + h);
        ctx.stroke();
         ctx.beginPath();
        ctx.moveTo(p2[0] + margin, p2[1] + margin - h);
        ctx.lineTo(p2[0] + margin, p2[1] + margin);
        ctx.lineTo(p2[0] + margin - w, p2[1] + margin);
        ctx.stroke();
         ctx.beginPath();
        ctx.moveTo(p3[0] - margin + w, p3[1] + margin);
        ctx.lineTo(p3[0] - margin, p3[1] + margin);
        ctx.lineTo(p3[0] - margin, p3[1] + margin - h);
        ctx.stroke();
        ctx.restore();
    } */

    /**
     * 克隆当前节点.
     * @return {Node} 当前节点的副本
     */

  }, {
    key: "clone",
    value: function clone() {
      var C = this.constructor;
      var t = new C(this._rawConfigs);
      return t;
    }
  }]);

  return Node;
}(_instance["default"]);

var _default = Node;
exports["default"] = _default;
//# sourceMappingURL=node.js.map
