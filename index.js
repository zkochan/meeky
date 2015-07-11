'use strict';

var surveyTemplate = require('./views/survey.jade');
var stepTemplate = require('./views/step.jade');

var Emitter = require('browser-emitter');

function Miki(opts) {
  opts = opts || {};

  if (!opts.steps) {
    throw new Error('opts.steps is required');
  }

  this._steps = opts.steps;

  this._emitter = new Emitter();

  this._responses = {};
}

Miki.prototype.show = function() {
  $('body').append(surveyTemplate());
  this.$$surveyBox = $('.miki');
  this.$$stepContainer = $('.miki .body');
  this.gotoStep(this._steps.startStep);

  var _this = this;
  $('.close', this.$$surveyBox).click(function() {
    _this.toggle();
  });
};

Miki.prototype.hide = function() {
  this.$$surveyBox.hide();
};

Miki.prototype.toggle = function() {
  if (this._isMinimized) {
    this.maximize();
    return;
  }
  this.minimize();
};

Miki.prototype.maximize = function() {
  var _this = this;
  this.$$surveyBox.animate({
    bottom: '0px'
  }, function() {
    _this._isMinimized = false;
    _this.$$surveyBox.removeClass('minimized');
    _this._emitter.emit('maximize');
    _this.focus();
  });
};

Miki.prototype.minimize = function() {
  var _this = this;
  this.$$surveyBox.animate({
    bottom: -(this.$$surveyBox.height() - 20) + 'px'
  }, function() {
    _this._isMinimized = true;
    _this.$$surveyBox.addClass('minimized');
    _this._emitter.emit('minimize');
  });
};

Miki.prototype.on = function(event, cb) {
  this._emitter.on(event, cb);
};

Miki.prototype.focus = function() {
  if (this._currentStep.answerType === 'text') {
    $('input', this.$$stepContainer).focus();
  } else if (this._currentStep.answerType === 'multilineText') {
    $('textarea', this.$$stepContainer).focus();
  }
};

Miki.prototype.gotoStep = function(step) {
  this.$$stepContainer.html(stepTemplate(step));

  this._currentStep = step;

  var _this = this;
  $('.miki button').click(function() {
    _this._next();
  });

  this.focus();
};

Miki.prototype._getAnswer = function() {
  switch (this._currentStep.answerType) {
    case 'singleChoice':
      return $('.miki input:checked').val();
    case 'multiChoice':
      var responses = [];
      $('.miki input:checked').each(function() {
        responses.push($(this).val());
      });
      return responses.join(',');
    case 'text':
      return $('.miki input[type=text]').val();
    case 'multilineText':
      return $('.miki textarea').val();
  }
};

Miki.prototype._sendData = function() {
  this._emitter.emit('save', this._responses);
};

Miki.prototype._next = function() {
  var answer = this._getAnswer();

  if (!answer) {
    return;
  }

  this._responses[this._currentStep.question] = answer;

  var nextStepName = this._currentStep.nextStep;
  if (this._currentStep.answerType === 'singleChoice') {
    nextStepName = $('.miki input:checked')
      .attr('data-next-step') || nextStepName;
  }

  var nextStep = this._steps[nextStepName];
  this.gotoStep(nextStep);
  if (nextStep.type === 'message') {
    /* TODO: send the data also if the user doesn't
     * answer to all the questions */
    this._sendData();
    var _this = this;
    setTimeout(function() {
      _this.hide();
    }, 5000);
  }
};

module.exports = Miki;
