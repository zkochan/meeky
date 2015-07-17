'use strict';

var surveyTemplate = require('./views/survey.jade');
var stepTemplate = require('./views/step.jade');

var Emitter = require('browser-emitter');

/**
 * @param {String} opts.id - Unique ID that identifies the survey.
 * @param {Boolean} [opts.showOnce=false] - Whether to show the survey only once
 *   for a user. Don't show it anymore even if he doesn't responed the first
 *   time.
 */
function Meeky(opts) {
  Emitter.call(this);

  opts = opts || {};

  if (!opts.steps) {
    throw new Error('opts.steps is required');
  }

  this._steps = opts.steps;

  this._responses = {};
}

Meeky.prototype = new Emitter();

Meeky.prototype.show = function() {
  $('body').append(surveyTemplate());
  this.$$surveyBox = $('.meeky');
  this.$$stepContainer = $('.meeky .body');
  this.gotoStep(this._steps.startStep);

  var _this = this;
  $('.close', this.$$surveyBox).click(function() {
    _this.toggle();
  });
};

Meeky.prototype.hide = function() {
  this.$$surveyBox.hide();
};

Meeky.prototype.toggle = function() {
  if (this._isMinimized) {
    this.maximize();
    return;
  }
  this.minimize();
};

Meeky.prototype.maximize = function() {
  var _this = this;
  this.$$surveyBox.animate({
    bottom: '0px'
  }, function() {
    _this._isMinimized = false;
    _this.$$surveyBox.removeClass('minimized');
    _this.emit('maximize');
    _this.focus();
  });
};

Meeky.prototype.minimize = function() {
  var _this = this;
  this.$$surveyBox.animate({
    bottom: -(this.$$surveyBox.height() - 20) + 'px'
  }, function() {
    _this._isMinimized = true;
    _this.$$surveyBox.addClass('minimized');
    _this.emit('minimize');
  });
};

Meeky.prototype.focus = function() {
  if (this._currentStep.answerType === 'text') {
    $('input', this.$$stepContainer).focus();
  } else if (this._currentStep.answerType === 'multilineText') {
    $('textarea', this.$$stepContainer).focus();
  }
};

Meeky.prototype.gotoStep = function(step) {
  this.$$stepContainer.html(stepTemplate(step));

  this._currentStep = step;

  var _this = this;
  $('.meeky button').click(function() {
    _this._next();
  });

  this.focus();
};

Meeky.prototype._getAnswer = function() {
  switch (this._currentStep.answerType) {
    case 'singleChoice':
      return $('.meeky input:checked').val();
    case 'multiChoice':
      var responses = [];
      $('.meeky input:checked').each(function() {
        responses.push($(this).val());
      });
      return responses.join(',');
    case 'text':
      return $('.meeky input[type=text]').val();
    case 'multilineText':
      return $('.meeky textarea').val();
  }
};

Meeky.prototype._sendData = function() {
  this.emit('save', this._responses);
};

Meeky.prototype._next = function() {
  var answer = this._getAnswer();

  if (!answer) {
    return;
  }

  this._responses[this._currentStep.question] = answer;

  var nextStepName = this._currentStep.nextStep;
  if (this._currentStep.answerType === 'singleChoice') {
    nextStepName = $('.meeky input:checked')
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

module.exports = Meeky;
