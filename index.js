'use strict';

var Client = require('frpc/lib/client');
var Server = require('frpc/lib/server');
require('./styles/index.less');
var iframeTemplate = require('./views/iframe.html');

var Emitter = require('cross-emitter');

/**
 * @param {String} opts.id - Unique ID that identifies the survey.
 * @param {Boolean} [opts.showOnce=false] - Whether to show the survey only once
 *   for a user. Don't show it anymore even if he doesn't responed the first
 *   time.
 */
function Meeky(opts) {
  opts = opts || {};

  if (!opts.steps) {
    throw new Error('opts.steps is required');
  }

  this._steps = opts.steps;



  var iframe = document.createElement('iframe');
  iframe.className = 'meeky-survey';
  iframe.name = 'meekySurvey';
  iframe.style.display = 'none';
  iframe.frameBorder = 0;
  iframe.tabIndex = 0;
  iframe.width = '100%';
  iframe.scrolling = 'no';
  iframe.marginHeight = 0;
  iframe.marginWidth = 0;
  iframe.setAttribute('hspace', 0);
  iframe.setAttribute('vspace', 0);
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  iframe.contentWindow.document.write(iframeTemplate);
  this._iframe = iframe;
  this.$$iframe = $(iframe);

  this._server = new Server({
    targets: [{
      window: iframe.contentWindow
    }]
  });
  var isAnimating;
  var _this = this;
  this._server.addMethods({
    setHeight: function(height) {
      /*if (isAnimating || !_this.isMaximized()) {
        return;
      }*/
      _this._iframe.style.height = height + 'px';
    },
    animate: function(bottom, cb) {
      isAnimating = true;
      _this.$$iframe.animate({
        bottom: bottom + 'px',
        duration: 'fast',
        queue: false
      }, function() {
        isAnimating = false;
        cb();
        /* Just in case the size changed while the
         * frame was being animated */
        //_this._postMessage('triggerResize');
      });
    }
  });
  this._server.start();

  this._client = new Client({
    targets: [{
      window: iframe.contentWindow
    }]
  });
  this._client.register(['create', 'maximize', 'minimize', 'toggle', 'focus']);
  this._client.methods.create(this._steps);


  Emitter.call(this, {
    targets: [{
      window: iframe.contentWindow
    }]
  });

  this._responses = {};


  var publicMethods = ['minimize', 'maximize', 'toggle', 'focus'];
  var _this = this;
  function createPublic(methodName) {
    return function() {
      _this._client.methods[methodName]
        .apply(_this._client.methods, arguments);
    };
  }
  for (var i = 0, len = publicMethods.length; i < len; i++) {
    this[publicMethods[i]] = createPublic(publicMethods[i]);
  }
}

Meeky.prototype = Emitter.prototype;

Meeky.prototype.show = function() {
  this.$$iframe.show();
};

Meeky.prototype.hide = function() {
  this.$$iframe.hide();
};

module.exports = Meeky;
