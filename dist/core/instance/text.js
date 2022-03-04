"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rectangle = _interopRequireDefault(require("./shapes/rectangle"));

var _constance = require("../utils/constance");

var _canvas = require("../utils/canvas");

var _events = _interopRequireDefault(require("../events"));

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

function createInputElement() {
  var input = document.createElement('input');
  input.setAttribute('style', "\n        position: absolute;\n        left: 0;\n        top: 0;\n        border:none;\n        background-image:none;\n        background-color:transparent;\n        -webkit-box-shadow: none;\n        -moz-box-shadow: none;\n        box-shadow: none;");
  return input;
}
/**
 * 文字对齐方式
 * @readonly
 * @enum {string}
 */


var TEXT_ALIGN = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right'
};
/**
 * 文字单元 配置
 * @typedef {Rectangle~RectangleConfigs} Text~TextConfigs
 * @property {String} fontFamily    - 字体
 * @property {Number} fontSize      - 字号
 * @property {String} content       - 内容
 * @property {String} textColor     - 字体颜色
 * @property {TEXT_ALIGN} textAlign     - 文字对齐方式
 * @property {String} backgroundColor     - 背景颜色
 * @property {number} lineHeight    - 行高
 * @property {number} indent        - 缩进
 * @property {number} editable      - 是否可编辑
 * @property {number} minWidth      - 最小宽度
 */

/**
 * 文字对象
 * @description 可以绘制文字
 * @constructor Text
 * @extends Rectangle
 * @param {Text~TextConfigs} configs - 配置
 */

