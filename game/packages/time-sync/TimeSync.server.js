class TimeSyncCore {

    constructor() {
        let self = this;

        console.log('wow');
        console.log(CustomProtocolCore);

        this._protocol = new TimeSyncProtocol();
        this._protocol.on(this._protocol.TIME_SYNC_SYNC_NOW, this._syncNow.bind(this));
        this._protocol.on(this._protocol.TIME_SYNC_RESPONSE, Meteor.bindEnvironment(this._processSyncResponse.bind(this)));

        this._measurements = [];
        this._options = {};
        this._offsets = [];
        this._packetCount = 0;
        this._state = 0;
        this._sentOffsets = [];
        this._defaults = {
            mode: 'manual',
            maxSampleCount: 20,
            timeDelayBetweenRequests: 10
        };
    }

    configure(options) {
        this._options = this._defaults;
        if (options) {
            _.extend(this._options, options);
        }
        console.log(this._options);
    }

    _syncNow(sessionId) {

        console.log('[SYNC] Starting sync for ' + sessionId);
        this._packetCount = 0;
        this._state = 1;
        this._packetCount = 0;
        this._measurements = [];
        this._offsets = [];

        this._sendRequest(0, sessionId);
        return true;
    }

    _sendRequest(syncId, sessionId) {
        this._measurements[syncId] = { serverTimestamp: Date.now() };
        this._protocol.send(this._protocol.TIME_SYNC_REQUEST, syncId, sessionId);
    }

    _processSyncResponse(sessionId, message) {
        console.log('client timestamp' + message.timestamp + ' max ' + this._options.maxSampleCount);
        var self = this;
        var ping = Date.now() - this._measurements[message.syncId].serverTimestamp;
        this._measurements[message.syncId].ping = ping;

        var offset = Date.now() - (message.timestamp + (ping / 2));
        this._measurements[message.syncId].offset = offset;
        this._offsets.push(offset);
        if (this._packetCount < this._options.maxSampleCount) {
            this._packetCount++;
            Meteor.setTimeout(() => { this._sendRequest(this._packetCount, sessionId); }, this._options.timeDelayBetweenRequests);
        } else {
            this._computeOffset(sessionId);
        }
    }

    _computeOffset(sessionId) {
        // Sort offsets from the lowest to highest.
        this._offsets.sort();

        // Get the median offset.
        let median = this._offsets[Math.round(this._offsets.length / 2)];

        // Compute standard deviation.
        let standardDeviation = this._standardDeviation(this._offsets);

        // Remove all offsets that are higher than the median + standard deviation.
        // Just to filter out for example TCP packets retransmissions.
        this._offsets = this._offsets.filter((offset) => { return !(offset > median + standardDeviation); });

        // We get back to idle state.
        this._state = 0;
        console.log(sessionId + ': mean ' + this._average(this._offsets));

        //TODO: check the quality of measurement, after lets say 3 measurements discard it if the standard deviation is higher than the average by more than 50%.

        // Send the offset to client

        Meteor.defer(() => { this._protocol.send(this._protocol.TIME_SYNC_OFFSET, this._average(this._offsets), sessionId); });

        // Store sent offsets so we can later for example check for big offsets change (time on the client will shift).
        // Big changes of the time on the client might be catastrophic.
        this._sentOffsets.push({ offset: this._average(this._offsets), standardDeviation: standardDeviation });
        if (this._sentOffsets.length > 10) this._sentOffsets.shift();
    }

    /**
     * http://derickbailey.com/
     *
     * @param values
     * @returns {number}
     * @private
     */
    _standardDeviation(values) {
        let avg = this._average(values);
        return Math.sqrt(
            this._average(
                values.map(
                    (value) => {
                        let diff = value - avg;
                        return diff * diff;
                    }
                )
            )
        );
    }

    /**
     * http://derickbailey.com/
     *
     * @param values
     * @returns {number}
     * @private
     */
    _average(values) {
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }
}

TimeSync = new TimeSyncCore();