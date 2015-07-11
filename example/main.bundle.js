'use strict';

var Miki = require('../');

var miki = new Miki({
  steps: require('./steps')
});

miki.on('save', function(answers) {
  $.ajax({
     url: 'https://script.google.com/macros/s/AKfycbwK0fpzj5JJrBIVUZ_nsp1JCMNntPO0eONMKOe2ekpYmO6vFxBx/exec',
     type: 'post',
     data: answers
 });
});

miki.show();
