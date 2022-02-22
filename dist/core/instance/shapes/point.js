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
 * 圆形单元 配置
 * @typedef {Node~Configs} Point~PointConfigs
 * @property {number} radius  - 半径
 */

/**
 * 圆形节点
 * @constructor Point
 * @extends Node
 * @param {Point~PointConfigs} configs - 配置
 */
var Point = /*#__PURE__*/function (_Node) {
  _inherits(Point, _Node);

  var _super = _createSuper(Point);

  function Point(configs) {
    var _this;

    _classCallCheck(this, Point);

    _this = _super.call(this, configs);
    _this.type = 'Point';
    _this.radius = configs.radius || 10;
    _this.radiusExpo2 = _this.radius * _this.radius;
    return _this;
  }

  _createClass(Point, [{
    key: "render",
    value: function render(ctx) {
      ctx.save();

      if (this._isMoving) {
        ctx.globalAlpha = 0.5;
      }

      ctx.beginPath();
      ctx.arc(this.anchor[0], this.anchor[1], this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.backgroundColor;
      ctx.fill();

      if (this.borderWidth) {
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
      } // if(this._isTargeting) {
      //     this.renderFocus(ctx);
      // }


      ctx.restore();
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      var anchor = this.anchor;
      return Math.pow(point[0] - anchor[0], 2) + Math.pow(point[1] - anchor[1], 2) < this.radiusExpo2;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var anchor = this.anchor;
      var r = this.radius;
      var ltx = anchor[0] - r;
      var lty = anchor[1] - r;
      var rbx = anchor[0] + r;
      var rby = anchor[1] + r;
      return [[ltx, lty], [rbx, lty], [rbx, rby], [ltx, rby]];
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

      var vecx = x2 - x1;
      var vecy = y2 - y1;
      var dist = Math.sqrt(vecx * vecx + vecy * vecy);
      var ratio = this.radius / dist;
      return [x2 - ratio * vecx, y2 - ratio * vecy];
    }
  }, {
    key: "getIntersectionsInFourDimension",
    value: function getIntersectionsInFourDimension() {
      var _ref;

      var _this$anchor2 = _slicedToArray(this.anchor, 2),
          x2 = _this$anchor2[0],
          y2 = _this$anchor2[1];

      var r = this.radius;
      return _ref = {}, _defineProperty(_ref, _constance.DIRECTION.RIGHT, [x2 + r, y2]), _defineProperty(_ref, _constance.DIRECTION.LEFT, [x2 - r, y2]), _defineProperty(_ref, _constance.DIRECTION.BOTTOM, [x2, y2 + r]), _defineProperty(_ref, _constance.DIRECTION.TOP, [x2, y2 - r]), _ref;
    }
  }, {
    key: "calculateIntersectionInFourDimension",
    value: function calculateIntersectionInFourDimension(point, end) {
      var _allIntersections;

      var _point2 = _slicedToArray(point, 2),
          x1 = _point2[0],
          y1 = _point2[1];

      var _this$anchor3 = _slicedToArray(this.anchor, 2),
          x2 = _this$anchor3[0],
          y2 = _this$anchor3[1];

      var r = this.radius;
      var vecx = x2 - x1;
      var vecy = y2 - y1;
      var allIntersections = (_allIntersections = {}, _defineProperty(_allIntersections, _constance.DIRECTION.RIGHT, [x2 + r, y2]), _defineProperty(_allIntersections, _constance.DIRECTION.LEFT, [x2 - r, y2]), _defineProperty(_allIntersections, _constance.DIRECTION.BOTTOM, [x2, y2 + r]), _defineProperty(_allIntersections, _constance.DIRECTION.TOP, [x2, y2 - r]), _allIntersections); // console.log(Math.abs(vecx) > Math.abs(vecy), vecx, r)
      // if() {
      //     return {
      //         p: [x2 + (vecx<0?r:-r), y2],
      //         dir: vecx<0 ? DIRECTION.RIGHT : DIRECTION.LEFT,
      //     }
      // } else {
      //     return {
      //         p: [x2, y2+(vecy<0?r:-r)],
      //         dir: vecy<0 ? DIRECTION.BOTTOM : DIRECTION.TOP,
      //     }
      // }

      var interDir = Math.abs(vecy) > Math.abs(vecx) ? vecy < 0 ? _constance.DIRECTION.BOTTOM : _constance.DIRECTION.TOP : vecx < 0 ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.LEFT; // interDir = this.checkLinked(interDir, end);

      return {
        p: allIntersections[interDir],
        dir: interDir
      };
    }
  }, {
    key: "getBoundingDimension",
    value: function getBoundingDimension() {
      return {
        width: this.radius * 2,
        height: this.radius * 2
      };
    }
  }]);

  return Point;
}(_node["default"]);

var _default = Point;
exports["default"] = _default;
//# sourceMappingURL=point.js.map
