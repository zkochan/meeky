'use strict';
var bind = require('bind-ponyfill');

module.exports = function(target, source) {
  for (var key in source) {
    if (typeof source[key] === 'function') {
      target[key] = bind(source[key], source);
    }
  }
};
