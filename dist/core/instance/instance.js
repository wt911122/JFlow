"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _functions = require("../utils/functions");

var _constance = require("../utils/constance");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var margin = 5;
var ishitKey = Symbol('ishit');
/**
 * @typedef Instance~Configs
 * @type {object}
 * @property {number} borderWidth      - 边的宽度 默认是 2
 * @property {string} borderColor      - 边框颜色 默认 black
 * @property {string} color            - 填充颜色 默认 white
 * @property {string} shadowColor      - 阴影颜色
 * @property {string} shadowBlur       - 阴影扩散范围
 * @property {string} shadowOffsetX    - 阴影偏移 X
 * @property {string} shadowOffsetX    - 阴影偏移 Y
 */

/** 
 * 图中的最小单元
 * @constructor Instance
 * @extends EventTarget
 * @param {Instance~Configs} configs - 最小单元的一些通用属性配置
 */

var Instance = /*#__PURE__*/function (_EventTarget) {
  _inherits(Instance, _EventTarget);

  var _super = _createSuper(Instance);

  function Instance() {
    var _this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Instance);

    _this = _super.call(this);
    Object.assign(_assertThisInitialized(_this), configs); // this.anchor = configs.anchor || [0, 0];
    // this.belongs = undefined;

    /** 
     * @property {number} visible      - 元素可见 默认 true
     */

    _this.visible = true; // this._jflow = undefined;

    _this._belongs = undefined;
    _this[ishitKey] = false;
    /** layout 抽象节点关联属性 */

    _this._layoutNode = undefined;
    /**
     * 通用样式属性
     * @property {number} borderWidth      - 边的宽度 默认是 2
     * @property {string} borderColor      - 边框颜色 默认 black
     * @property {string} backgroundColor  - 填充颜色 默认 white
     * @property {string} shadowColor      - 阴影颜色
     * @property {string} shadowBlur       - 阴影扩散范围
     * @property {string} shadowOffsetX    - 阴影偏移 X
     * @property {string} shadowOffsetX    - 阴影偏移 Y
     */

    _this.borderWidth = configs.borderWidth || 0;
    _this.borderColor = configs.borderColor || 'transparent'; // this.hoverStyle =       configs.hoverStyle || 'transparent';

    _this.backgroundColor = configs.backgroundColor || 'transparent';
    _this.shadowColor = configs.shadowColor;
    _this.shadowBlur = configs.shadowBlur || 5;
    _this.shadowOffsetX = configs.shadowOffsetX || 0;
    _this.shadowOffsetY = configs.shadowOffsetY || 0;
    return _this;
  }
  /**
   * @property {boolean} _isTargeting - 当前单元选中状态
   */


  _createClass(Instance, [{
    key: "_isTargeting",
    get: function get() {
      return this === (this._jflow._target.instance || this._jflow._target.link);
    }
    /**
     * @property {boolean} _isMoving - 当前单元移动状态
     */

  }, {
    key: "_isMoving",
    get: function get() {
      return this === this._jflow._getMovingTarget();
    }
    /**
     * @property {boolean} _isHit  - 当前单元碰撞检测状态
     */

  }, {
    key: "_isHit",
    get: function get() {
      return this[ishitKey];
    }
    /**
     * @property {JFlow} _jflow -     * canvas上 jflow 实体
     */
    ,
    set: function set(ishit) {
      if (this[ishitKey] !== ishit) {
        /**
         * 鼠标移入事件
         *
         * @event Instance#mouseenter
         * @type {object}
         * @property {Instance} instance      - 移入的对象 
         */

        /**
         * 鼠标移出事件
         *
         * @event Instance#mouseleave
         * @type {object}
         * @property {Instance} instance      - 移入的对象 
         */
        this.dispatchEvent(new CustomEvent(ishit ? 'mouseenter' : 'mouseleave', {
          detail: {
            instance: this
          }
        }));
      }

      this[ishitKey] = ishit; // validation could be checked here such as only allowing non numerical values
    }
    /**
     * 改变当前配置
     * @param {Configs} configs - The string containing two comma-separated numbers.
     */

  }, {
    key: "_jflow",
    get: function get() {
      return this._belongs.uniqueName === 'jflow' ? this._belongs : this._belongs._jflow;
    }
  }, {
    key: "setConfig",
    value: function setConfig(configs) {
      var _this2 = this;

      Object.keys(configs).forEach(function (k) {
        if (configs[k] !== undefined && configs[k] !== null) {
          _this2[k] = configs[k];
        }
      });
    }
    /**
     * 绘制单元
     * @param {Context2d} ctx 
     */

  }, {
    key: "render",
    value: function render(ctx) {
      throw 'require render implement';
    }
    /**
     * 判断当前单元是否被命中
     * @param {number[]} point 
     * @return {Boolean}
     */

  }, {
    key: "isHit",
    value: function isHit(point) {
      throw 'require isHit implement';
    }
    /**
     * 计算当前的最大外接矩形的
     * @return {number[][]} [lefttop: [number,number], rightbottom: [number, number]]
     */

  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      throw 'require getBoundingRect implement';
    }
  }, {
    key: "calculateIntersection",
    value: function calculateIntersection() {
      throw 'require calculateIntersection implement';
    }
    /**
     * 计算当前连线接入点的位置
     * @return {Object} intersection 交叉点
     * @return {number} intersection[DIRECTION.TOP] 上
     * @return {number} intersection[DIRECTION.BOTTOM] 下
     * @return {number} intersection[DIRECTION.LEFT] 上
     * @return {number} intersection[DIRECTION.RIGHT] 右
     */

  }, {
    key: "getIntersectionsInFourDimension",
    value: function getIntersectionsInFourDimension() {
      throw 'require getIntersectionsInFourDimension implement';
    }
    /**
     * 获取当前所在层级的坐标
     * @return {Number[]} 坐标
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.anchor;
    }
    /**
     * 获取宽高
     * @return {Object} demension 宽高
     * @return {number} demension.width 宽
     * @return {number} demension.height 高
     */

  }, {
    key: "getBoundingDimension",
    value: function getBoundingDimension() {
      var rect = instance.getBoundingRect();
      var min_y = Infinity;
      var max_y = -Infinity;
      var min_x = Infinity;
      var max_x = -Infinity;
      rect.forEach(function (point) {
        max_y = Math.max(max_y, point[1]);
        min_y = Math.min(min_y, point[1]);
        max_x = Math.max(max_x, point[0]);
        min_x = Math.min(min_x, point[0]);
      });
      return {
        height: max_y - min_y,
        width: max_x - min_x
      };
    }
    /**
     * 冒泡事件
     * @param {JFlowEvent} customEvent 自定义事件
     */

  }, {
    key: "bubbleEvent",
    value: function bubbleEvent(customEvent) {
      this.dispatchEvent(customEvent);

      if (customEvent.detail.bubbles) {
        if (this._belongs.bubbleEvent) {
          this._belongs.bubbleEvent(customEvent);
        } else {
          this._belongs.dispatchEvent(customEvent);
        }
      }
    }
    /**
     * 反算回页面的像素坐标
     * @param {Number[]} point
     * @return {Number[]} 世界坐标
     */

  }, {
    key: "calculateToRealWorld",
    value: function calculateToRealWorld(point) {
      if (this._belongs && this._belongs.calculateToRealWorld) {
        return this._belongs.calculateToRealWorld(point);
      } else {
        return point;
      }
    }
  }, {
    key: "calculateToRealWorldWithScalar",
    value: function calculateToRealWorldWithScalar(length) {
      return this._jflow.scale * length;
    }
    /**
     * 从当前布局中删除虚拟布局节点
     */

  }, {
    key: "removeFromLayoutSource",
    value: function removeFromLayoutSource() {
      if (this._layoutNode) {
        this._layoutNode.remove();
      }
    }
  }, {
    key: "recalculateUp",
    value: function recalculateUp() {
      if (this.belongs) {
        this.belongs.recalculateUp();
      }
    }
  }]);

  return Instance;
}( /*#__PURE__*/_wrapNativeSuper(EventTarget));

var _default = Instance;
exports["default"] = _default;
//# sourceMappingURL=instance.js.map
