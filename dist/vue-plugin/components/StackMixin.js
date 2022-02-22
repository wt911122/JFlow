"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  provide: function provide() {
    return {
      addToStack: this.addToStack,
      addToLinkStack: this.addToLinkStack,
      removeFromStack: this.removeFromStack,
      removeFromLinkStack: this.removeFromLinkStack,
      getInstanceByJFlowId: this.getInstanceByJFlowId
    };
  },
  data: function data() {
    return {
      stack: [] // 主要是为了连线

    };
  },
  methods: {
    getInstanceByJFlowId: function getInstanceByJFlowId(jflowId) {
      var obj = this.stack.find(function (i) {
        return i.jflowId === jflowId;
      });

      if (obj) {
        return obj.instance;
      }

      return null;
    },
    addToStack: function addToStack(instance, jflowId) {
      this._jflowInstance.addToStack(instance);

      if (!jflowId) return;
      this.stack.push({
        jflowId: jflowId,
        instance: instance
      }); // this.$nextTick(this.onStackChangeHandler)
    },
    addToLinkStack: function addToLinkStack(link) {
      this._jflowInstance.addToLinkStack(link); // this.$nextTick(this.onStackChangeHandler)

    },
    removeFromStack: function removeFromStack(instance) {
      this._jflowInstance.removeFromStack(instance); // this.$nextTick(this.onStackChangeHandler)

    },
    removeFromLinkStack: function removeFromLinkStack(link) {
      this._jflowInstance.removeFromLinkStack(link); // this.$nextTick(this.onStackChangeHandler)

    },
    onStackChangeHandler: function onStackChangeHandler() {
      this._jflowInstance.recalculate();

      this._jflowInstance.reflow(); // this.$nextTick(this.renderJFlow)

    }
  }
};
exports["default"] = _default;
//# sourceMappingURL=StackMixin.js.map
