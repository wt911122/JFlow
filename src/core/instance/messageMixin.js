/**
 * 消息 mixin 用于给Jflow传递消息
 *
 * @mixin
 */
const MessageMixin = {
    _message: null,
    /**
     * 发送消息
     * @param {Object} msg - 消息体
     */
    sendMessage(msg) {
        this._message = msg;
    },
    /**
     * 接收消息
     * @return {Object} msg - 消息体
     */
    consumeMessage() {
        const msg = this._message;
        this._message = null;
        return msg;
    },
    readMessage() {
        return this._message;
    }
}

export default MessageMixin;