DirectStreamAccessCommon = class DirectStreamAccessCommon {

    constructor() {
        this._registeredInStreamServer = false;
        this._messageHandlers = [];
        this._preventMeteor = false;
        this._stopProcessing = false;
    }


    _processMessage(message, sessionId) {
        this._preventMeteor = false;
        for(let callback of this._messageHandlers) {
            callback(message, sessionId);
            if (this._stopProcessing) break;
        }

    }

    preventMeteorHandler() {
        this._preventMeteor = true;
    }

    stopProcessing() {
        this._stopProcessing = true;
    }

    /**
     * Registers a callback which will be called to process every message on the socket.
     *
     * @param callback
     */
    registerMessageHandler(callback) {
        this._messageHandlers.push(callback.bind(this));
    }

};

