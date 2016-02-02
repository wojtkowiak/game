class TimeSyncCore {

    constructor() {
        this._protocol = new TimeSyncProtocol();

        this._protocol.on(this._protocol.TIME_SYNC_REQUEST, this._respondToSyncRequest.bind(this));
        this._protocol.on(this._protocol.TIME_SYNC_OFFSET, this._processTimeOffset.bind(this));
    }

    _processTimeOffset(message) {
        console.log('new timeoffset ' + message.timeOffset);

        // TODO: send confirmation.
    }

    _respondToSyncRequest(message) {
        this._protocol.send(this._protocol.TIME_SYNC_RESPONSE, message.syncId, Date.now());
    }

    syncNow() {
        this._protocol.send(this._protocol.TIME_SYNC_SYNC_NOW);
    }


}

TimeSync = new TimeSyncCore();