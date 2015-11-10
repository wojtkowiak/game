Meteor.startup(() => {
    setInterval(function() {
        Meteor.directStream.send('shit');
    }, 2000);
})