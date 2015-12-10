Package.describe({
  name: 'omega:time-sync',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('ecmascript');
  api.use('omega:custom-protocol');
  api.use('omega:direct-stream-access');
  api.addFiles('TimeSyncProtocol.js');
  api.addFiles('TimeSync.client.js', 'client');
  api.addFiles('TimeSync.server.js', 'server');
  api.export('TimeSync');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');

  api.use('omega:time-sync');
  //api.addFiles('time-sync-tests.js');
});
