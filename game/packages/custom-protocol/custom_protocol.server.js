CustomProtocol = class CustomProtocol extends CustomProtocolCommon {

    constructor() {
        super();
    }

    send(messageId, payload, sessionId) {
        Meteor.directStream.send(this.getMessage(messageId, payload), sessionId);
    }

};
