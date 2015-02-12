function BaseView(document, $) {
  this.$ = $;
  this.doc = document;
  this.path = require('path');
  this.BASE_PATH = this.path.resolve('C:\\Users\\Slon\\Desktop\\GGS\\set-creation-tool\\test\\fixtures');
  this.fs = require('fs-extra');
  this.gui = global.window.nwDispatcher.requireNwGui();
  this.util = require('util');
  this.assert = require('assert');
  this.recurse = require('recurse');
  this.Validator = require('validator')(document);
  this.DataCollector = require('data-collector');
  this.win = this.gui.Window.get();
};

/**
 * show alert message
 * @param  {string} type    ('danger' or 'success')
 * @param  {string} message
 * @return {void}
 */
BaseView.prototype.showAlert = function (type, message) {
  var $ = this.$;

  message = typeof message === 'string' ? message : message.join('<br>');

  $('#alert')
    .removeClass('alert-success alert-danger')
    .addClass('visible alert-' + type)
      .find('p')
      .html(message);
};

/**
 * hide alert
 * @return {void}
 */
BaseView.prototype.hideAlert = function() {
  var $ = this.$;

  $('#alert').removeClass('visible');
};

/**
 * adjust window size to fit the content size
 * @return {void}
 */
BaseView.prototype.adaptWindowHeight = function () {
  var $body = this.$('body'),
      height = $body.height() + 50;

  this.win.height = height;
};

/**
 * override to add "adaptWindowHeight" functionality
 * @return {function}
 */
BaseView.prototype.overrideShowAlert = function () {
  this.showAlert = (function (_this, fn) {
    return function () {
      fn.apply(this, arguments);
      _this.adaptWindowHeight();
    };
  })(this, this.showAlert);
};

/**
 * override to add "adaptWindowHeight" functionality
 * @return {function}
 */
BaseView.prototype.overrideHideAlert = function () {
  this.hideAlert = (function (_this, fn) {
    return function () {
      fn.apply(this, arguments);
      _this.adaptWindowHeight();
    };
  })(this, this.hideAlert);
};

/**
 * initialization of alert closing handler
 * @return {void}
 */
BaseView.prototype.initAlertCloseHandler = function () {
  var $ = this.$;

  $('#alert .close').on('click', (function () {
    this.hideAlert();
    this.adaptWindowHeight();
  }).bind(this));
};

module.exports = BaseView;
