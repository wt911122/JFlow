"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _instance = _interopRequireDefault(require("./instance"));

var _constance = require("../utils/constance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var LinkPolyline = /*#__PURE__*/function (_Instance) {
  _inherits(LinkPolyline, _Instance);

  var _super = _createSuper(LinkPolyline);

  function LinkPolyline(configs) {
    var _this;

    _classCallCheck(this, LinkPolyline);

    _this = _super.call(this, configs);
    _this.from = configs.from; // Instance

    _this.to = configs.to; // Instance

    _this.conrolNodes = [];
    _this.controlPoint = [];
    _this.defaultStyle = 'black';
    _this.hoverStyle = 'cornflowerblue';
    return _this;
  }

  _createClass(LinkPolyline, [{
    key: "_calculateAnchorPoints",
    value: function _calculateAnchorPoints() {
      var start = this.from.calculateIntersectionInFourDimension(this.to.getCenter());
      var end = this.to.calculateIntersectionInFourDimension(this.from.getCenter());
      return {
        start: start,
        end: end
      };
    }
  }, {
    key: "getColor",
    value: function getColor() {
      if (this.status.hover) {
        return this.hoverStyle;
      }

      return this.defaultStyle;
    }
  }, {
    key: "render",
    value: function render(ctx) {
      var _this$_calculateAncho = this._calculateAnchorPoints(),
          start = _this$_calculateAncho.start,
          end = _this$_calculateAncho.end;

      var diffDIR = Math.abs(start.dir - end.dir);
      var controlPoint = [start.p];

      if (diffDIR === 1 || diffDIR === 3) {
        // 证明只需要一个控制点
        if (start.dir % 2 === 1) {
          controlPoint.push([end.p[0], start.p[1]]);
        } else {
          controlPoint.push([start.p[0], end.p[1]]);
        }
      } else {
        if (start.dir % 2 === 1) {
          if (start.p[1] !== end.p[1]) {
            var mid = (start.p[0] - end.p[0]) / 2 + end.p[0];
            controlPoint.push([mid, start.p[1]]);
            controlPoint.push([mid, end.p[1]]);
          }
        } else {
          if (start.p[0] !== end.p[0]) {
            var _mid = (start.p[1] - end.p[1]) / 2 + end.p[1];

            controlPoint.push([start.p[0], _mid]);
            controlPoint.push([end.p[0], _mid]);
          }
        }
      }

      controlPoint.push(end.p);
      this.controlPoint = controlPoint;
      ctx.fillStyle = ctx.strokeStyle = this.getColor();
      ctx.beginPath();

      for (var i = 0; i < controlPoint.length; i++) {
        var _controlPoint$i = _slicedToArray(controlPoint[i], 2),
            x = _controlPoint$i[0],
            y = _controlPoint$i[1];

        if (i === 0) ctx.moveTo(x, y);else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.beginPath();
      var endP = end.p;
      ctx.moveTo(endP[0], endP[1]);

      switch (end.dir) {
        case _constance.DIRECTION.TOP:
          ctx.lineTo(endP[0] - 5, endP[1] - 10);
          ctx.lineTo(endP[0] + 5, endP[1] - 10);
          break;

        case _constance.DIRECTION.BOTTOM:
          ctx.lineTo(endP[0] + 5, endP[1] + 10);
          ctx.lineTo(endP[0] - 5, endP[1] + 10);
          break;

        case _constance.DIRECTION.RIGHT:
          ctx.lineTo(endP[0] + 10, endP[1] + 5);
          ctx.lineTo(endP[0] + 10, endP[1] - 5);
          break;

        case _constance.DIRECTION.LEFT:
          ctx.lineTo(endP[0] - 10, endP[1] - 5);
          ctx.lineTo(endP[0] - 10, endP[1] + 5);
          break;

        default:
          break;
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      var controlPoint = this.controlPoint;

      var _controlPoint$ = _slicedToArray(controlPoint[0], 2),
          sx = _controlPoint$[0],
          sy = _controlPoint$[1];

      for (var i = 1; i < controlPoint.length; i++) {
        var _controlPoint$i2 = _slicedToArray(controlPoint[i], 2),
            ex = _controlPoint$i2[0],
            ey = _controlPoint$i2[1];

        var lx = void 0,
            rx = void 0,
            by = void 0,
            ty = void 0;

        if (sx === ex) {
          lx = sx - _constance.APPROXIMATE;
          rx = sx + _constance.APPROXIMATE;
          by = Math.max(sy, ey);
          ty = Math.min(sy, ey);
        }

        if (sy === ey) {
          ty = sy - _constance.APPROXIMATE;
          by = sy + _constance.APPROXIMATE;
          rx = Math.max(sx, ex);
          lx = Math.min(sx, ex);
        }

        if (point[0] > lx && point[0] < rx && point[1] > ty && point[1] < by) {
          return true;
        }

        sx = ex;
        sy = ey;
      }

      return false;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var _this$_calculateAncho2 = this._calculateAnchorPoints(),
          start = _this$_calculateAncho2.start,
          end = _this$_calculateAncho2.end;

      return [start.p, end.p];
    }
  }]);

  return LinkPolyline;
}(_instance["default"]);

var _default = LinkPolyline;
exports["default"] = _default;
//# sourceMappingURL=polyline-link.js.map
