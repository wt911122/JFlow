const MessageMixin = {
    _message: null,
    sendMessage(msg) {
        this._message = msg;
    },

    consumeMessage() {
        const msg = this._message;
        this._message = null;
        return msg;
    },
}

export default MessageMixin;