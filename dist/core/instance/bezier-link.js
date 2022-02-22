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

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var PIINRATIO = Math.PI / 180;
/**
 * @typedef {BaseLink~Configs} BezierLink~Configs
 * @property {Number} approximate   - 点击响应范围
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
 * 贝塞尔曲线
 * @constructor BezierLink
 * @extends BaseLink
 * @param {BezierLink~Configs} configs - 配置
 */

var BezierLink = /*#__PURE__*/function (_BaseLink) {
  _inherits(BezierLink, _BaseLink);

  var _super = _createSuper(BezierLink);

  /**
  * 创建贝塞尔曲线.
  * @param {BezierLink~Configs} configs - 配置
  **/
  function BezierLink(configs) {
    var _this;

    _classCallCheck(this, BezierLink);

    _this = _super.call(this, configs);
    _this.approximate = configs.approximate || _constance.APPROXIMATE;
    _this.minSpanX = configs.minSpanX || 0;
    _this.minSpanY = configs.minSpanY || 0;
    _this.lineDash = configs.lineDash;
    _this.doubleLink = configs.doubleLink;
    _this.fontFamily = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
    _this.fontSize = configs.fontSize || '12px';
    _this.content = configs.content || '';
    _this.isSelf = !!configs.isSelf;
    return _this;
  } // getColor() {
  //     if(this._isTargeting) {
  //         return this.hoverStyle;
  //     }
  //     return this.defaultStyle;
  // }
  // _calculateAnchorPoints() {
  //     let start;
  //     let end;
  //     if(this.fromDir !== undefined) {
  //         start = {
  //             dir: this.fromDir,
  //             p: this.from.getIntersectionsInFourDimension()[this.fromDir],
  //         }
  //     } else {
  //         start = this.from.calculateIntersectionInFourDimension(this.to.getCenter(), 'from');
  //     }
  //     if(this.toDir !== undefined) {
  //         end = {
  //             dir: this.toDir,
  //             p: this.to.getIntersectionsInFourDimension()[this.toDir],
  //         }
  //     } else {
  //         end = this.to.calculateIntersectionInFourDimension(this.from.getCenter(), 'to');
  //     }
  //     // const start = this.from.calculateIntersectionInFourDimension(this.to.getCenter(), 'from');
  //     // const end = this.to.calculateIntersectionInFourDimension(this.from.getCenter(), 'to');
  //     const p1 = start.p;
  //     const p2 = end.p;
  //     const points = bezierPoints(p1, p2, start.dir, end.dir, this.anticlock);
  //     this._cachePoints = [...p1, ...points]
  // }


  _createClass(BezierLink, [{
    key: "_calculateAnchorPoints",
    value: function _calculateAnchorPoints() {
      var dmsfrom = this.from.getIntersectionsInFourDimension();
      var dmsto = this.to.getIntersectionsInFourDimension();

      if (this.isSelf) {
        var points = (0, _functions.bezierPoints)(dmsfrom[this.fromDir], dmsto[_constance.DIRECTION.SELF], this.fromDir, _constance.DIRECTION.BOTTOM, this.minSpanX, this.minSpanY);
        this._cachePoints = [].concat(_toConsumableArray(dmsfrom[this.fromDir]), _toConsumableArray(points));
        console.log(points);
        this._cacheAngle = [this.fromDir, _constance.DIRECTION.BOTTOM];
      } else if (this.fromDir !== undefined && this.toDir !== undefined) {
        var _points = (0, _functions.bezierPoints)(dmsfrom[this.fromDir], dmsto[this.toDir], this.fromDir, this.toDir, this.minSpanX, this.minSpanY);

        this._cachePoints = [].concat(_toConsumableArray(dmsfrom[this.fromDir]), _toConsumableArray(_points));
        this._cacheAngle = [this.fromDir, this.toDir];
      } else {
        var meta = (0, _functions.minIntersectionBetweenNodes)(dmsfrom, dmsto);

        var _points2 = (0, _functions.bezierPoints)(meta.fromP, meta.toP, meta.fromDir, meta.toDir);

        this._cachePoints = [].concat(_toConsumableArray(meta.fromP), _toConsumableArray(_points2));
        this._cacheAngle = [meta.fromDir, meta.toDir];
      }
    }
  }, {
    key: "render",
    value: function render(ctx) {
      this._calculateAnchorPoints();

      var points = this._cachePoints;

      var angle = _functions.getBezierAngle.apply(null, [1].concat(_toConsumableArray(points)));

      ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;

      if (this.doubleLink) {
        var beginAngle = (this._cacheAngle[0] + 2) % 4 * 90 * PIINRATIO;
        ctx.beginPath();
        ctx.translate(points[0], points[1]);
        ctx.rotate(beginAngle);
        ctx.moveTo(5, 0);
        ctx.lineTo(0, -4);
        ctx.lineTo(0, 4);
        ctx.lineTo(5, 0);
        ctx.fill();
        ctx.rotate(-beginAngle);
        ctx.translate(-points[0], -points[1]);
      }

      ctx.beginPath();
      ctx.moveTo(points[0], points[1]);
      ctx.bezierCurveTo.apply(ctx, _toConsumableArray(points.slice(2)));

      if (this.lineDash) {
        ctx.save();
        ctx.setLineDash(this.lineDash);
      }

      ctx.stroke();

      if (this.lineDash) {
        ctx.restore();
      }

      ctx.beginPath();
      ctx.translate(points[6], points[7]);
      ctx.rotate(angle);
      ctx.moveTo(5, 0);
      ctx.lineTo(0, -4);
      ctx.lineTo(0, 4);
      ctx.lineTo(5, 0);
      ctx.fill();
      ctx.rotate(-angle);
      ctx.translate(-points[6], -points[7]);

      if (this.content) {
        ctx.beginPath();

        var _bezierPoint = (0, _functions.bezierPoint)(0.5, points),
            _bezierPoint2 = _slicedToArray(_bezierPoint, 3),
            x = _bezierPoint2[0],
            y = _bezierPoint2[1],
            _angle = _bezierPoint2[2];

        ctx.translate(x, y);
        ctx.rotate(_angle);
        ctx.font = "".concat(this.fontSize, " ").concat(this.fontFamily);
        ctx.textAlign = 'center';
        ctx.fillText(this.content, 0, 10);
        ctx.rotate(-_angle);
        ctx.translate(-x, -y);
      }
    }
  }, {
    key: "isHit",
    value: function isHit(point) {
      if (!this._cachePoints) return false;
      var points = this._cachePoints;
      var dist = (0, _functions.distToBezierSegmentSquared)(point, points);
      return dist < this.approximate;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var _this$_calculateAncho = this._calculateAnchorPoints(),
          startX = _this$_calculateAncho.startX,
          startY = _this$_calculateAncho.startY,
          endX = _this$_calculateAncho.endX,
          endY = _this$_calculateAncho.endY;

      return [[startX, startY], [endX, endY]];
    }
  }]);

  return BezierLink;
}(_baseLink["default"]);

var _default = BezierLink;
exports["default"] = _default;
//# sourceMappingURL=bezier-link.js.map
