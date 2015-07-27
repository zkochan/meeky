'use strict';
var startServer = require('./lib/start-server');

startServer({
  targets: [{
    window: window.parent
  }]
});
