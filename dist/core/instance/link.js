"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _baseLink = _interopRequireDefault(require("./base-link"));

var _functions = require("../utils/functions");

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

var Link = /*#__PURE__*/function (_BaseLink) {
  _inherits(Link, _BaseLink);

  var _super = _createSuper(Link);

  function Link(configs) {
    var _this;

    _classCallCheck(this, Link);

    _this = _super.call(this, configs);
    _this.from = configs.from; // Instance

    _this.to = configs.to; // Instance

    _this.controlPoints = [0, 1, -10, 1, -10, 5];
    _this._cachePoints = null;
    _this.defaultStyle = 'black';
    _this.hoverStyle = 'cornflowerblue';
    return _this;
  }

  _createClass(Link, [{
    key: "getColor",
    value: function getColor() {
      if (this._isTargeting) {
        return this.hoverStyle;
      }

      return this.defaultStyle;
    }
  }, {
    key: "_calculateAnchorPoints",
    value: function _calculateAnchorPoints() {
      var start = this.from.calculateIntersection(this.to.getCenter());
      var end = this.to.calculateIntersection(this.from.getCenter());
      this._cachePoints = [start, end];
      return {
        startX: start[0],
        startY: start[1],
        endX: end[0],
        endY: end[1]
      };
    }
  }, {
    key: "render",
    value: function render(ctx) {
      var _this$_calculateAncho = this._calculateAnchorPoints(),
          startX = _this$_calculateAncho.startX,
          startY = _this$_calculateAncho.startY,
          endX = _this$_calculateAncho.endX,
          endY = _this$_calculateAncho.endY;

      var controlPoints = this.controlPoints;
      var dx = endX - startX;
      var dy = endY - startY;
      var len = Math.sqrt(dx * dx + dy * dy);
      var sin = dy / len;
      var cos = dx / len;
      var a = [];
      a.push(0, 0);

      for (var i = 0; i < controlPoints.length; i += 2) {
        var x = controlPoints[i];
        var y = controlPoints[i + 1];
        a.push(x < 0 ? len + x : x, y);
      }

      a.push(len, 0);

      for (var i = controlPoints.length; i > 0; i -= 2) {
        var x = controlPoints[i - 2];
        var y = controlPoints[i - 1];
        a.push(x < 0 ? len + x : x, -y);
      }

      a.push(0, 0);
      ctx.fillStyle = ctx.strokeStyle = this.getColor();
      ctx.beginPath();

      for (var i = 0; i < a.length; i += 2) {
        var x = a[i] * cos - a[i + 1] * sin + startX;
        var y = a[i] * sin + a[i + 1] * cos + startY;
        if (i === 0) ctx.moveTo(x, y);else ctx.lineTo(x, y);
      }

      ctx.fill();
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      if (!this._cachePoints) return false;

      var _this$_cachePoints = _slicedToArray(this._cachePoints, 2),
          start = _this$_cachePoints[0],
          end = _this$_cachePoints[1];

      var dist = (0, _functions.distToSegmentSquared)(point, start, end);
      return dist < _constance.APPROXIMATE;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var _this$_calculateAncho2 = this._calculateAnchorPoints(),
          startX = _this$_calculateAncho2.startX,
          startY = _this$_calculateAncho2.startY,
          endX = _this$_calculateAncho2.endX,
          endY = _this$_calculateAncho2.endY;

      return [[startX, startY], [endX, endY]];
    }
  }]);

  return Link;
}(_baseLink["default"]);

var _default = Link;
exports["default"] = _default;
//# sourceMappingURL=link.js.map
