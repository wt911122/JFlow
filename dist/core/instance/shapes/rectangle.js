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
 * 矩形单元 配置
 * @typedef {Node~Configs} Rectangle~RectangleConfigs
 * @property {number} width - 宽
 * @property {number} height - 高
 * @property {number} borderRadius - 圆角矩形半径
 * @property {string} borderColor - 边框颜色, 默认 transparent
 * @property {string} borderWidth - 边框宽度, 默认 0
 * @property {Object} border      - 边框设置
 * @property {Object} border.top      - 上边框设置
 * @property {string} border.top.borderColor - 边框颜色, 默认 transparent
 * @property {number} border.top.borderWidth - 边框宽度, 默认 0
 * @property {Object} border.right    - 右边框设置
 * @property {string} border.right.borderColor - 边框颜色, 默认 transparent
 * @property {number} border.right.borderWidth - 边框宽度, 默认 0
 * @property {Object} border.bottom   - 下边框设置
 * @property {string} border.bottom.borderColor - 边框颜色, 默认 transparent
 * @property {number} border.bottom.borderWidth - 边框宽度, 默认 0
 * @property {Object} border.left     - 左边框设置
 * @property {string} border.left.borderColor - 边框颜色, 默认 transparent
 * @property {number} border.left.borderWidth - 边框宽度, 默认 0
 */

/**
 * 矩形单元
 * @constructor Rectangle
 * @extends Node
 * @param {Rectangle~RectangleConfigs} configs
 */
