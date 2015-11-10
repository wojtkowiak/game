Meteor.startup(() => {

    /*Meteor.directStream.registerMessageHandler(function(message) {
        console.log('callback: ' + message);
        //this.preventMeteorHandler();

    });*/

    timeSync.syncNow();

    Tracker.autorun(() => {
        if (Meteor.sessionManager.token.get()) {

        }
    })


});