'use strict';

module.exports = function (document) {

    function Validator(formid, fields) {
      this.form = document.getElementById(formid);
      this.fields = fields;
      this.errors = [];
    }

    Validator.prototype.digit = function (value) {
      return /^\d+$/.test(value);
    };

    Validator.prototype.notEmpty = function (value) {
      return value !== '';
    };

    Validator.prototype.validate = function () {
      this.fields.forEach((function (field) {
        var id = field.id,
            el = document.getElementById(id),
            value = el ? el.value : '',
            rule = field.rule,
            message = field.message,
            classname = field.classname,
            values = [],
            els;

        if (classname) {
          els = document.querySelectorAll('.' + classname);
          values = [].map.call(els, function (el) {
            if (el.value) return el.value;
          });

          if (!values.length || values[0] == null) {
            this.errors.push(message);
          }
        } else {
          if (!this[rule].call(this, value)) {
            this.errors.push(message);
          }
        }
      }).bind(this));
    };

    return Validator;
}
