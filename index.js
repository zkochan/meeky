'use strict';

var createClient = require('./lib/create-client');
var startServer = require('./lib/start-server');
require('./styles/index.less');
var iframeTemplate = require('./views/iframe.html');
var extendMethods = require('./shared/extend-methods');
var filterObject = require('./shared/filter-object');
var publicMethods = require('./shared/public-methods');
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

  this._createIframe();

  var commOpts = {
    targets: [{
      window: this._iframe.contentWindow
    }]
  };

  startServer(commOpts, {
    iframe: this._iframe,
    $iframe: this.$$iframe
  });

  var client = createClient(commOpts);
  client.create(this._steps);

  Emitter.call(this, commOpts);

  extendMethods(this, filterObject(client, publicMethods));
}

Meeky.prototype = Emitter.prototype;

Meeky.prototype._createIframe = function() {
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
};

Meeky.prototype.show = function() {
  this.$$iframe.show();
};

Meeky.prototype.hide = function() {
  this.$$iframe.hide();
};

module.exports = Meeky;
