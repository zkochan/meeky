'use strict';

module.exports = function(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
};
