"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
    线性布局

    排列方向
    direction:
        + vertical 从上至下排布
        + horizontal 从左至右排布
    
    不重叠，中线对齐
    只针对当前的 group

    对齐方式
    alignment: 
        + start 主轴左侧对齐
        + center 主轴对齐
        + end   主轴右侧对齐
    justify: 
        + start 开始时对齐
        + center 居中对齐
        + end   末尾对齐
        + space-between 平均分配空间对齐

 * @implements {Layout}
 */
var LinearLayout = /*#__PURE__*/function () {
  function LinearLayout() {
    var _configs$gap;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LinearLayout);

    /**
     * 通用样式属性
     * @property {string} direction     - 排列方向 默认 vertical
     * @property {number} gap           - 边距, 默认是 5
     * @property {string} alignment     - 垂直排列方向对齐方式 默认 center
     * @property {string} justify       - 排列方向对齐方式 默认 center
     */
    this.direction = configs.direction || 'vertical';
    this.gap = (_configs$gap = configs.gap) !== null && _configs$gap !== void 0 ? _configs$gap : 5;
    this.alignment = configs.alignment || 'center';
    this.justify = configs.justify || 'center'; // this.widthSetByParent =  configs.width === '100%'

    this._rawConfigs = configs;
  }

  _createClass(LinearLayout, [{
    key: "reflow",
    value: function reflow(group) {
      var _this = this;

      var stack = group._stack.filter(function (instance) {
        return instance.visible && !instance.absolutePosition;
      });

      var absoluteStack = group._stack.filter(function (instance) {
        return instance.visible && instance.absolutePosition;
      });

      var groupWidth = group.width - group.padding.left - group.padding.right; // console.log(groupWidth, group.height, group)

      if (this.direction === 'vertical') {
        var reduceHeight = 0;
        var lastInstanceHeight = 0;
        var maxWidth = 0;
        var allHeight = 0;
        stack.forEach(function (instance, idx) {
          var _instance$getBounding = instance.getBoundingDimension(),
              width = _instance$getBounding.width,
              height = _instance$getBounding.height; // console.log(height, instance.type);


          var gap = idx > 0 ? _this.gap : 0;
          maxWidth = Math.max(width, maxWidth);
          allHeight += height + gap;
          reduceHeight += height / 2 + gap + lastInstanceHeight;
          lastInstanceHeight = height / 2;
          instance.anchor = [0, reduceHeight];
        });
        maxWidth = Math.max(groupWidth, maxWidth);
        allHeight = allHeight / 2;

        if (this.alignment === 'start') {
          stack.forEach(function (instance, idx) {
            var _instance$getBounding2 = instance.getBoundingDimension(),
                width = _instance$getBounding2.width;

            instance.anchor[0] = -(maxWidth - width) / 2;
            instance.anchor[1] -= allHeight; // console.log(maxWidth, width, instance.anchor[0])
          });
        }

        if (this.alignment === 'end') {
          stack.forEach(function (instance, idx) {
            var _instance$getBounding3 = instance.getBoundingDimension(),
                width = _instance$getBounding3.width;

            instance.anchor[0] = (maxWidth - width) / 2;
            instance.anchor[1] -= allHeight;
          });
        }

        if (this.alignment === 'center') {
          stack.forEach(function (instance, idx) {
            var _instance$getBounding4 = instance.getBoundingDimension(),
                width = _instance$getBounding4.width;

            instance.anchor[1] -= allHeight;
          });
        }
      }

      if (this.direction === 'horizontal') {
        var reduceWidth = 0;
        var lastInstanceWidth = 0;
        var maxHeight = 0;
        var allWidth = 0;
        var allPureWidth = 0;
        stack.forEach(function (instance, idx) {
          var _instance$getBounding5 = instance.getBoundingDimension(),
              width = _instance$getBounding5.width,
              height = _instance$getBounding5.height;

          var gap = idx > 0 ? _this.gap : 0;
          maxHeight = Math.max(height, maxHeight);
          allWidth += width + gap;
          allPureWidth += width;
          reduceWidth += width / 2 + gap + lastInstanceWidth;
          lastInstanceWidth = width / 2;
          instance.anchor = [reduceWidth, 0];
        });

        if (this.justify === 'start') {
          var withdraw = groupWidth / 2;
          stack.forEach(function (instance, idx) {
            instance.anchor[0] -= withdraw;
          });
        }

        if (this.justify === 'end') {
          var _withdraw = groupWidth / 2 - allWidth;

          stack.forEach(function (instance, idx) {
            instance.anchor[0] += _withdraw;
          });
        }

        if (this.justify === 'center') {
          var _withdraw2 = allWidth / 2;

          stack.forEach(function (instance, idx) {
            instance.anchor[0] -= _withdraw2;
          });
        }

        if (this.justify === 'space-between' && stack.length > 1) {
          var width = Math.max(groupWidth, allWidth);
          var gapAverage = (width - allWidth) / (stack.length - 1);

          var _withdraw3 = width / 2;

          stack.forEach(function (instance, idx) {
            instance.anchor[0] += gapAverage * idx - _withdraw3;
          });
        }

        if (this.alignment === 'start') {
          stack.forEach(function (instance, idx) {
            var _instance$getBounding6 = instance.getBoundingDimension(),
                height = _instance$getBounding6.height;

            instance.anchor[1] = -(maxHeight - height) / 2;
          });
        }

        if (this.alignment === 'end') {
          stack.forEach(function (instance, idx) {
            var _instance$getBounding7 = instance.getBoundingDimension(),
                height = _instance$getBounding7.height;

            instance.anchor[1] = (maxHeight - height) / 2;
          });
        }
      }

      if (absoluteStack.length) {
        group._getBoundingGroupRect();

        var WIDTH = group.width / 2;
        var HEIGHT = group.height / 2;
        absoluteStack.forEach(function (instance) {
          instance.anchor = _this._resolveAbsoluteAnchor(instance.absolutePosition, instance, WIDTH, HEIGHT);
        });
      }
    }
  }, {
    key: "_resolveAbsoluteAnchor",
    value: function _resolveAbsoluteAnchor(config, instance, w, h) {
      var top = config.top,
          right = config.right,
          bottom = config.bottom,
          left = config.left;

      var _instance$getBounding8 = instance.getBoundingDimension(),
          width = _instance$getBounding8.width,
          height = _instance$getBounding8.height;

      var hw = width / 2;
      var hh = height / 2;
      var y = 0;
      var x = 0;

      if (top) {
        y = top + hh - h;
      }

      if (right) {
        x = w - right - hw;
      }

      if (bottom) {
        y = h - bottom - hh;
      }

      if (left) {
        x = left + hw - w;
      }

      return [x, y];
    }
  }, {
    key: "clone",
    value: function clone() {
      return new LinearLayout(this._rawConfigs);
    }
  }]);

  return LinearLayout;
}();

var _default = LinearLayout;
exports["default"] = _default;
//# sourceMappingURL=linear-layout.js.map
