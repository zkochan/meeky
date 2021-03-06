'use strict';

var bind = require('bind-ponyfill');
var createClient = require('./create-client');
require('../styles/index.less');
var surveyTemplate = require('../views/survey.jade');
var stepTemplate = require('../views/step.jade');

var Emitter = require('cross-emitter');

/**
 * @param {String} opts.id - Unique ID that identifies the survey.
 * @param {Boolean} [opts.showOnce=false] - Whether to show the survey only once
 *   for a user. Don't show it anymore even if he doesn't responed the first
 *   time.
 */
function Meeky(opts) {
  Emitter.call(this, opts.commOpts);

  opts = opts || {};

  if (!opts.steps) {
    throw new Error('opts.steps is required');
  }

  this._steps = opts.steps;

  this._responses = {};

  this._client = createClient(opts.commOpts);

  this.$$surveyBox = $('body');

  this.$$surveyBox.append(surveyTemplate());

  this.$$stepContainer = $('.body');
  this.gotoStep(this._steps.startStep);

  $('.close', this.$$surveyBox).click(bind(function() {
    this.toggle();
  }, this));
}

Meeky.prototype = Emitter.prototype;

Meeky.prototype._resize = function() {
  this._client.setHeight($('html').height());
};

Meeky.prototype.toggle = function() {
  if (this._isMinimized) {
    this.maximize();
    return;
  }
  this.minimize();
};

Meeky.prototype.maximize = function() {
  this._client.animate(0, bind(function() {
    this._isMinimized = false;
    this.$$surveyBox.removeClass('minimized');
    this.emit('maximize');
    this.focus();
    this._resize();
  }, this));
};

Meeky.prototype.minimize = function() {
  this._client.animate(-(this.$$surveyBox.height() - 20), bind(function() {
    this._isMinimized = true;
    this.$$surveyBox.addClass('minimized');
    this.emit('minimize');
    this._resize();
  }, this));
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
  this._resize();

  this._currentStep = step;

  $('button').click(bind(function() {
    this._next();
  }, this));

  this.focus();
};

Meeky.prototype._getAnswer = function() {
  switch (this._currentStep.answerType) {
    case 'singleChoice':
      return $('input:checked').val();
    case 'multiChoice':
      var responses = [];
      $('input:checked').each(function() {
        responses.push($(this).val());
      });
      return responses.join(',');
    case 'text':
      return $('input[type=text]').val();
    case 'multilineText':
      return $('textarea').val();
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
    nextStepName = $('input:checked')
      .attr('data-next-step') || nextStepName;
  }

  var nextStep = this._steps[nextStepName];
  this.gotoStep(nextStep);
  if (nextStep.type === 'message') {
    /* TODO: send the data also if the user doesn't
     * answer to all the questions */
    this._sendData();
    setTimeout(bind(function() {
      this._client.hide();
    }, this), 5000);
  }
};

module.exports = Meeky;
