DirectStreamAccess = class DirectStreamAccess extends DirectStreamAccessCommon {

    constructor() {
        super();
    }

    /**
     * Returns true if hook for catching incoming data is installed.
     *
     * @returns {boolean}
     * @private
     */
    static _isInstalled() {
        return (DDPCommon._parseDDP) ? true : false;
    }


    /**
     * Installs the hook for capturing incoming data. On the client we are just wrapping the parseDDP function.
     */
    install() {
        let self = this;
        if (!DirectStreamAccess._isInstalled()) {

            DDPCommon._parseDDP = DDPCommon.parseDDP;

            DDPCommon.parseDDP = function parseDDP(message) {
                console.log('ddp: ' + message);

                self._processMessage(message);

                if (self._preventMeteor) {
                    // We do not want Meteor to complain about invalid JSON or DDP so we are faking a `pong` message.
                    return { msg: 'pong' };
                } else {
                    return DDPCommon._parseDDP(message);
                }
            }
        }
    }


    /**
     * Wrapper for invoking `send` directly from SockJS stream object.
     *
     * TODO: check what happens if called when disconnected
     *
     * @param {string} message - A message to send to the server.
     */
    send(message) {
        Meteor.connection._stream.send(message);
    }

};