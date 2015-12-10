CustomProtocolCommon = class CustomProtocolCommon {

    constructor() {
        this._messages = [];
    }

    registerProtocol() {
        if (this._id === undefined) throw "Custom protocol must have an this._id specified.";
        if (this._id > 127) throw "Custom protocol must have an this._id lower than 127.";

        CustomProtocolCore.registerProtocol(this._id, this);
        this.registerMessages();
    }

    registerMessages() {
        if (this._messages.length > 0) {
            for(let [id, definition] of this._messages.entries()) {
                CustomProtocolCore.registerMessage(this._id, id, definition);
            }
        }
    }

    registerCallback(messageId, callback) {
        CustomProtocolCore.registerCallback(this._id, messageId, callback);
    }

    getMessage(messageId, ...payload) {
        let message = null;
        // Get the 16 bit header.
        message = CustomProtocolCore.getHeader(this._id, messageId);
        message += this.encode(messageId, ...payload);
        return message;
    }


};