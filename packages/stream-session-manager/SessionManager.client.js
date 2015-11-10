class SessionManager {

    constructor() {
        this.token = new ReactiveVar();

        Tracker.autorun(() => {

            if (Meteor.status().connected && Meteor.status().status === "connected") {

                Meteor.call('sessionManager_getNewConnectionToken', (error, token) => {
                    console.log('TOKEN ' + token);
                    this.token.set(token);
                });

            }

        });
    }


}

Meteor.sessionManager = new SessionManager();