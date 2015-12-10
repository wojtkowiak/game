CustomProtocol = class CustomProtocol extends CustomProtocolCommon {

    constructor() {
        super();
    }

    send(messageId, sessionId, ...payload) {
        Meteor.directStream.send(this.getMessage(messageId, ...payload), sessionId);
    }

};
