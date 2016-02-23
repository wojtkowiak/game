JsonProtocol = class JsonProtocol extends CustomProtocol {

    constructor() {
        super();
        this._id = 2;
        this.registerProtocol({ messagesDefinition: this.DYNAMIC_MESSAGES_DEFINITION });
        this.callbacks = {};
        super.on(0, this.processMessages.bind(this));
    }

    processMessages(message, sessionId) {
        console.log('messages', message);
        if (this.callbacks[message.msg]) {
            this.callbacks[message.msg].forEach(callback => callback(message, sessionId));
        }
    }

    on(message, callback) {
        if (!this.callbacks[message])
            this.callbacks[message] = [callback];
        else
            this.callbacks[message].push(callback);
    }

    send(message, data, id) {
        super.send(0, _.extend({'msg': message}, data), id);
    }

    encode(messageId, payload) {
        return JSON.stringify(payload);
    }

    decode(messageId, message) {
        return JSON.parse(message);
    }

};