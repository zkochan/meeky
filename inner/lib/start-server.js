'use strict';
var Meeky = require('./meeky');
var Server = require('frpc/lib/server');
var exportMethods = require('../../shared/export-methods');

module.exports = function(targetWindow) {
  var meeky;
  var server = new Server({
    targets: [{
      window: targetWindow
    }]
  });

  var methods = {};
  methods.create = function(steps) {
    meeky = new Meeky({
      steps: steps
    });
    meeky.create();
  };

  exportMethods({
    target: methods,
    source: meeky,
    methods: ['maximize', 'minimize', 'toggle', 'focus']
  });
  server.addMethods(methods);
  server.start();
};
