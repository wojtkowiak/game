CustomProtocolError = class CustomProtocolError {
    constructor(id, ...params) {

        this._messages = [
            `Not a CustomProtocol instance. (protocol id ${params[0]})`,
            `A custom protocol with this id is already registered. (protocol id ${params[0]})`
        ];
        this.name = "CustomProtocolError";
        this.message = this._messages[id];
        this.id = id;
    }
};
