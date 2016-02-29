
Meteor.startup(() => {
    transferRateMonitor.subscribeForServerTransferRate();
    Tracker.autorun(() => {
        console.log('poszedl autorun');

       /* if (Meteor.sessionManager.token.get()) {

        }*/
    })

});