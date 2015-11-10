TimeSyncProtocol = class TimeSyncProtocol extends CustomProtocol {

    constructor() {
        super();
        this._id = 1;
        this.registerProtocol();
    }

    registerMessages() {
        this.registerMessage(1, 'timeSyncRequest', this.messageTimeSyncRequest);
        this.registerMessage(2, 'timeSyncResponse', this.messageTimeSyncResponse);
    }


    messageTimeSyncRequest(syncId) {
        return JSON.stringify({ syncId: syncId });
    }

    messageTimeSyncResponse(syncId, timestamp) {
        return JSON.stringify({ syncId: syncId, timestamp: timestamp });
    }

};