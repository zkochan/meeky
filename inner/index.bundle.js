'use strict';

var Meeky = require('./meeky');
var Server = require('frpc/lib/server');

var server = new Server({
  targets: [{
    window: window.parent
  }]
});
var meeky;

server.addMethods({
  create: function(steps) {
    meeky = new Meeky({
      steps: steps
    });
    meeky.create();
  },
  maximize: function() {
    meeky.maximize();
  },
  minimize: function() {
    meeky.minimize();
  },
  toggle: function() {
    meeky.toggle();
  },
  focus: function() {
    meeky.focus();
  }
});

server.start();
