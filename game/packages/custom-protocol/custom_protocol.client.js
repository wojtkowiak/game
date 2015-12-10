CustomProtocol = class CustomProtocol extends CustomProtocolCommon {

    constructor() {
        super();
    }

    send(messageId, ...payload) {
        Meteor.directStream.send(this.getMessage(messageId, ...payload));
    }

};
