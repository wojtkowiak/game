class TimeSync {

    constructor() {
        Meteor.directStream.registerMessageHandler(function(message) {
            console.log(message);
            if (JSON.parse(message).syncId !== undefined) {
                console.log('prevent');
                this.preventMeteorHandler();
            }
        });
    }

    syncNow() {
        console.log('call timesync now');
        Meteor.call('timeSync_syncNow', function() {

        });

    }
}

timeSync = new TimeSync();