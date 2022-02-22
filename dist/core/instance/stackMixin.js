"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _stack = _interopRequireDefault(require("./stack"));

var _polylineLink = _interopRequireDefault(require("./polyline-link"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import Link from './link';

/**
 * 对象栈 mixin 用于方便控制节点栈和连线栈
 *
 * @mixin
 */
var StackMixin = {
  instances: [],
  links: [],
  _stack: null,
  _linkStack: null,

  /**
   * 初始化对象栈
   * @param {JflowConfigs} configs - 配置
   */
  initStack: function initStack(_ref) {
    var _this = this;

    var data = _ref.data;
    this._stack = new _stack["default"]();
    this._linkStack = new _stack["default"]();
    if (!data) return;
    this.instances = data.instances;
    this.links = data.links;
    this.instances.forEach(function (i) {
      _this._stack.push(i);

      i._belongs = _this;
    });
    this.links.forEach(function (link) {
      _this._linkStack.push(link);

      link._belongs = _this;
    });
  },

  /**
   * 加入节点对象
   * @param {Node} instance - 节点对象
   */
  addToStack: function addToStack(instance) {
    instance._belongs = this;

    this._stack.push(instance); // this.recalculate()

  },

  /**
   * 替换对象
   * @param {Instance} target - 被替换的对象
   * @param {Instance} instance - 替换对象
   */
  replaceFromStack: function replaceFromStack(target, instance) {
    var index = this._stack.findIndex(function (i) {
      return i === target;
    });

    this._stack.splice(index, 1, instance);

    target._belongs = null;
    instance._belongs = this; // this.recalculate()
  },

  /**
   * 加入连线对象
   * @param {BaseLink} instance - 连线对象
   */
  addToLinkStack: function addToLinkStack(link) {
    link._belongs = this;

    this._linkStack.push(link);
  },

  /**
   * 删除节点对象
   * @param {Node} target - 节点对象
   */
  removeFromStack: function removeFromStack(target) {
    // this.removeLinkOnInstance(target);
    var index = this._stack.findIndex(function (i) {
      return i === target;
    });

    this._stack.splice(index, 1); // this.recalculate()

  },

  /**
   * 删除连线对象
   * @param {Node} target - 连线对象
   */
  removeFromLinkStack: function removeFromLinkStack(target) {
    var index = this._linkStack.findIndex(function (i) {
      return i === target;
    });

    this._linkStack.splice(index, 1);
  },
  emptyLink: function emptyLink() {
    this._linkStack = new _stack["default"]();
  },

  /**
   * 重置当前栈中对象的位置
   */
  resetChildrenPosition: function resetChildrenPosition() {
    this._stack.forEach(function (i) {
      i.anchor = [0, 0];
    });
  },

  /* 
      还是丢给实现方去处理，这个不属于框架自带的通用逻辑
  removeLinkOnInstance(target) {
      const fromInstances = [];
      const toInstances = [];
      const removelinks = [];
      let _constuctor;
      this._linkStack.forEach(l => {
          if(l.from === target){
              toInstances.push(l.to);
              _constuctor = l.__proto__.constructor;
              removelinks.push(l);
          }
          if(l.to === target){
              fromInstances.push(l.from);
              _constuctor = l.__proto__.constructor;
              removelinks.push(l);
          }  
      })
      
      removelinks.forEach(l => {
          this.removeFromLinkStack(l);
      });
      // 暂且全连接吧
      fromInstances.forEach(f => {
          toInstances.forEach(t => {
              this.addToLinkStack(new _constuctor({
                  from: f, 
                  to: t
              }))
          });
      });
      return {
          fromInstances,
          toInstances,
          removelinks,
      }
  }, */
  addInstanceToLink: function addInstanceToLink(targetLink, instance) {
    this.addToStack(instance);
    var from = targetLink.from,
        to = targetLink.to;

    var index = this._linkStack.findIndex(function (l) {
      return l === targetLink;
    });

    var _constuctor = targetLink.__proto__.constructor;
    var l1 = new _constuctor({
      from: from,
      to: instance
    });
    l1._belongs = this;
    var l2 = new _constuctor({
      from: instance,
      to: to
    });
    l2._belongs = this;

    this._linkStack.splice(index, 1, l1, l2);
  },
  // reLayout() {
  //     this.reflow();
  //     this._getBoundingGroupRect();
  //     if(this._belongs) {
  //         this._belongs.reLayout();
  //     }
  // }
  // addToTempStack(instance) {
  //     this._tempStack.push(instance);
  // },
  // truncateTempStack() {
  //     let temp;
  //     if(this._tempStack) {
  //         temp = this._tempStack.slice();
  //     }
  //     this._tempStack = new InstanceStack();
  //     return temp;
  // }

  /**
   * 循环当前栈中节点
   * @property {stackIteratorCallback} 循环访问栈中每个节点
   */
  interateNodeStack: function interateNodeStack(callback) {
    this._stack.forEach(function (instance) {
      callback(instance);
    });
  }
  /**
  * 循环访问栈中每个节点
  * @callback stackIteratorCallback
  * @param {Node} instance 栈中节点
  */

};
var _default = StackMixin;
exports["default"] = _default;
//# sourceMappingURL=stackMixin.js.map
