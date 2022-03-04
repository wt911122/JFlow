"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("../node"));

var _constance = require("../../utils/constance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
 * 胶囊单元 配置
 * @typedef {Node~Configs} Capsule~CapsuleConfigs
 * @property {number} width  - 内部矩形宽
 * @property {number} height - 内部矩形高
 */

/**
 * 胶囊单元
 * @constructor Capsule
 * @extends Node
 * @param {Capsule~CapsuleConfigs} configs - 配置
 */
var Capsule = /*#__PURE__*/function (_Node) {
  _inherits(Capsule, _Node);

  var _super = _createSuper(Capsule);

  function Capsule() {
    var _this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Capsule);

    _this = _super.call(this, configs);
    _this.type = 'Capsule';
    _this.width = configs.width || 20;
    _this.height = configs.height || 10;
    return _this;
  }

  _createClass(Capsule, [{
    key: "render",
    value: function render(ctx) {
      ctx.save();

      if (this._isMoving) {
        ctx.globalAlpha = 0.6;
      }

      ctx.beginPath();

      var _this$anchor = _slicedToArray(this.anchor, 2),
          x = _this$anchor[0],
          y = _this$anchor[1];

      var hw = this.width / 2;
      var hh = this.height / 2;
      var leftCenter = x - hw + hh;
      var rightCenter = x + hw - hh;
      var top = y - hh;
      var bottom = y + hh;
      ctx.moveTo(leftCenter, top);
      ctx.lineTo(rightCenter, top);
      ctx.arc(rightCenter, y, hh, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(leftCenter, bottom);
      ctx.arc(leftCenter, y, hh, Math.PI / 2, Math.PI / 2 * 3);
      ctx.fillStyle = this.backgroundColor;
      ctx.fill();

      if (this.borderWidth) {
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
      } // ctx.fillStyle = 'rgba(0,0,0,0.3)';
      // ctx.fillRect(x-hw, y-hh, this.width, this.height)


      ctx.restore();
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      var anchor = this.anchor;
      var hw = this.width / 2;
      var hh = this.height / 2;
      var ww = Math.abs(hw - hh);
      var leftCenter = anchor[0] - hw + hh;
      var rightCenter = anchor[0] + hw - hh;
      var rr = hh * hh;
      return point[0] > anchor[0] - ww && point[0] < anchor[0] + ww && point[1] > anchor[1] - hh && point[1] < anchor[1] + hh || Math.pow(point[0] - leftCenter, 2) + Math.pow(point[1] - anchor[1], 2) < rr || Math.pow(point[0] - rightCenter, 2) + Math.pow(point[1] - anchor[1], 2) < rr;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var anchor = this.anchor;
      var w = this.width / 2;
      var h = this.height / 2;
      var ltx = anchor[0] - w;
      var lty = anchor[1] - h;
      var rbx = anchor[0] + w;
      var rby = anchor[1] + h;
      return [[ltx, lty], [rbx, lty], [rbx, rby], [ltx, rby]];
    }
  }, {
    key: "getBoundingDimension",
    value: function getBoundingDimension() {
      return {
        height: this.height,
        width: this.width
      };
    }
  }, {
    key: "getIntersectionsInFourDimension",
    value: function getIntersectionsInFourDimension() {
      var _ref;

      var p2 = this.anchor;

      if (this._belongs && this._belongs.calculateToCoordination) {
        p2 = this._belongs.calculateToCoordination(p2);
      }

      var _p = p2,
          _p2 = _slicedToArray(_p, 2),
          x2 = _p2[0],
          y2 = _p2[1];

      var w = this.width / 2;
      var h = this.height / 2;
      return _ref = {}, _defineProperty(_ref, _constance.DIRECTION.RIGHT, [x2 + w, y2]), _defineProperty(_ref, _constance.DIRECTION.LEFT, [x2 - w, y2]), _defineProperty(_ref, _constance.DIRECTION.BOTTOM, [x2, y2 + h]), _defineProperty(_ref, _constance.DIRECTION.TOP, [x2, y2 - h]), _ref;
    }
  }]);

  return Capsule;
}(_node["default"]);

var _default = Capsule;
exports["default"] = _default;
//# sourceMappingURL=capsule.js.map
