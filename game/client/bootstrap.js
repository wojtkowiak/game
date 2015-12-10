Meteor.startup(() => {

    /*Meteor.directStream.registerMessageHandler(function(message) {
        console.log('callback: ' + message);
        //this.preventCallingMeteorHandler();

    });*/



    Tracker.autorun(() => {
        if (Meteor.sessionManager.token.get()) {

        }
    })


});