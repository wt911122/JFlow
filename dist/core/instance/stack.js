"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * 绘图栈
 * @extends Array
 */
var InstanceStack = /*#__PURE__*/function (_Array) {
  _inherits(InstanceStack, _Array);

  var _super = _createSuper(InstanceStack);

  function InstanceStack() {
    var _this;

    _classCallCheck(this, InstanceStack);

    _this = _super.call(this);
    _this._currentHit = null;
    return _this;
  }
  /**
   * 绘制当前栈
   * @param {Context2d} ctx - canvas context2d
   */


  _createClass(InstanceStack, [{
    key: "render",
    value: function render(ctx) {
      var movingTarget;
      this.forEach(function (instance) {
        if (instance._isMoving) {
          movingTarget = instance;
          return;
        }

        if (instance.visible) {
          ctx.save(); // if(instance.reflow && !instance._reflowed) {
          //     instance.reflow();
          //     instance._reflowed = true;
          // }

          instance.render(ctx);
          ctx.restore();
        }
      });

      if (movingTarget) {
        ctx.save(); // if(movingTarget.reflow && !movingTarget._reflowed) {
        //     movingTarget.reflow();
        //     movingTarget._reflowed = true;
        // }

        movingTarget.render(ctx);
        ctx.restore();
      }
    }
    /**
     * 碰撞对象过滤条件
     * @name InstanceStack~InstanceFilter
     * @function
     * @param {Instance} instance - 当前对象
    */

    /**
     * 碰撞检测
     * @param {number[]} point - 碰撞点
     * @param {InstanceStack~InstanceFilter} condition - 碰撞对象过滤条件
     * @return {Instance}
     */

  }, {
    key: "checkHit",
    value: function checkHit(point, condition) {
      var i = this.length - 1;

      while (i >= 0) {
        var instance = this[i];

        if (instance.visible && !instance.ignoreHit) {
          if (condition && condition(instance)) {
            i--;
            continue;
          }

          var ishit = instance.isHit(point, condition);
          instance._isHit = !!ishit;

          if (ishit) {
            if (this._currentHit !== instance) {
              if (this._currentHit) {
                this._currentHit._isHit = false;
              }

              this._currentHit = instance;
            }

            if (typeof ishit !== 'boolean') {
              return ishit;
            }

            return instance;
          }
        }

        i--;
      }

      this._currentHit = null;
      return null;
    }
    /**
     * 获取当前层栈的最小外接矩形
     * @return {number[][]} - 外接矩形坐标
     */

  }, {
    key: "getBoundingRectPoints",
    value: function getBoundingRectPoints() {
      var points = [];
      this.forEach(function (instance) {
        if (instance.visible && !instance.absolutePosition) {
          points.splice.apply(points, [points.length, 0].concat(_toConsumableArray(instance.getBoundingRect())));
        }
      });
      return points;
    }
    /**
     * 获取当前层栈的锚点矩形
     * @return {number[][]} - 锚点矩形坐标
     */

  }, {
    key: "getAnchorRectPoints",
    value: function getAnchorRectPoints() {
      var points = [];
      this.forEach(function (instance) {
        if (instance.visible && !instance.absolutePosition) {
          points.push(instance.anchor);
        }
      });
      return points;
    }
  }]);

  return InstanceStack;
}( /*#__PURE__*/_wrapNativeSuper(Array));

var _default = InstanceStack;
exports["default"] = _default;
//# sourceMappingURL=stack.js.map