var Text = /*#__PURE__*/function (_Rectangle) {
  _inherits(Text, _Rectangle);

  var _super = _createSuper(Text);

  function Text(configs) {
    var _this;

    _classCallCheck(this, Text);

    _this = _super.call(this, configs);
    _this.type = 'Text';
    _this.content = configs.content || '';
    _this.fontFamily = configs.fontFamily || '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
    _this.fontSize = configs.fontSize || '28px';
    _this.textColor = configs.textColor || 'white';
    _this.textAlign = configs.textAlign || TEXT_ALIGN.CENTER;
    _this.textBaseline = configs.textBaseline || 'middle';
    _this.lineHeight = configs.lineHeight;
    _this.indent = configs.indent || 0;
    _this.backgroundColor = configs.backgroundColor;
    _this.editable = configs.editable;
    _this.acceptPatten = configs.acceptPatten;
    _this.minWidth = configs.minWidth || 0;
    _this.editStatus = {
      editting: false
    };
    (0, _canvas.requestCacheCanvas)(function (ctx) {
      _this.renderShadowText(ctx);
    });

    _this._makeEditable();

    return _this;
  }

  _createClass(Text, [{
    key: "_makeEditable",
    value: function _makeEditable() {
      var _this2 = this;

      if (this.editable) {
        this.addEventListener('click', function (event) {
          var x;
          var hw = _this2.width / 2;

          if (_this2.textAlign === TEXT_ALIGN.LEFT) {
            x = _this2.anchor[0] - hw + _this2.indent / 2;
          } else if (_this2.textAlign === TEXT_ALIGN.RIGHT) {
            x = _this2.anchor[0] + hw;
          } else {
            x = _this2.anchor[0] + _this2.indent / 2;
          }

          var p = [x, -_this2.height / 2];
          var fontSize = +/(\d+)/.exec(_this2.fontSize)[1];

          var _this2$calculateToRea = _this2.calculateToRealWorld(p),
              _this2$calculateToRea2 = _slicedToArray(_this2$calculateToRea, 2),
              offsetX = _this2$calculateToRea2[0],
              offsetY = _this2$calculateToRea2[1];

          var inputElement = createInputElement();
          var wrapper = _this2._jflow.DOMwrapper;
          var oldVal = _this2.content;
          inputElement.style.transform = "translate(".concat(offsetX, "px, ").concat(offsetY, "px)");
          inputElement.style.width = _this2.calculateToRealWorldWithScalar(_this2.width) + 'px';
          inputElement.style.height = _this2.calculateToRealWorldWithScalar(_this2.height) + 'px';
          inputElement.style.fontFamily = _this2.fontFamily;
          wrapper.style.fontSize = "".concat(fontSize * _this2._jflow.scale, "px");
          inputElement.style.fontSize = "".concat(fontSize * _this2._jflow.scale, "px");
          inputElement.style.lineHeight = "".concat(_this2.lineHeight * _this2._jflow.scale, "px");
          inputElement.style.textIndent = "".concat(_this2.indent * _this2._jflow.scale, "px");
          inputElement.value = _this2.content;
          inputElement.style.color = _this2.textColor;
          inputElement.addEventListener("focus", function () {
            _this2.content = '';

            _this2._jflow._render();

            inputElement.style.outline = "none";
          });

          var _blurHandler = function blurHandler() {
            if (_this2.acceptPatten) {} else {
              var val = inputElement.value;
              /**
               * 文字改变事件
               * @event Text#change
               * @type {object}
               * @property {Text} target           - 当前文字对象
               * @property {String} oldVal         - 原始文字
               * @property {String} val            - 当前文字
               */

              _this2.dispatchEvent(new _events["default"]('change', {
                target: _this2,
                oldVal: oldVal,
                val: val
              }));

              _this2.content = oldVal;
              inputElement.removeEventListener('blur', _blurHandler);
              wrapper.removeChild(inputElement);
              inputElement = null;
              _blurHandler = null;
            }
          };

          inputElement.addEventListener('blur', _blurHandler);

          var keyUpHandler = function keyUpHandler(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault();
              inputElement.removeEventListener('keypress', keyUpHandler);

              _blurHandler();
            }
          };

          inputElement.addEventListener('keypress', keyUpHandler);
          wrapper.append(inputElement);
          inputElement.focus();
        });
      }
    }
  }, {
    key: "renderShadowText",
    value: function renderShadowText(ctx) {
      ctx.beginPath();
      ctx.font = "".concat(this.fontSize, " ").concat(this.fontFamily);
      ctx.textAlign = this.textAlign;
      ctx.textBaseline = this.textBaseline;
      ctx.fillStyle = this.textColor;

      var _ctx$measureText = ctx.measureText(this.content),
          actualBoundingBoxLeft = _ctx$measureText.actualBoundingBoxLeft,
          actualBoundingBoxRight = _ctx$measureText.actualBoundingBoxRight,
          fontBoundingBoxAscent = _ctx$measureText.fontBoundingBoxAscent,
          fontBoundingBoxDescent = _ctx$measureText.fontBoundingBoxDescent;

      this._textWidth = this.indent + Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight);
      this.width = Math.max(this.minWidth, this._textWidth);
      var height = Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent);

      if (this.lineHeight) {
        this.height = this.lineHeight;
      } else {
        this.height = height;
      }
    }
  }, {
    key: "setConfig",
    value: function setConfig(configs) {
      var _this3 = this;

      Object.keys(configs).forEach(function (k) {
        if (configs[k] !== undefined && configs[k] !== null) {
          _this3[k] = configs[k];
          _this3._rawConfigs[k] = configs[k];
        }
      });
      (0, _canvas.requestCacheCanvas)(function (ctx) {
        _this3.renderShadowText(ctx);
      });
    }
  }, {
    key: "render",
    value: function render(ctx) {
      ctx.save();

      if (this._isMoving) {
        ctx.globalAlpha = 0.6;
      } // this.renderShadowText(ctx);
      // const {
      //     borderRadius: radius, anchor, width, height
      // } = this;
      // if(this.backgroundColor || this.borderColor){
      //     ctx.save();
      //     ctx.beginPath();
      //     if(this.borderRadius) {
      //         const x = this.anchor[0] - this.width / 2;
      //         const y = this.anchor[1] - this.height / 2;
      //         ctx.moveTo(x + radius, y);
      //         ctx.lineTo(x + width - radius, y);
      //         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      //         ctx.lineTo(x + width, y + height - radius);
      //         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      //         ctx.lineTo(x + radius, y + height);
      //         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      //         ctx.lineTo(x, y + radius);
      //         ctx.quadraticCurveTo(x, y, x + radius, y);
      //         ctx.closePath();
      //     } else {
      //         ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
      //     }
      //     if (this.backgroundColor){
      //         ctx.fillStyle = this.backgroundColor;
      //         ctx.fill();
      //     }
      //     if(this.borderColor) {
      //         ctx.strokeStyle = this.borderColor;
      //         ctx.stroke();
      //     }
      //     ctx.restore();
      // }


      ctx.beginPath();
      ctx.font = "".concat(this.fontSize, " ").concat(this.fontFamily);
      ctx.textAlign = this.textAlign;
      ctx.textBaseline = this.textBaseline;
      ctx.fillStyle = this.textColor;

      if (this.textAlign === TEXT_ALIGN.LEFT) {
        var hw = this.width / 2;
        ctx.fillText(this.content, this.anchor[0] - hw + this.indent / 2, this.anchor[1]);
      } else if (this.textAlign === TEXT_ALIGN.RIGHT) {
        var _hw = this.width / 2;

        ctx.fillText(this.content, this.anchor[0] + _hw, this.anchor[1]);
      } else {
        ctx.fillText(this.content, this.anchor[0] + this.indent / 2, this.anchor[1]);
      } // ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
      // ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';


      ctx.fill();
      ctx.restore();
    }
  }]);

  return Text;
}(_rectangle["default"]);

var _default = Text;
exports["default"] = _default;
//# sourceMappingURL=text.js.map
