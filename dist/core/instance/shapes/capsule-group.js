"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _capsule = _interopRequireDefault(require("./capsule"));

var _groupMixin = _interopRequireDefault(require("../groupMixin"));

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
 * 钻石形组单元配置
 * @typedef {GroupMixin~LayoutGroupConfigs | Capsule~CapsuleConfigs } CapsuleGroup~CapsuleGroupConfigs
 */

/**
 * 胶囊组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @constructor CapsuleGroup
 * @extends Capsule
 * @param {CapsuleGroup~CapsuleGroupConfigs} configs - 配置
 * @mixes GroupMixin
 */
var CapsuleGroup = /*#__PURE__*/function (_Capsule) {
  _inherits(CapsuleGroup, _Capsule);

  var _super = _createSuper(CapsuleGroup);

  function CapsuleGroup(configs) {
    var _this;

    _classCallCheck(this, CapsuleGroup);

    _this = _super.call(this, configs);

    _this.initGroup(configs);

    return _this;
  }

  _createClass(CapsuleGroup, [{
    key: "render",
    value: function render(ctx) {
      var _this2 = this;

      this.renderGroup(ctx, function () {
        _capsule["default"].prototype.render.call(_this2, ctx);
      });
    }
  }, {
    key: "isHit",
    value: function isHit(point, condition) {
      var result = this.isHitGroup(point, condition);

      if (result) {
        return result;
      }

      return _capsule["default"].prototype.isHit.call(this, point);
    }
  }]);

  return CapsuleGroup;
}(_capsule["default"]);

Object.assign(CapsuleGroup.prototype, _groupMixin["default"]);
var _default = CapsuleGroup;
exports["default"] = _default;
//# sourceMappingURL=capsule-group.js.map
