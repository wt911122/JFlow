"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rectangle = _interopRequireDefault(require("./shapes/rectangle"));

var _stackMixin = _interopRequireDefault(require("./stackMixin"));

var _layoutMixin = _interopRequireDefault(require("./layoutMixin"));

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

/**
 * 图片单元 配置
 * @typedef {Rectangle~RectangleConfigs} Icon~IconConfigs
 * @property {number} image   - 图片地址
 * @property {number} imageWidth   - 图片宽度
 * @property {number} imageHeight   - 图片高度
 */

/**
 * 图片单元
 * @description 图片单元可以绘制图片，图片加载后会自动重新绘制
 * @constructor Icon
 * @extends Rectangle
 * @param {Icon~IconConfigs} configs - 配置
 */
var Icon = /*#__PURE__*/function (_Rectangle) {
  _inherits(Icon, _Rectangle);

  var _super = _createSuper(Icon);

  function Icon(configs) {
    var _this;

    _classCallCheck(this, Icon);

    _this = _super.call(this, configs);
    _this.image = configs.image;

    _this.image.onload = function () {
      requestAnimationFrame(function () {
        _this._jflow._render();
      });
    };

    _this.imageBounding = {
      width: configs.imageWidth || configs.width,
      height: configs.imageHeight || configs.height
    };
    return _this;
  }

  _createClass(Icon, [{
    key: "setConfig",
    value: function setConfig(configs) {
      var _this2 = this;

      Object.keys(configs).forEach(function (k) {
        if (configs[k] !== undefined && configs[k] !== null) {
          _this2[k] = configs[k];
          _this2._rawConfigs[k] = configs[k];
        }
      });

      if (configs.image && !configs.image.complete) {
        this.image.onload = function () {
          requestAnimationFrame(function () {
            _this2._jflow._render();
          });
        };
      }

      this.imageBounding = {
        width: configs.imageWidth || configs.width || this.imageBounding.width,
        height: configs.imageHeight || configs.height || this.imageBounding.height
      };
    }
  }, {
    key: "render",
    value: function render(ctx) {
      ctx.save();

      if (this._isMoving) {
        ctx.globalAlpha = 0.6;
      }

      _rectangle["default"].prototype.render.call(this, ctx);

      var x = this.anchor[0] - this.width / 2;
      var y = this.anchor[1] - this.height / 2;

      if (this.image.complete) {
        ctx.drawImage(this.image, x, y, this.imageBounding.width, this.imageBounding.height);
      }

      ctx.restore();
    }
  }]);

  return Icon;
}(_rectangle["default"]);

var _default = Icon;
exports["default"] = _default;
//# sourceMappingURL=image.js.map
