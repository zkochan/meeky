'use strict';
var publicMethods = require('../shared/public-methods');
var Client = require('frpc/lib/client');

module.exports = function(opts) {
  var client = new Client(opts);
  client.register(['create'].concat(publicMethods));
  return client.methods;
};
