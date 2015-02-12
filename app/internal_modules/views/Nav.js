var BaseView = require('./BaseView.js');

function Nav(document, $) {
  BaseView.apply(this, arguments);
  this.init();
}

Nav.prototype = Object.create(BaseView.prototype);

Nav.prototype.init = function () {
  this.overrideSwitchTab();
  this.initTabSwitcher();
};

Nav.prototype.switchTab = function ($, el) {
  var i = $(el).index();

  $('#main-nav li')
    .removeClass('current')
    .eq(i)
    .addClass('current');

  $('body section')
    .removeClass('visible')
    .eq(i)
    .addClass('visible');
};

Nav.prototype.overrideSwitchTab = function () {
  this.switchTab = (function (_this, fn) {
    return function () {
      fn.apply(this, arguments);
      _this.adaptWindowHeight();
    };
  })(this, this.switchTab);
};

Nav.prototype.initTabSwitcher = function () {
    var $ = this.$,
      switchTab = this.switchTab;


  $('#main-nav li').on('click', function () {
    switchTab($, this);
  });
};

module.exports = Nav;
