"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("../node"));

var _constance = require("../../utils/constance");

var _functions = require("../../utils/functions");

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
 * 钻石形单元 配置
 * @typedef {Node~Configs} Diamond~DiamondConfigs
 * @property {number} width  - 内部矩形宽
 * @property {number} height - 内部矩形高
 * @property {number} side   - 两侧三角形的宽
 */

/**
 * 钻石形单元
 * @constructor Diamond
 * @param {Diamond~DiamondConfigs} configs - 配置
 * @extends Node
 */
var Diamond = /*#__PURE__*/function (_Node) {
  _inherits(Diamond, _Node);

  var _super = _createSuper(Diamond);

  function Diamond() {
    var _this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Diamond);

    _this = _super.call(this, configs);
    _this.type = 'Diamond';
    _this.width = configs.width || 20;
    _this.height = configs.height || 10;
    _this.side = configs.side || 6;

    _this._cacheSide();

    return _this;
  }

  _createClass(Diamond, [{
    key: "setConfig",
    value: function setConfig(configs) {
      var _this2 = this;

      Object.keys(configs).forEach(function (k) {
        if (configs[k] !== undefined && configs[k] !== null) {
          _this2[k] = configs[k];
          _this2._rawConfigs[k] = configs[k];
        }
      });

      this._cacheSide();
    }
  }, {
    key: "_cacheSide",
    value: function _cacheSide() {
      this.sinSIDE = Math.sin(Math.PI / 3) * this.side;
      this.cosSIDE = Math.cos(Math.PI / 3) * this.side; // console.log(this.sinSIDE, this.cosSIDE);
    }
  }, {
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
      var xx = hh / 1.732;
      var leftCenter = x - hw + xx;
      var rightCenter = x + hw - xx;
      var right = x + hw;
      var left = x - hw;
      var top = y - hh;
      var bottom = y + hh; // const angle = Math.PI / 6;
      // const radius = 6;

      var side = this.side,
          sinSIDE = this.sinSIDE,
          cosSIDE = this.cosSIDE;
      ctx.moveTo(x, top);
      ctx.lineTo(rightCenter - side, top);
      ctx.quadraticCurveTo(rightCenter, top, rightCenter + cosSIDE, top + sinSIDE);
      ctx.lineTo(right - cosSIDE, y - sinSIDE);
      ctx.quadraticCurveTo(right, y, right - cosSIDE, y + sinSIDE);
      ctx.lineTo(rightCenter + cosSIDE, bottom - sinSIDE);
      ctx.quadraticCurveTo(rightCenter, bottom, rightCenter - side, bottom);
      ctx.lineTo(leftCenter + side, bottom);
      ctx.quadraticCurveTo(leftCenter, bottom, leftCenter - cosSIDE, bottom - sinSIDE);
      ctx.lineTo(left + cosSIDE, y + sinSIDE);
      ctx.quadraticCurveTo(left, y, left + cosSIDE, y - sinSIDE);
      ctx.lineTo(leftCenter - cosSIDE, top + sinSIDE);
      ctx.quadraticCurveTo(leftCenter, top, leftCenter + side, top);
      ctx.closePath();
      ctx.fillStyle = this.backgroundColor;
      ctx.fill();

      if (this.borderWidth) {
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
      } // if(this._isTargeting) {
      //     this.renderFocus(ctx);
      // }
      // ctx.fillStyle = 'rgba(0,0,0,0.3)';
      // ctx.fillRect(x-hw, y-hh, this.width, this.height)


      ctx.restore();
      this._cachePoints = [[rightCenter, top], [right, y], [rightCenter, bottom], [leftCenter, bottom], [left, y], [leftCenter, top]];
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      var polygon = this._cachePoints;
      var odd = false; // For each edge (In this case for each point of the polygon and the previous one)

      for (var i = 0, j = polygon.length - 1; i < polygon.length; i++) {
        // If a line from the point into infinity crosses this edge
        if (polygon[i][1] > point[1] !== polygon[j][1] > point[1] // One point needs to be above, one below our y coordinate
        // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
        && point[0] < (polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]) {
          // Invert odd
          odd = !odd;
        }

        j = i;
      }

      return odd;
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

  return Diamond;
}(_node["default"]);

var _default = Diamond;
exports["default"] = _default;
//# sourceMappingURL=diamond.js.map
