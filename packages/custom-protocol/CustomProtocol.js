class CustomProtocolUtils {

    constructor() {
        var self = this;
        this._customProtocols = {};
        Meteor.directStream.registerMessageHandler(function() {
            self.messageHandler(this, ...arguments)
        });


    }

    messageHandler(directStreamHandle, message, sessionId) {
        if (message.charCodeAt(0) & 1 == 1) { console.log('standard ddp'); } else {
            let protocolId = message.charCodeAt(0) >> 1;
            let messageId = message.charCodeAt(1);
            console.log('custom protocol id ' + protocolId + ' message ' + this._customProtocols[protocolId].messages[messageId].name);
            directStreamHandle.preventMeteorHandler();
        }
    }


    registerProtocol(protocolId, protocol) {
        this._customProtocols[protocolId] = { protocol: protocol, messages: {}, messagesNameIndex: {}};
    }

    registerMessage(protocolId, id, name, handler) {
        this._customProtocols[protocolId].messages[id] = { id: id, name: name, handler: handler, callbacks: [] };
        this._customProtocols[protocolId].messagesNameIndex[name] = id;
    }

    registerCallback(protocolId, name, callback) {
        this._customProtocols[protocolId].messages[this._customProtocols[protocolId].messagesNameIndex[name]].callbacks.push(callback);
    }

    /**
     * Gets the 16 bit message header which consists of:
     * 0xxx xxx | yyyy yyyy
     * where x is the protocol id and y is the message id.
     *
     * TODO: check if message name is registered
     *
     * @param protocolId
     * @param name
     * @returns {string}
     */
    getHeader(protocolId, name) {
        return String.fromCharCode(protocolId << 1, this._customProtocols[protocolId].messages[this._customProtocols[protocolId].messagesNameIndex[name]].id);
    }

    getHandler(protocolId, name) {
        return this._customProtocols[protocolId].messages[this._customProtocols[protocolId].messagesNameIndex[name]].handler;
    }

}

CustomProtocolUtils = new CustomProtocolUtils();


CustomProtocol = class CustomProtocol {

    constructor() {
    }

    registerProtocol() {
        if (this._id === undefined) throw "Custom protocol must have an this._id specified.";
        if (this._id > 127) throw "Custom protocol must have an this._id lower than 127.";

        CustomProtocolUtils.registerProtocol(this._id, this);
        this.registerMessages();
    }

    registerMessages() {

    }

    registerCallback(name, callback) {
        CustomProtocolUtils.registerCallback(this._id, name, callback);
    }

    getMessage(name, ...payload) {
        let message = null;
        // Get the 16 bit header.
        message = CustomProtocolUtils.getHeader(this._id, name);
        message += CustomProtocolUtils.getHandler(this._id, name)(...payload);
        return message;
    }

    registerMessage(id, name, handler) {
        CustomProtocolUtils.registerMessage(this._id, id, name, handler);
    }
};
