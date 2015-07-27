'use strict';
var Client = require('frpc/lib/client');

module.exports = function(targetWindow) {
  var client = new Client({
    targets: [{
      window: targetWindow
    }]
  });
  client.register(['setHeight', 'animate']);
  return client.methods;
};
