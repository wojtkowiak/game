Package.describe({
    name: 'omega:custom-protocol',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use('ecmascript');
    api.use('underscore');
    api.use('omega:direct-stream-access');
    api.addFiles([
        'lib/error.js',
        'lib/core.js',
        'lib/common.js'
    ]);
    api.addFiles('custom_protocol.client.js', 'client');
    api.addFiles('custom_protocol.server.js', 'server');
    api.addFiles('JsonProtocol.js');
    api.export('CustomProtocolCore');
    api.export('CustomProtocol');
    api.export('JsonProtocol');

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('omega:custom-protocol');
});
