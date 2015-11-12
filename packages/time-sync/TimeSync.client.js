class TimeSync {

    constructor() {
        this._protocol = new TimeSyncProtocol();
        this._protocol.registerCallback('timeSyncRequest', this.respondToSyncRequest);
    }

    respondToSyncRequest(message) {
        console.log(message);
    }

    syncNow() {
        console.log('call timesync now');
        Meteor.call('timeSync_syncNow', function() {

        });

    }
}

timeSync = new TimeSync();