"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _stackMixin = _interopRequireDefault(require("./stackMixin"));

var _layoutMixin = _interopRequireDefault(require("./layoutMixin"));

var _functions = require("../utils/functions");

var _constance = require("../utils/constance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Group mixin 配置
 * @typedef {Object} GroupMixin~GroupConfigs
 * @property {number} width             - 设定宽度 
 * @property {number} minWidth          - 最小宽度 
 * @property {number} height            - 设定高度 
 * @property {number} padding          - 内边距
 * @property {number} paddingTop          - 内上边距
 * @property {number} paddingRight         - 内右边距
 * @property {number} paddingBottom        - 内下边距
 * @property {number} paddingLeft          - 内左边距
 * @property {boolean} lock            - 布局锁定状态 默认 true
 */

/**
* Group mixin 配置
* @typedef {GroupMixin~GroupConfigs | LayoutMixin~LayoutConfigs} GroupMixin~LayoutGroupConfigs
*/

/**
 * Group mixin 用于在形状上加上 Group 特性
 *
 * @mixin
 * @mixes LayoutMixin
 * @mixes StackMixin
 */
var GroupMixin = _objectSpread(_objectSpread(_objectSpread({}, _stackMixin["default"]), _layoutMixin["default"]), {}, {
  /**
   * 配置 mixin
   * @param {GroupMixin~LayoutGroupConfigs} configs - 配置 Group
   */
  initGroup: function initGroup(configs) {
    var _configs$lock;

    this.initStack(configs);
    this.initLayout(configs); // this.padding =          configs.padding || 2;

    this.padding = {
      top: configs.paddingTop || configs.padding || 0,
      right: configs.paddingRight || configs.padding || 0,
      bottom: configs.paddingBottom || configs.padding || 0,
      left: configs.paddingLeft || configs.padding || 0
    };
    this.definedWidth = configs.width;
    this.minWidth = configs.minWidth;
    this.definedHeight = configs.height;
    this.lock = (_configs$lock = configs.lock) !== null && _configs$lock !== void 0 ? _configs$lock : true; // this.offsetY = 0;
    // this.offsetX = 0;

    this._getBoundingGroupRect();

    this.reflow();

    this._getBoundingGroupRect();
  },
  setConfig: function setConfig(configs) {
    var _this = this;

    Object.keys(configs).forEach(function (k) {
      if (configs[k] !== undefined && configs[k] !== null) {
        _this[k] = configs[k];
        _this._rawConfigs[k] = configs[k];
      }
    });
    this.padding = {
      top: configs.paddingTop || configs.padding || 0,
      right: configs.paddingRight || configs.padding || 0,
      bottom: configs.paddingBottom || configs.padding || 0,
      left: configs.paddingLeft || configs.padding || 0
    };
  },
  _getBoundingGroupRect: function _getBoundingGroupRect() {
    var points = this._stack.getBoundingRectPoints();

    var bbox = (0, _functions.bounding_box)(points);
    var padding = this.padding;
    var minWidth = this.minWidth - padding.left - padding.right;
    var definedWidth = this.definedWidth - padding.left - padding.right;
    var w = bbox.width + padding.left + padding.right;
    var h = bbox.height + padding.top + padding.bottom;
    this.width = minWidth ? Math.max(minWidth, w) : definedWidth || w;
    this.height = this.definedHeight || h; // this.offsetY = bbox.y;
    // this.offsetX = bbox.x;
  },
  renderGroup: function renderGroup(ctx, callback) {
    ctx.save();

    if (this._isMoving) {
      ctx.globalAlpha = 0.5;
    } // this._getBoundingGroupRect();


    var anchor = this.anchor;
    ctx.save();
    callback(ctx);
    ctx.restore(); // const height = this.height;
    // const width = this.width;

    var padding = this.padding; // const spanV = height / 2 + this.offsetY - padding.top
    // const spanH = width / 2 + this.offsetX - padding.left

    var centerX = (padding.left - padding.right) / 2;
    var centerY = (padding.top - padding.bottom) / 2;
    ctx.translate(anchor[0] + centerX, anchor[1] + centerY);

    this._stack.render(ctx);

    this._linkStack.render(ctx);

    ctx.translate(-anchor[0] - centerX, -anchor[1] - centerY); // if(this._isTargeting) {
    //     this.renderFocus(ctx);
    // }

    ctx.restore();
  },
  _calculatePointBack: function _calculatePointBack(point) {
    var _point = _slicedToArray(point, 2),
        gx = _point[0],
        gy = _point[1]; // const height = this.height;
    // const width = this.width;
    // const padding = this.padding;


    var padding = this.padding;
    var centerX = (padding.left - padding.right) / 2;
    var centerY = (padding.top - padding.bottom) / 2; // const spanV = height / 2 + this.offsetY - padding.top
    // const spanH = width / 2 + this.offsetX -  padding.left

    var anchor = this.anchor; // const p = [gx - anchor[0] + spanH, gy - anchor[1] +spanV ];

    var p = [gx - anchor[0] - centerX, gy - anchor[1] - centerY];
    return p;
  },
  isHitGroup: function isHitGroup(point, condition) {
    var p = this._calculatePointBack(point);

    this._currentp = p; // 暂存，为了后续计算别的位置

    var target = this._stack.checkHit(p, condition);

    if (target) return target;
    return false;
  },

  /**
  * 反算回 canvas 顶层坐标
  * @param {Number[]} point
  * @return {Number[]} 世界坐标
  */
  calculateToCoordination: function calculateToCoordination(point) {
    var _point2 = _slicedToArray(point, 2),
        cx = _point2[0],
        cy = _point2[1]; // const height = this.height;
    // const width = this.width;
    // const padding = this.padding;
    // const spanV = height / 2 + this.offsetY - padding.top
    // const spanH = width / 2 + this.offsetX - padding.left


    var padding = this.padding;
    var centerX = (padding.left - padding.right) / 2;
    var centerY = (padding.top - padding.bottom) / 2;
    var anchor = this.anchor; // const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];

    var p = [cx + anchor[0] + centerX, cy + anchor[1] + centerY];

    if (this._belongs && this._belongs.calculateToCoordination) {
      return this._belongs.calculateToCoordination(p);
    } else {
      return p;
    }
  },
  calculateToRealWorld: function calculateToRealWorld(point) {
    var _point3 = _slicedToArray(point, 2),
        cx = _point3[0],
        cy = _point3[1]; // const height = this.height;
    // const width = this.width;
    // const padding = this.padding;
    // const spanV = height / 2 + this.offsetY - padding.top
    // const spanH = width / 2 + this.offsetX - padding.left


    var padding = this.padding;
    var centerX = (padding.left - padding.right) / 2;
    var centerY = (padding.top - padding.bottom) / 2;
    var anchor = this.anchor; // const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];

    var p = [cx + anchor[0] + centerX, cy + anchor[1] + centerY];

    if (this._belongs && this._belongs.calculateToRealWorld) {
      return this._belongs.calculateToRealWorld(p);
    }
  },
  clone: function clone() {
    var C = this.constructor;
    var configs = Object.assign({}, this._rawConfigs, {
      layout: this._layout && this._layout.clone()
    });
    var t = new C(configs);
    this.interateNodeStack(function (instance) {
      t.addToStack(instance.clone());
    });
    t.recalculate();
    return t;
  }
});

var _default = GroupMixin;
exports["default"] = _default;
//# sourceMappingURL=groupMixin.js.map
