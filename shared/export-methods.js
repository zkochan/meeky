'use strict';

module.exports = function(opts) {
  opts = opts || {};

  function createPublic(methodName) {
    return function() {
      return opts.source[methodName].apply(opts.source, arguments);
    };
  }
  for (var i = 0, len = opts.methods.length; i < len; i++) {
    opts.target[opts.methods[i]] = createPublic(opts.methods[i]);
  }
};
