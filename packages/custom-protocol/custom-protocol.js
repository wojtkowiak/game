class CustomProtocolUtils {

    constructor() {
        this._customProtocols = {};

    }

    registerProtocol(id, protocol) {
        this._customProtocols[id] = { protocol: protocol, messages: {} };
    }

    registerMessage(protocolId, id, name, handler) {
        this._customProtocols[protocolId].messages[id] = { name: name, handler: handler };
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


    registerMessage(id, name, handler) {
        CustomProtocolUtils.registerMessage(this._id, id, name, handler);
    }
};
