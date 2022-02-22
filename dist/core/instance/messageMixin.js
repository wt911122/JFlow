"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * 消息 mixin 用于给Jflow传递消息
 *
 * @mixin
 */
var MessageMixin = {
  _message: null,

  /**
   * 发送消息
   * @param {Object} msg - 消息体
   */
  sendMessage: function sendMessage(msg) {
    this._message = msg;
  },

  /**
   * 接收消息
   * @return {Object} msg - 消息体
   */
  consumeMessage: function consumeMessage() {
    var msg = this._message;
    this._message = null;
    return msg;
  },
  readMessage: function readMessage() {
    return this._message;
  }
};
var _default = MessageMixin;
exports["default"] = _default;
//# sourceMappingURL=messageMixin.js.map