var Rectangle = /*#__PURE__*/function (_Node) {
  _inherits(Rectangle, _Node);

  var _super = _createSuper(Rectangle);

  function Rectangle() {
    var _this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Rectangle);

    _this = _super.call(this, configs);
    _this.type = 'Rectangle';
    _this.width = configs.width || 10;
    _this.height = configs.height || 10;
    _this.borderRadius = configs.borderRadius || 0;

    _this._setBorder(configs);

    return _this;
  }

  _createClass(Rectangle, [{
    key: "_setBorder",
    value: function _setBorder(configs) {
      var _configs$border, _configs$border$top, _configs$border2, _configs$border2$top, _configs$border3, _configs$border3$top, _configs$border4, _configs$border4$righ, _configs$border5, _configs$border5$righ, _configs$border6, _configs$border6$righ, _configs$border7, _configs$border7$bott, _configs$border8, _configs$border8$bott, _configs$border9, _configs$border9$bott, _configs$border10, _configs$border10$lef, _configs$border11, _configs$border11$lef, _configs$border12, _configs$border12$lef;

      this.border = {
        top: {
          color: ((_configs$border = configs.border) === null || _configs$border === void 0 ? void 0 : (_configs$border$top = _configs$border.top) === null || _configs$border$top === void 0 ? void 0 : _configs$border$top.borderColor) || configs.borderColor || 'transparent',
          width: ((_configs$border2 = configs.border) === null || _configs$border2 === void 0 ? void 0 : (_configs$border2$top = _configs$border2.top) === null || _configs$border2$top === void 0 ? void 0 : _configs$border2$top.borderWidth) || configs.borderWidth || 0,
          enable: (_configs$border3 = configs.border) === null || _configs$border3 === void 0 ? void 0 : (_configs$border3$top = _configs$border3.top) === null || _configs$border3$top === void 0 ? void 0 : _configs$border3$top.borderWidth
        },
        right: {
          color: ((_configs$border4 = configs.border) === null || _configs$border4 === void 0 ? void 0 : (_configs$border4$righ = _configs$border4.right) === null || _configs$border4$righ === void 0 ? void 0 : _configs$border4$righ.borderColor) || configs.borderColor || 'transparent',
          width: ((_configs$border5 = configs.border) === null || _configs$border5 === void 0 ? void 0 : (_configs$border5$righ = _configs$border5.right) === null || _configs$border5$righ === void 0 ? void 0 : _configs$border5$righ.borderWidth) || configs.borderWidth || 0,
          enable: (_configs$border6 = configs.border) === null || _configs$border6 === void 0 ? void 0 : (_configs$border6$righ = _configs$border6.right) === null || _configs$border6$righ === void 0 ? void 0 : _configs$border6$righ.borderWidth
        },
        bottom: {
          color: ((_configs$border7 = configs.border) === null || _configs$border7 === void 0 ? void 0 : (_configs$border7$bott = _configs$border7.bottom) === null || _configs$border7$bott === void 0 ? void 0 : _configs$border7$bott.borderColor) || configs.borderColor || 'transparent',
          width: ((_configs$border8 = configs.border) === null || _configs$border8 === void 0 ? void 0 : (_configs$border8$bott = _configs$border8.bottom) === null || _configs$border8$bott === void 0 ? void 0 : _configs$border8$bott.borderWidth) || configs.borderWidth || 0,
          enable: (_configs$border9 = configs.border) === null || _configs$border9 === void 0 ? void 0 : (_configs$border9$bott = _configs$border9.bottom) === null || _configs$border9$bott === void 0 ? void 0 : _configs$border9$bott.borderWidth
        },
        left: {
          color: ((_configs$border10 = configs.border) === null || _configs$border10 === void 0 ? void 0 : (_configs$border10$lef = _configs$border10.left) === null || _configs$border10$lef === void 0 ? void 0 : _configs$border10$lef.borderColor) || configs.borderColor || 'transparent',
          width: ((_configs$border11 = configs.border) === null || _configs$border11 === void 0 ? void 0 : (_configs$border11$lef = _configs$border11.left) === null || _configs$border11$lef === void 0 ? void 0 : _configs$border11$lef.borderWidth) || configs.borderWidth || 0,
          enable: (_configs$border12 = configs.border) === null || _configs$border12 === void 0 ? void 0 : (_configs$border12$lef = _configs$border12.left) === null || _configs$border12$lef === void 0 ? void 0 : _configs$border12$lef.borderWidth
        }
      };
      this.borderColor = configs.borderColor || 'transparent';
      this.borderWidth = configs.borderWidth || 0;
    }
  }, {
    key: "setConfig",
    value: function setConfig(configs) {
      var _this2 = this;

      Object.keys(configs).forEach(function (k) {
        if (configs[k] !== undefined && configs[k] !== null) {
          _this2[k] = configs[k];
          _this2._rawConfigs[k] = configs[k];
        }
      });

      this._setBorder(configs);
    }
  }, {
    key: "render",
    value: function render(ctx) {
      ctx.save();

      if (this._isMoving) {
        ctx.globalAlpha = 0.6;
      }

      var radius = this.borderRadius,
          anchor = this.anchor,
          width = this.width,
          height = this.height;
      var x = this.anchor[0] - this.width / 2;
      var y = this.anchor[1] - this.height / 2;
      var xt = this.anchor[0] + this.width / 2;
      var yt = this.anchor[1] + this.height / 2;

      if (this.borderRadius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        if (this.borderWidth) {
          ctx.lineWidth = this.borderWidth;
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
      }

      ctx.fillStyle = this.backgroundColor;

      if (this.shadowColor) {
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.shadowOffsetX;
        ctx.shadowOffsetY = this.shadowOffsetY;
      }

      ctx.fill();

      if (this.borderRadius) {
        if (this.border.top.enable) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.closePath(); // ctx.fill();

          ctx.clip();
          ctx.beginPath();
          ctx.rect(x, y, this.width, this.border.top.width);
          ctx.fillStyle = this.border.top.color;
          ctx.fill();
          ctx.restore();
        } // if(this.border.right.enable) {
        //     ctx.beginPath();
        //     ctx.moveTo(x + width, y + radius);
        //     ctx.lineTo(x + width, y + height - radius);
        //     ctx.strokeStyle = this.border.right.color;
        //     ctx.lineWidth = this.border.right.width;
        //     ctx.stroke();
        // }
        // if(this.border.bottom.enable) {
        //     ctx.beginPath();
        //     ctx.moveTo(x + width - radius, y + height);
        //     ctx.lineTo(x + radius, y + height);
        //     ctx.strokeStyle = this.border.bottom.color;
        //     ctx.lineWidth = this.border.bottom.width;
        //     ctx.stroke();
        // }
        // if(this.border.left.enable) {
        //     ctx.beginPath();
        //     ctx.moveTo(x, y + height - radius);
        //     ctx.lineTo(x, y + radius);
        //     ctx.strokeStyle = this.border.left.color;
        //     ctx.lineWidth = this.border.left.width;
        //     ctx.stroke();
        // }

      } else {
        if (this.border.top.width) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(xt, y);
          ctx.strokeStyle = this.border.top.color;
          ctx.lineWidth = this.border.top.width;
          ctx.stroke();
        }

        if (this.border.right.width) {
          ctx.beginPath();
          ctx.moveTo(xt, y);
          ctx.lineTo(xt, yt);
          ctx.strokeStyle = this.border.right.color;
          ctx.lineWidth = this.border.right.width;
          ctx.stroke();
        }

        if (this.border.bottom.width) {
          ctx.beginPath();
          ctx.moveTo(xt, yt);
          ctx.lineTo(x, yt);
          ctx.strokeStyle = this.border.bottom.color;
          ctx.lineWidth = this.border.bottom.width;
          ctx.stroke();
        }

        if (this.border.left.width) {
          ctx.beginPath();
          ctx.moveTo(x, yt);
          ctx.lineTo(x, y);
          ctx.strokeStyle = this.border.left.color;
          ctx.lineWidth = this.border.left.width;
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      var anchor = this.anchor;
      var w = this.width / 2;
      var h = this.height / 2;
      return point[0] > anchor[0] - w && point[0] < anchor[0] + w && point[1] > anchor[1] - h && point[1] < anchor[1] + h;
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
    key: "calculateIntersection",
    value: function calculateIntersection(point) {
      var _point = _slicedToArray(point, 2),
          x1 = _point[0],
          y1 = _point[1];

      var _this$anchor = _slicedToArray(this.anchor, 2),
          x2 = _this$anchor[0],
          y2 = _this$anchor[1];

      var w = this.width / 2;
      var h = this.height / 2;
      var vecx = x2 - x1;
      var vecy = y2 - y1;
      var theta1 = h / w;
      var theta2 = Math.abs(vecy / vecx);
      var dirx = x1 > x2;
      var diry = y1 > y2;
      var x, y;

      if (theta2 < theta1) {
        x = x2 + (dirx ? w : -w);
        y = w * (diry ? theta2 : -theta2) + y2;
      } else {
        y = y2 + (diry ? h : -h);
        x = h / (dirx ? theta2 : -theta2) + x2;
      }

      return [x, y];
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
  }, {
    key: "calculateIntersectionInFourDimension",
    value: function calculateIntersectionInFourDimension(point, end) {
      var _allIntersections;

      var _point2 = _slicedToArray(point, 2),
          x1 = _point2[0],
          y1 = _point2[1];

      var p2 = this.anchor;

      if (this._belongs && this._belongs.calculateToCoordination) {
        p2 = this._belongs.calculateToCoordination(p2);
      }

      var _p3 = p2,
          _p4 = _slicedToArray(_p3, 2),
          x2 = _p4[0],
          y2 = _p4[1];

      var w = this.width / 2;
      var h = this.height / 2;
      var allIntersections = (_allIntersections = {}, _defineProperty(_allIntersections, _constance.DIRECTION.RIGHT, [x2 + w, y2]), _defineProperty(_allIntersections, _constance.DIRECTION.LEFT, [x2 - w, y2]), _defineProperty(_allIntersections, _constance.DIRECTION.BOTTOM, [x2, y2 + h]), _defineProperty(_allIntersections, _constance.DIRECTION.TOP, [x2, y2 - h]), _allIntersections);
      var vecx = x2 - x1;
      var vecy = y2 - y1;
      var theta1 = h / w;
      var theta2 = Math.abs(vecy / vecx);
      var dirx = x1 > x2;
      var diry = y1 > y2;
      var interDir = theta2 > theta1 ? diry ? _constance.DIRECTION.BOTTOM : _constance.DIRECTION.TOP : dirx ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.LEFT; // if(this._belongs && this._belongs.calculateToCoordination) {
      //     console.log(JSON.stringify(this._intersections));
      //     console.log(interDir)
      // }
      // interDir = this.checkLinked(interDir, end);
      // if(this._belongs && this._belongs.calculateToCoordination) {
      //     console.log(interDir)
      // }
      // if(!interDir) {
      //     debugger
      // }
      // let endDir = interDir;
      // if(end === 'to') {
      //     endDir = oppositeDirection(endDir)
      // }

      return {
        p: allIntersections[interDir],
        dir: interDir
      };
    }
  }]);

  return Rectangle;
}(_node["default"]);

var _default = Rectangle;
exports["default"] = _default;
//# sourceMappingURL=rectangle.js.map
