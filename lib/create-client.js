'use strict';
var Client = require('frpc/lib/client');

module.exports = function(iframeWindow) {
  var client = new Client({
    targets: [{
      window: iframeWindow
    }]
  });
  client.register(['create', 'maximize', 'minimize', 'toggle', 'focus']);
  return client.methods;
};
