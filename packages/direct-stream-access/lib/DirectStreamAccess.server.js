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
    _isInstalled() {
        return this._registeredInStreamServer;
    }

    /**
     * Installs the hook for capturing incoming data. On the server we are wrapping the default callback for `data`
     * event on every socket.
     */
    install() {
        let self = this;

        if (this._isInstalled()) {

            Meteor.server.stream_server.register(function (socket) {

                let wrappedCallback = socket._events['data'].bind(socket);

                socket._events['data'] = (message) => {

                    console.log('direct' + message);

                    self._processMessage(message, (socket._meteorSession) ? socket._meteorSession.id : null);

                    if (self._preventMeteor) {
                    } else {
                        wrappedCallback(message);
                    }

                }

            });
            this._registeredInStreamServer = true;
        }
    }

    /**
     * Wrapper for invoking `send` on a specified Meteor session.
     *
     * TODO: handle sending to invalid session
     *
     * @param message
     * @param sessionId
     */
    send(message, sessionId) {
        if (Meteor.server.sessions[sessionId])
            Meteor.server.sessions[sessionId].socket.send(message);
    }

    /**
     * Broadcasts the message to all connected clients.
     *
     * @param {string} message
     */
    broadcast(message) {
        _.each(Meteor.server.sessions, function(session) {
            session.socket.send(message);
        });
    }

};