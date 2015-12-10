class CustomProtocolCoreClass {

    constructor() {
        var self = this;
        this._customProtocols = {};


        // Register handler for hooking up to the Meteor server. All incoming socket messages will now go through this class first.
        Meteor.directStream.registerMessageHandler(function messageHandler() {
            self._messageHandler(this, ...arguments)
        });
    }

    /**
     *
     * TODO: check for unknown protocol or message
     *
     * @param directStreamHandle
     * @param message
     * @param sessionId
     */
    _messageHandler(directStreamHandle, message, sessionId) {
        if (message.charCodeAt(0) & 1 == 1) { console.log('standard ddp'); } else {
            let protocolId = message.charCodeAt(0) >> 1;
            let messageId = message.charCodeAt(1);
            console.log('custom protocol id ' + protocolId + ' message ' + messageId);
            this._fireMessageCallbacks(protocolId, messageId, sessionId, message.substr(2));
            directStreamHandle.preventCallingMeteorHandler();
        }
    }


    /**
     * TODO: do not decode messages with no fields
     *
     * @param protocolId
     * @param messageId
     * @param sessionId
     * @param rawMessage
     * @private
     */
    _fireMessageCallbacks(protocolId, messageId, sessionId, rawMessage) {
        let callbacks = this._customProtocols[protocolId].messages[messageId].callbacks;
        if (!callbacks.length) return;
        let message = this._customProtocols[protocolId].protocol.decode(messageId, rawMessage);
        if (sessionId !== undefined) {
            for (let callback of callbacks) {
                callback(sessionId, message);
            }
        } else {
            for (let callback of callbacks) {
                callback(message);
            }
        }
    }

    /**
     * Registers a custom protocol. Just stores the protocol id and reference to the class in an array.
     *
     * @param {number} protocolId - Unique number representing the procotol.
     * @param {CustomProtocol} protocol - Instance of a class extending the CustomProtocol.
     * @throws {CustomProtocolError} Will throw an error when protocolId was already used or when the class instance is not a CustomProtocol instance.
     */
    registerProtocol(protocolId, protocol) {
        if (!(protocol instanceof CustomProtocol)) throw new CustomProtocolError(0, protocolId);
        if (this._customProtocols[protocolId]) throw new CustomProtocolError(1, protocolId);

        this._customProtocols[protocolId] = { protocol: protocol, messages: {}};
    }

    /**
     * Registers a message type for a specified protocol.
     *
     * @param {number} protocolId
     * @param {number} messageId
     * @param definition
     */
    registerMessage(protocolId, messageId, definition) {
        this._customProtocols[protocolId].messages[messageId] = { id: messageId, definition: definition, callbacks: [] };
    }

    registerCallback(protocolId, messageId, callback) {
        this._customProtocols[protocolId].messages[messageId].callbacks.push(callback);
    }

    /**
     * Gets the 16 bit message header which consists of:
     * 0xxx xxx | yyyy yyyy
     * where x is the protocol id and y is the message id.
     *
     * TODO: check if message name is registered
     *
     * @param protocolId
     * @param messageId
     * @returns {string}
     */
    getHeader(protocolId, messageId) {
        return String.fromCharCode(protocolId << 1, this._customProtocols[protocolId].messages[messageId].id);
    }

    getHandler(protocolId, messageId) {
        return this._customProtocols[protocolId].messages[messageId].handler;
    }

}

CustomProtocolCore = new CustomProtocolCoreClass();