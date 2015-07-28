'use strict';
require('jade-polyfill');
var startServer = require('./lib/start-server');

startServer({
  targets: [{
    window: window.parent
  }]
});
