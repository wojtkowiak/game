class TimeSync {
    constructor() {
        let self = this;
        Meteor.methods({
            'timeSync_syncNow': function() {
                self.syncNow(this.connection.id);
            }
        });
        this._protocol = new TimeSyncProtocol();
        this._measurements = [];
    }


    syncNow(sessionId) {

        let message = this._protocol.messageTimeSyncRequest(0);
        this._measurements[0] = { serverTimestamp: Date.now() };
        Meteor.directStream.send(message, sessionId);

        return true;
    }
}

TimeSync = new TimeSync();