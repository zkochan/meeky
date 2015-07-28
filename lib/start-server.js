'use strict';
var Server = require('frpc/lib/server');

module.exports = function(commOpts, opts) {
  opts = opts || {};

  var server = new Server(commOpts);
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
    },
    hide: opts.hide
  });
};
