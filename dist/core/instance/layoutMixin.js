"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Layout mixin 配置
 * @typedef {Object} LayoutMixin~LayoutConfigs
 * @property {Layout} layout             - 布局对象 
 */

/**
 * 布局 mixin 用于注册和方便控制布局
 *
 * @mixin
 */
var LayoutMixin = {
  _layout: null,
  // _reflowed: false,

  /**
   * 初始化布局
   * @param {LayoutMixin~LayoutConfigs} configs - 配置
   */
  initLayout: function initLayout(configs) {
    this._layout = configs.layout;
  },

  /**
   * 从当前层出发，向上层递归重排
   */
  recalculateUp: function recalculateUp() {
    var dirty = true;

    if (this.getBoundingDimension) {
      var _this$getBoundingDime = this.getBoundingDimension(),
          wold = _this$getBoundingDime.width,
          hold = _this$getBoundingDime.height;

      if (this.resetChildrenPosition) {
        this.resetChildrenPosition();
      }

      if (this._getBoundingGroupRect) {
        this._getBoundingGroupRect();
      }

      this.reflow();

      if (this._getBoundingGroupRect) {
        this._getBoundingGroupRect();
      }

      var _this$getBoundingDime2 = this.getBoundingDimension(),
          wnow = _this$getBoundingDime2.width,
          hnow = _this$getBoundingDime2.height;

      dirty = wold !== wnow || hold !== hnow;
    } else {
      this.reflow();
    }

    if (this._belongs && dirty) {
      this._belongs.recalculateUp();
    }
  },

  /**
   * 重新计算布局，相当于浏览器里面重排，并重算当前布局下的最小外接矩形
   */
  recalculate: function recalculate() {
    // this._reflowed = true;
    this.reflow();

    if (this._getBoundingGroupRect) {
      this._getBoundingGroupRect();
    } // 这个地方到底是手动还是自动？自动时机再试试看好了
    // if(this._belongs) {
    //     this._belongs.recalculate();
    // }

  },

  /**
   * 布局静态检查
   * @param {Instance} instance - 检查单元
   * @return {Boolean} - 检查结果 
   */
  staticCheck: function staticCheck(instance) {
    if (this._layout) {
      return this._layout.staticCheck(instance, this);
    }

    return false;
  },

  /**
   * 重新计算布局，相当于浏览器里面重排
   */
  reflow: function reflow() {
    if (this._layout) {
      this._layout.reflow(this);
    }
  }
};
var _default = LayoutMixin;
exports["default"] = _default;
//# sourceMappingURL=layoutMixin.js.map
