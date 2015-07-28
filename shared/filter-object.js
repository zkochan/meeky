'use strict';
var bind = require('bind-ponyfill');

module.exports = function(obj, keys) {
  var result = {};
  for (var i = keys.length; i--;) {
    result[keys[i]] = bind(obj[keys[i]], obj);
  }
  return result;
};
