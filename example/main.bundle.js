'use strict';

var Meeky = require('../');

var meeky = new Meeky({
  id: 'example',
  steps: require('./steps')
});

meeky.on('save', function(answers) {
  $.ajax({
     url: 'https://script.google.com/macros/s/AKfycbwK0fpzj5JJrBIVUZ_nsp1JCMNntPO0eONMKOe2ekpYmO6vFxBx/exec',
     type: 'post',
     data: answers
 });
});

meeky.show();

window.meeky = meeky;
