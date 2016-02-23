CustomProtocolCommon = class CustomProtocolCommon {

    constructor() {
        this._messages = [];
        this.STATIC_MESSAGES_DEFINITION = 1;
        this.DYNAMIC_MESSAGES_DEFINITION = 2;
        this._options = {
            messagesDefinition: this.STATIC_MESSAGES_DEFINITION
        };
    }

    registerProtocol(options) {
        if (this._id === undefined) throw "Custom protocol must have an this._id specified.";
        if (this._id > 127) throw "Custom protocol must have an this._id lower than 127.";

        _.extend(this._options, options || {});
        CustomProtocolCore.registerProtocol(this._id, this._options, this);
        this.registerMessages();
        if (options && options.messagesDefinition === this.DYNAMIC_MESSAGES_DEFINITION) {
            this.registerMessage(0);
        }
    }

    registerMessages() {
        if (this._messages.length > 0) {
            for(let [id, definition] of this._messages.entries()) {
                CustomProtocolCore.registerMessage(this._id, id, definition);
            }
        }
    }

    registerMessage(id, definition) {
        CustomProtocolCore.registerMessage(this._id, id, definition);
    }

    on(messageId, callback) {
        CustomProtocolCore.registerCallback(this._id, messageId, callback);
    }

    getMessage(messageId, payload) {
        if (!Array.isArray(payload)) payload = [ payload ];
        let message = null;
        // Get the 16 bit header.
        message = CustomProtocolCore.getHeader(this._id, messageId);
        message += this.encode(messageId, ...payload);
        return message;
    }


};