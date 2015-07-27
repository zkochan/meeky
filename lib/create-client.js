'use strict';
var publicMethods = require('../shared/public-methods');
var Client = require('frpc/lib/client');

module.exports = function(iframeWindow) {
  var client = new Client({
    targets: [{
      window: iframeWindow
    }]
  });
  client.register(['create'].concat(publicMethods));
  return client.methods;
};
