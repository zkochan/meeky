'use strict';
var Meeky = require('./meeky');
var Server = require('frpc/lib/server');
var exportMethods = require('../../shared/export-methods');
var publicMethods = require('../../shared/public-methods');

module.exports = function(targetWindow) {
  var server = new Server({
    targets: [{
      window: targetWindow
    }]
  });

  server.addMethod('create', function(steps) {
    var methods = {};
    exportMethods({
      target: methods,
      source: new Meeky({
        steps: steps
      }),
      methods: publicMethods
    });
    server.addMethods(methods);
  });
};
