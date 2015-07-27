'use strict';
var Client = require('frpc/lib/client');

module.exports = function(commOpts) {
  var client = new Client(commOpts);
  client.register(['setHeight', 'animate']);
  return client.methods;
};
