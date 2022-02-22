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

// import { dist2, bezierPoint } from '../utils/functions';
var PIINRATIO = Math.PI / 180;
/**
 * @typedef {BaseLink~Configs} PolyLink~Configs
 * @property {Number} approximate   - 点击响应范围
 * @property {Number} radius        - 拐角弧度
 * @property {Number} minSpanX      - 起点终点在 x 方向最小的跨度
 * @property {Number} minSpanY      - 起点终点在 y 方向最小的跨度
 * @property {number[]} lineDash    - 虚线数组
 * @property {Boolean} doubleLink   - 双向箭头
 * @property {String} fontFamily    - 连线上的文字字体
 * @property {Number} fontSize      - 连线上的文字大小
 * @property {String} content       - 连线上的文字
 * @property {String} isSelf        - 是否为自连接
 */

/**
 * 方形折线
 * @constructor PolyLink
 * @extends BaseLink
 * @param {PolyLink~Configs} configs - 配置
 */

var PolyLink = /*#__PURE__*/function (_BaseLink) {
  _inherits(PolyLink, _BaseLink);

  var _super = _createSuper(PolyLink);

  /**
  * 创建方形折线
  * @param {PolyLink~Configs} configs - 配置
  **/
  function PolyLink(configs) {
    var _this;

    _classCallCheck(this, PolyLink);

    _this = _super.call(this, configs);
    _this.approximate = configs.approximate || _constance.APPROXIMATE;
    _this.radius = configs.radius || 0;
    _this.minSpanX = configs.minSpanX || 10;
    _this.minSpanY = configs.minSpanY || 10;
    _this.lineDash = configs.lineDash;
    _this.doubleLink = configs.doubleLink;
    _this.fontFamily = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
    _this.fontSize = configs.fontSize || '12px';
    _this.content = configs.content || '';
    _this.isSelf = !!configs.isSelf;
    return _this;
  }

  _createClass(PolyLink, [{
    key: "_calculateAnchorPoints",
    value: function _calculateAnchorPoints() {
      var dmsfrom = this.from.getIntersectionsInFourDimension();
      var dmsto = this.to.getIntersectionsInFourDimension();

      if (this.isSelf) {
        var points = (0, _functions.polylinePoints)(dmsfrom[this.fromDir], dmsto[_constance.DIRECTION.SELF], this.fromDir, _constance.DIRECTION.BOTTOM, this.minSpanX, this.minSpanY, true);
        this._cachePoints = points;
        this._cacheAngle = [this.fromDir, _constance.DIRECTION.BOTTOM]; // const points = polylinePoints(
        //     dmsfrom[this.fromDir],
        //     dmsto[this.toDir],
        //     this.fromDir,
        //     this.toDir, this.minSpanX , this.minSpanY);
        // this._cachePoints = points
        // this._cacheAngle = [this.fromDir, this.toDir]
      } else if (this.fromDir !== undefined && this.toDir !== undefined) {
        var _points = (0, _functions.polylinePoints)(dmsfrom[this.fromDir], dmsto[this.toDir], this.fromDir, this.toDir, this.minSpanX, this.minSpanY);

        this._cachePoints = _points;
        this._cacheAngle = [this.fromDir, this.toDir];
      } else {
        var meta = (0, _functions.minIntersectionBetweenNodes)(dmsfrom, dmsto);
        console.log(meta);

        var _points2 = (0, _functions.polylinePoints)(meta.fromP, meta.toP, meta.fromDir, meta.toDir, this.minSpanX, this.minSpanY);

        this._cachePoints = _points2;
        this._cacheAngle = [meta.fromDir, meta.toDir];
      }
    }
  }, {
    key: "render",
    value: function render(ctx) {
      var _this2 = this;

      this._calculateAnchorPoints();

      var radius = this.radius;
      var points = this._cachePoints;
      var p = points[0];
      var pEnd = points[points.length - 1];
      var angleEnd = (this._cacheAngle[1] + 2) % 4 * 90 * PIINRATIO;
      ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;

      if (this.doubleLink) {
        var beginAngle = (this._cacheAngle[0] + 2) % 4 * 90 * PIINRATIO;
        ctx.beginPath();
        ctx.translate(p[0], p[1]);
        ctx.rotate(beginAngle);
        ctx.moveTo(5, 0);
        ctx.lineTo(0, -4);
        ctx.lineTo(0, 4);
        ctx.lineTo(5, 0);
        ctx.fill();
        ctx.rotate(-beginAngle);
        ctx.translate(-p[0], -p[1]);
      }

      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      points.slice(1, points.length - 1).forEach(function (p, idx) {
        if (_this2.radius) {
          var pLast = points[idx];
          var pNext = points[idx + 2];

          var _makeRadiusFromVector = (0, _functions.makeRadiusFromVector)(pLast, p, pNext, radius),
              p1 = _makeRadiusFromVector.p1,
              p2 = _makeRadiusFromVector.p2;

          if (p1 && p2) {
            ctx.lineTo(p1[0], p1[1]);
            ctx.quadraticCurveTo(p[0], p[1], p2[0], p2[1]);
          } else {
            ctx.lineTo(p[0], p[1]);
          }
        } else {
          ctx.lineTo(p[0], p[1]);
        }
      });
      ctx.lineTo(pEnd[0], pEnd[1]);

      if (this.lineDash) {
        ctx.save();
        ctx.setLineDash(this.lineDash);
      }

      ctx.stroke();

      if (this.lineDash) {
        ctx.restore();
      }

      ctx.beginPath();
      ctx.translate(pEnd[0], pEnd[1]);
      ctx.rotate(angleEnd);
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, -4);
      ctx.lineTo(-5, 4);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.rotate(-angleEnd);
      ctx.translate(-pEnd[0], -pEnd[1]);
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      var points = this._cachePoints;
      var lastP = points[0];
      var remainPoints = points.slice(1);

      do {
        var currentP = remainPoints.shift();

        if (currentP) {
          var dist = (0, _functions.distToSegmentSquared)(point, lastP, currentP);

          if (dist < this.approximate) {
            return true;
          }
        }

        lastP = currentP;
      } while (lastP);

      return false;
    }
  }]);

  return PolyLink;
}(_baseLink["default"]);

var _default = PolyLink;
exports["default"] = _default;
//# sourceMappingURL=poly-link.js.map
