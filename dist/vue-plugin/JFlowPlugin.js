"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _JFlow = _interopRequireDefault(require("./components/JFlow"));

var _JFlowInstance = _interopRequireDefault(require("./components/JFlowInstance"));

var _JFlowLink = _interopRequireDefault(require("./components/JFlowLink"));

var _JFlowGroup = _interopRequireDefault(require("./components/JFlowGroup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var JFLOW_NODES = [
/**
 * JFlow {@link Point} 的 vue 封装 
 * @module j-point
 * @property {Point~PointConfigs} configs - 传给 Point 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Point',
/**
 * JFlow {@link Rectangle} 的 vue 封装 
 * @module j-rectangle
 * @property {Rectangle~RectangleConfigs} configs - 传给 Rectangle 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Rectangle',
/**
 * JFlow {@link Capsule} 的 vue 封装 
 * @module j-capsule
 * @property {Capsule~CapsuleConfigs} configs - 传给 Capsule 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Capsule',
/**
 * JFlow {@link Diamond} 的 vue 封装 
 * @module j-diamond
 * @property {Diamond~DiamondConfigs} configs - 传给 Diamond 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Diamond',
/**
 * JFlow {@link Rhombus} 的 vue 封装 
 * @module j-rhombus
 * @property {Rhombus~RhombusConfigs} configs - 传给 Diamond 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Rhombus',
/**
 * JFlow {@link Text} 的 vue 封装 
 * @module j-text
 * @property {Text~TextConfigs} configs - 传给 Text 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Text',
/**
 * JFlow {@link Icon} 的 vue 封装 
 * @module j-icon
 * @property {Icon~IconConfigs} configs - 传给 Icon 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'Icon'];
/**
 * @typedef {BezierLink~Configs} j-bezier-link~Configs
 * @property {String} from   - 起始单元 jflowId
 * @property {String} to     - 终止单元 jflowId
 */

var JFLOW_LINKS = ['Link', 'PolyLink',
/**
 * JFlow {@link BezierLink} 的 vue 封装 
 * @module j-bezier-link
 * @property {j-bezier-link~Configs} configs - 传给 BezierLink 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'BezierLink'];
var JFLOW_GROUPS = [
/**
 * JFlow {@link CapsuleGroup} 的 vue 封装 
 * @module j-capsule-group
 * @property {CapsuleGroup~CapsuleGroupConfigs} configs - 传给 CapsuleGroup 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'CapsuleGroup',
/**
 * JFlow {@link CapsuleVerticalGroup} 的 vue 封装 
 * @module j-capsule-vertical-group
 * @property {CapsuleGroup~CapsuleGroupConfigs} configs - 传给 CapsuleVerticalGroup 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'CapsuleVerticalGroup',
/**
 * JFlow {@link DiamondGroup} 的 vue 封装 
 * @module j-diamond-group
 * @property {DiamondGroup~DiamondGroupConfigs} configs - 传给 DiamondGroup 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'DiamondGroup',
/**
 * JFlow {@link DiamondVerticalGroup} 的 vue 封装 
 * @module j-diamond-vertical-group
 * @property {DiamondGroup~DiamondGroupConfigs} configs - 传给 DiamondVerticalGroup 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'DiamondVerticalGroup',
/**
 * JFlow {@link RhombusGroup} 的 vue 封装 
 * @module j-rhombus-group
 * @property {RhombusGroup~RhombusGroupConfigs} configs - 传给 DiamondGroup 的配置
 * @property {Boolean} visible - 可见状态
 * @property {String} jflowId - 全局唯一ID，用于连线单元
 */
'RhombusGroup'];
var components = [{
  /**
   * JFlow {@link JFlow} 的 vue 封装 
   * @module j-jflow
   * @property {JFlow~JFlowConfigs} configs - 传给 JFlow 的配置
   */
  name: 'Jflow',
  component: _JFlow["default"]
}, {
  /**
   * JFlow {@link RectangleGroup} 的 vue 封装 
   * @module j-group
   * @property {RectangleGroup~RectangleGroupConfigs} configs - 传给 RectangleGroup 的配置
   */
  name: 'Group',
  component: (0, _JFlowGroup["default"])('Group')
}].concat(_toConsumableArray(JFLOW_GROUPS.map(function (name) {
  return {
    name: name,
    component: (0, _JFlowGroup["default"])(name)
  };
})), _toConsumableArray(JFLOW_NODES.map(function (name) {
  return {
    name: name,
    component: (0, _JFlowInstance["default"])(name)
  };
})), _toConsumableArray(JFLOW_LINKS.map(function (name) {
  return {
    name: name,
    component: (0, _JFlowLink["default"])(name)
  };
})));
var componentPrefix = 'j';
/**
 * @module JFlowVuePlugin 
 */

var _default = {
  /**
   * 安装 JFlowVuePlugin
   * @function
   * @param {Vue} Vue - Vue
   * @param {Object} options - Vue plugin 配置
   * @param {string} options.prefix - 组件前缀，默认是 j
   * @param {Object} options.custom - 自定义组件，形式为 { key: {@link:Instance} }
   */
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var prefixToUse = componentPrefix;

    if (options && options.prefix) {
      prefixToUse = options.prefix;
    }

    ;
    components.forEach(function (k) {
      Vue.component("".concat(prefixToUse).concat(k.name), k.component);
    });

    if (options.custom) {
      Object.keys(options.custom).forEach(function (name) {
        Vue.component("".concat(prefixToUse).concat(name), (0, _JFlowInstance["default"])(options.custom[name]));
      });
    }
  }
}; // export { * as JFlowInstance } from './components/JFlowInstance'; 

exports["default"] = _default;
//# sourceMappingURL=JFlowPlugin.js.map
