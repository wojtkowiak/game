Template.body.helpers({
    transfer: () => {
        return transferRateMonitor.getTransferRate();
    }
})

Meteor.startup(() => {

    /*Meteor.directStream.onMessage(function(message) {
        console.log('callback: ' + message);
        //this.preventCallingMeteorHandler();

    });*/



    Tracker.autorun(() => {
       /* if (Meteor.sessionManager.token.get()) {

        }*/
    })


});