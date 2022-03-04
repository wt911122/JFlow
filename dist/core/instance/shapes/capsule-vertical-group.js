"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _capsule = _interopRequireDefault(require("./capsule"));

var _groupMixin = _interopRequireDefault(require("../groupMixin"));

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

/**
 * 胶囊组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @constructor CapsuleVerticalGroup
 * @extends Capsule
 * @param {CapsuleGroup~CapsuleGroupConfigs} configs - 配置
 * @mixes GroupMixin
 */
var CapsuleVerticalGroup = /*#__PURE__*/function (_Capsule) {
  _inherits(CapsuleVerticalGroup, _Capsule);

  var _super = _createSuper(CapsuleVerticalGroup);

  function CapsuleVerticalGroup(configs) {
    var _this;

    _classCallCheck(this, CapsuleVerticalGroup);

    _this = _super.call(this, configs);

    _this.initGroup(configs);

    return _this;
  }

  _createClass(CapsuleVerticalGroup, [{
    key: "render",
    value: function render(ctx) {
      var _this2 = this;

      this.renderGroup(ctx, function () {
        ctx.save();

        if (_this2._isMoving) {
          ctx.globalAlpha = 0.6;
        }

        ctx.beginPath();

        var _this2$anchor = _slicedToArray(_this2.anchor, 2),
            x = _this2$anchor[0],
            y = _this2$anchor[1];

        var hw = _this2.width / 2;
        var hh = _this2.height / 2;
        var topCenter = y - hh + hw;
        var bottomCenter = y + hh - hw;
        var left = x - hw;
        var right = x + hw;
        ctx.moveTo(left, topCenter);
        ctx.arc(x, topCenter, hw, -Math.PI, 0);
        ctx.lineTo(right, bottomCenter);
        ctx.arc(x, bottomCenter, hw, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = _this2.backgroundColor;
        ctx.fill();

        if (_this2.borderWidth) {
          ctx.lineWidth = _this2.borderWidth;
          ctx.strokeStyle = _this2.borderColor;
          ctx.stroke();
        } // ctx.fillStyle = 'rgba(0,0,0,0.3)';
        // ctx.fillRect(x-hw, y-hh, this.width, this.height)


        ctx.restore();
      });
    }
  }, {
    key: "isHit",
    value: function isHit(point, condition) {
      var result = this.isHitGroup(point, condition);

      if (result) {
        return result;
      }

      var _this$anchor = _slicedToArray(this.anchor, 2),
          x = _this$anchor[0],
          y = _this$anchor[1];

      var hw = this.width / 2;
      var hh = this.height / 2;
      var yy = Math.abs(hh - hw);
      var topCenter = y - hh + hw;
      var bottomCenter = y + hh - hw;
      var rr = hw * hw;
      return point[0] > x - hw && point[0] < x + hw && point[1] > y - yy && point[1] < y + yy || Math.pow(point[0] - x, 2) + Math.pow(point[1] - topCenter, 2) < rr || Math.pow(point[0] - x, 2) + Math.pow(point[1] - bottomCenter, 2) < rr;
    }
  }]);

  return CapsuleVerticalGroup;
}(_capsule["default"]);

Object.assign(CapsuleVerticalGroup.prototype, _groupMixin["default"]);
var _default = CapsuleVerticalGroup;
exports["default"] = _default;
//# sourceMappingURL=capsule-vertical-group.js.map
