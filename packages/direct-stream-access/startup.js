Meteor.directStream = new DirectStreamAccess();

Meteor.startup(() => {
    Meteor._printReceivedDDP = true;
    Meteor.directStream.install();
});
