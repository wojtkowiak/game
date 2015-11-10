Package.describe({
  name: 'omega:direct-stream-access',
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
  api.use('ddp-common', ['client', 'server']);
  api.addFiles(['lib/common/DirectStreamAccess.js']);
  api.addFiles(['lib/DirectStreamAccess.client.js'] ,'client');
  api.addFiles(['lib/DirectStreamAccess.server.js'] ,'server');
  api.addFiles('startup.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('omega:direct-stream-access');
});
