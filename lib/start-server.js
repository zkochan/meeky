'use strict';
var Server = require('frpc/lib/server');

module.exports = function(iframeWindow, opts) {
  opts = opts || {};

  var server = new Server({
    targets: [{
      window: iframeWindow
    }]
  });
  server.addMethods({
    setHeight: function(height) {
      opts.iframe.style.height = height + 'px';
    },
    animate: function(bottom, cb) {
      opts.$iframe.animate({
        bottom: bottom + 'px',
        duration: 'fast',
        queue: false
      }, cb);
    }
  });
  server.start();
};
