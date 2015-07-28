'use strict';
var Meeky = require('./meeky');
var Server = require('frpc/lib/server');
var publicMethods = require('../../shared/public-methods');
var fetchFunctions = require('fetch-functions');

module.exports = function(commOpts) {
  var server = new Server(commOpts);

  server.addMethod('create', function(steps) {
    var meeky = new Meeky({
      commOpts: commOpts,
      steps: steps
    });
    server.addMethods(fetchFunctions(meeky, publicMethods));
  });
};
