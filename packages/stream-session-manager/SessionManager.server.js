class SessionManager {

    constructor() {

        var self = this;


        /*Meteor.server.streamHook.processMessageCallback =
         Meteor.bindEnvironment(
         function (id, rawMsg) {
         self.handleMessage(id, rawMsg);
         }.bind(this)
         );*/

        // define some methods
        Meteor.methods({
            sessionManager_getNewConnectionToken: function () {
                return self.getNewConnectionTokenMethod(this.connection.id);
            }
        });

        _.extend(self, {
            debug: false,
            clients: {},
            messageHooks: {},
            sessionIdToTokens: {},
            callbacks: {}
        });

        // we hook to Meteor's connection callback to hook on connection close
        this.meteorConnectionCallback = Meteor.onConnection(this.onConnect.bind(this));
    }


    onConnect(connection) {
        // Lets hook to the `close` event.
        connection.onClose(() => { this.onClose(connection); });
    }

    onClose(connection) {

        if (this.sessionIdToTokens[connection.id]) {
            let token = this.sessionIdToTokens[connection.id];
            console.log('DISCONNECT: ' + token);
            //this.clients[token].timeSyncer.cleanup();
            delete this.clients[token];
        }
    }

    getNewConnectionTokenMethod(sessionId) {
        let token, self = this, add = 0;

        if (this.sessionIdToTokens[sessionId]) {
            return this.sessionIdToTokens[sessionId];
        }

        do {
            token = _.keys(self.clients).length + add;
            add++;
        } while (this.clients[token]);

        this.clients[token] = {
            id: sessionId,
            //latencyCheckerInterval: Meteor.setInterval(function () { self.checkLatency(sessionId); }, 1000),
            //timeSyncer: new TimeSyncer({connector: this, token: token}),
            //initalSyncFinished: false

        };

        // Map Meteor's sessionId to a user token.
        this.sessionIdToTokens[sessionId] = token;
        console.log('Session ' + sessionId + ' TOKEN: ' + token);

        // register hooks from TimeSyncer
        //this.hookOnMessages(token, this.clients[token].timeSyncer.registerMessages(), this.clients[token].timeSyncer.processMessage.bind(this.clients[token].timeSyncer));
        // start the time sync immediately
        //this.clients[token].timeSyncer.startSync();

        //this.callbacks.onNewClientCallback(token);

        return token;
    }/*
    broadcast: function(message) {
        Meteor.server.streamHook.broadcast(message.toString());
    },
    send: function(token, message) {
        Meteor.server.streamHook.send(this.clients[token].id, message.toString());
    }*/
}

Meteor.sessionManager = new SessionManager();