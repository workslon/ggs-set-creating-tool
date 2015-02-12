var BaseView = require('./BaseView.js');

function PrepareTestView(document, $) {
  BaseView.apply(this, arguments);
  this.baseConfig = require('../config/BaseConfig.json');
  this.empireConfig = require('../config/__Empire.json');
  this.empireToGoConfig = require('../config/__EmpireToGo.json');
  this.init();
};

PrepareTestView.prototype = Object.create(BaseView.prototype);

PrepareTestView.prototype.init = function () {
  var bannertestValiadtor = new this.Validator('prepare-test-form', [{
    id: 'test',
    rule: 'notEmpty',
    message: 'Please provide test name!',
  }, {
    classname: 'clone',
    rule: 'notEmpty',
    message: 'Please provide at least one clone!'
  }, {
    classname: 'treatment',
    rule: 'notEmpty',
    message: 'Please provide at least one treatment!'
  }]);

  this.addLanguages();
  this.addEmpireAdvancedOptions();
  this.addEmpireToGoAdvancedOptions();
  this.initChangeGameHandler();
  this.overrideShowAlert();
  this.overrideHideAlert();
  this.adaptWindowHeight();
  this.overrideToggleAdvancedOptions();
  this.overrideAddInputRow();
  this.overrideDeleteInputRow();
  this.initAlertCloseHandler();
  this.initLangSelectionHandler();
  this.initAddButtonClickHandler();
  this.initDeleteButtonClickHandler();
  this.initToggleAdvancedOptions();
  this.initToggleAllOptions();
  this.initSubmitHandler(bannertestValiadtor);
};

PrepareTestView.prototype.addCheckBoxes = function (type, options, $sample) {
  options['all'].forEach(function (opt) {
    var $item = $sample.clone(),
        id = type + '-' + opt,
        label = opt,
        checked = options['default'] && options['default'].indexOf(opt) + 1 ? true : false,
        classname = type + ' checkbox-inline';

    $item
      .find('input')
        .attr({
          id: id,
          checked: checked,
          classname: classname,
          value: label
        })
        .end()
      .find('span')
        .text(label);

    $sample.closest('.form-group').append($item);
  });
};

PrepareTestView.prototype.addLanguages = function () {
  var $ = this.$,
      $lang = $('.langs input:eq(0)').parent(),
      langs = this.baseConfig.languages;

  this.addCheckBoxes('lang', langs, $lang);
};

PrepareTestView.prototype.addDropDownItem = function ($dropdowns, values) {
  var $ = this.$,
      $sample = $('<option></option>');
      typeof values === 'string' && (values = [values]);

  $dropdowns.each(function () {
    var $this = $(this);

    values.forEach(function (val) {
      var $item = $this.find('option[value="' + val + '"]');

      if (!$item.length) {
        $this.append($sample.clone().val(val).text(val));
      }
    });
  });
};

PrepareTestView.prototype.removeDropDownItem = function ($dropdowns, values) {
  var $ = this.$;
      typeof values === 'string' && (values = [values]);

  $dropdowns.each(function () {
    var $this = $(this);

    values.forEach(function (val) {
      var $item = $this.find('option[value="' + val + '"]');

      if ($item.length) {
        $item.remove();
      }
    });
  });
};

PrepareTestView.prototype.addEmpireAdvancedOptions = function () {
  var $ = this.$,
      $format = $('#empire-options .formats input:eq(0)').parent(),
      $extension = $('#empire-options .extensions input:eq(0)').parent(),

      formats = this.empireConfig.formats,
      extensions = this.empireConfig.extensions;

  this.addCheckBoxes('format', formats, $format);
  this.addCheckBoxes('extension', extensions, $extension);
};

PrepareTestView.prototype.addEmpireToGoAdvancedOptions = function () {
  var $ = this.$,
      $mobile = $('.mobile input:eq(0)').parent(),
      $tablet = $('.tablet input:eq(0)').parent(),
      $standart = $('.standart input:eq(0)').parent(),

      mobile = this.empireToGoConfig.mobile.formats,
      tablet = this.empireToGoConfig.tablet.formats,
      standart = this.empireToGoConfig.standart.formats;

  this.addCheckBoxes('mobile', mobile, $mobile);
  this.addCheckBoxes('tablet', tablet, $tablet);
  this.addCheckBoxes('standart', standart, $standart);
};

PrepareTestView.prototype.toggleAdvancedOptions = function ($el) {
  $el.add($el.next()).toggleClass('expanded');
};

PrepareTestView.prototype.toggleAllOptions = function ($el) {
  var $checkboxes = $el.closest('.form-group').find('input'),
      checked = false;

  $el[0].checked && (checked = true);

  $checkboxes.each(function () {
    this.checked = checked;
  });
};

PrepareTestView.prototype.getEmpireData = function () {
  var dc          = this.DataCollector(this.$),
      game        = dc.getGameName(),
      test        = dc.getTestName(),
      clones      = dc.getClones(),
      treatments  = dc.getTreatments(),
      langs       = dc.getLanguages(),
      formats     = dc.getFormats(),
      extensions  = dc.getExtensions();

  return {
    game: game,
    test: test,
    clones: clones,
    treatments: treatments,
    langs: langs,
    formats: formats,
    extensions: extensions
  }
};

PrepareTestView.prototype.prepareEmpireTest = function () {
  var fs = this.fs,
      path = this.path,
      entries = this.getEmpireData(),
      gameDir = path.join(this.BASE_PATH, entries.game, 'Banner'),
      testSetsDir = path.join(gameDir, 'Testing_Sets', entries.test),
      SEADir = path.join(gameDir, 'Banner_SEA'),
      sets = fs.readdirSync(SEADir);

  // 1. create testing set directory
  if (fs.existsSync(testSetsDir)) {
    fs.removeSync(testSetsDir);
  }
  fs.mkdirSync(testSetsDir);

  // 2. create 'Clone' and 'Treatment' folders
  fs.mkdirSync(path.join(testSetsDir, 'Clone'));
  fs.mkdirSync(path.join(testSetsDir, 'Treatment'));

  // 3. create language folders
  entries.langs.forEach(function (lang) {
    fs.mkdirSync(path.join(testSetsDir, 'Clone', lang));
    fs.mkdirSync(path.join(testSetsDir, 'Treatment', lang));
  });

  // 4. copy images
  sets.forEach((function (set) {
    var count = {
          clone: 0,
          treatment: 0
        },
        type,
        dest;

    if (entries.clones.indexOf(set) + 1) {
      dest = path.join(testSetsDir, 'Clone');
      type = 'clone';
    } else if (entries.treatments.indexOf(set) + 1) {
      dest = path.join(testSetsDir, 'Treatment');
      type = 'treatment';
    }

    if (dest) {
      entries.langs.forEach(function (lang) {
        // check lang
        if (fs.existsSync(path.join(SEADir, set, lang))) {
          fs.readdirSync(path.join(SEADir, set, lang))
            .forEach(function (filename) {
              entries.formats.forEach(function (format) {
                // check format
                if (filename.indexOf(format) + 1) {
                  entries.extensions.forEach(function (ext) {
                    // check extension
                    if (path.extname(filename) === ext) {
                      fs.writeFileSync(
                        path.join(dest, lang, filename),
                        fs.readFileSync(path.join(SEADir, set, lang, filename)));

                      count[type] ++;
                    }
                  });
                }
              });
          });
        }
      });

      // no files - log and remove "testing set" directory
      if (!count.clone && !count.treatment) {
        this.showAlert('danger', 'No files were created!');
        fs.removeSync(testSetsDir);
      } else {
        // log success + files count
        count.clone && this.showAlert('success', count.clone + ' files were created in "Clone" directory!');
        count.treatment && this.showAlert('success', count.clone + ' files were created in "Treatment" directory!');
      }
    }
  }).bind(this));
};

PrepareTestView.prototype.addInputRow = function ($el) {
  var $donor  = $el.closest('.form-group'),
      $clone  = $donor.clone(),
      id      = $donor.find('input').attr('id'),
      type    = id.replace(/\-\d+/, ''),
      number  = parseInt(id.match(/\d+/)[0], 10),
      cloneId = type + '-' + (number + 1);

  $clone
    .find('input')
      .attr('id', cloneId)
      .end()
    .find('label')
      .attr('for', cloneId)
      .end()
    .find('a')
      .attr('class', 'delete-button')
      .end()
    .find('.badge')
      .text('-');

  $donor.before($clone);
};

PrepareTestView.prototype.deleteInputRow = function ($el) {
  $el.closest('.form-group').remove();
};

PrepareTestView.prototype.initAddButtonClickHandler = function () {
  var $ = this.$,
      addInputRow = this.addInputRow;

  $('body').on('click', '.add-button', function () {
    addInputRow($(this));
  })
};

PrepareTestView.prototype.initDeleteButtonClickHandler = function () {
  var $ = this.$,
      deleteInputRow = this.deleteInputRow;

  $('body').on('click', '.delete-button', function () {
    deleteInputRow($(this));
  });
};

PrepareTestView.prototype.initToggleAdvancedOptions = function () {
  var $ = this.$,
      $toggleLinks = $('.toggle-link'),
      _this = this;

  $toggleLinks.on('click', function () {
    _this.toggleAdvancedOptions($(this));
  });
};

PrepareTestView.prototype.initToggleAllOptions = function () {
  var $ = this.$,
      $all = $('.langs input:eq(0), .formats input:eq(0), .extensions input:eq(0)'),
      _this = this;

  $all.on('click', function () {
    _this.toggleAllOptions($(this));
  });
};

PrepareTestView.prototype.initChangeGameHandler = function () {
  var $ = this.$,
      $gameDropdown = $('#game');

  $gameDropdown.on('change', function () {
    $('.advanced-options').removeClass('visible');
    if ($(this).val() === '__Empire') {
      $('#empire-options').addClass('visible');
    } else {
      $('#empiretogo-options').addClass('visible');
    }
  });
};

/**
 * once language checkbox will be clicked
 * all language dropdowns will be populated/depopulated with correspondent items
 * @return {[type]} [description]
 */
PrepareTestView.prototype.initLangSelectionHandler = function () {
  var $ = this.$;

  // "all" checkbox
  $(this.doc).on('click', '.langs input[type="checkbox"]:eq(0)', (function (e) {
    var $this = $(e.target),
        $dropdowns = $('.lang-dropdown'),
        langs = [];

    $dropdowns.find('option:gt(0)').remove();

    if ($this[0].checked) {
      $('.langs input[type="checkbox"]:gt(0)').each(function () {
        langs.push(this.value);
      });

      this.addDropDownItem($dropdowns, langs);
    }
  }).bind(this));

  // further lang checkboxes
  $(this.doc).on('click', '.langs input[type="checkbox"]:gt(0)', (function (e) {
    var $this = $(e.target),
        $dropdowns = $('.lang-dropdown');

    if ($this[0].checked) {
      this.addDropDownItem($dropdowns, $this.val());
    } else {
      this.removeDropDownItem($dropdowns, $this.val());
    }
  }).bind(this));
};

PrepareTestView.prototype.initSubmitHandler = function (validator) {
  var $ = this.$;
  var $button = $('#btn-prepare');

  $button.on('click', (function () {
    validator.validate();

    if (!validator.errors.length) {
      this.hideAlert();
      this.prepareEmpireTest();
    } else {
      this.showAlert('danger', validator.errors);
      validator.errors = [];
    }
  }).bind(this));
};

/**
 * override to add "adaptWindowHeight" functionality
 * @return {function}
 */
PrepareTestView.prototype.overrideToggleAdvancedOptions = function () {
  this.toggleAdvancedOptions = (function (_this, fn) {
    return function () {
      fn.apply(this, arguments);
      _this.adaptWindowHeight();
    };
  })(this, this.toggleAdvancedOptions);
};

/**
 * override to add "adaptWindowHeight" functionality
 * @return {function}
 */
PrepareTestView.prototype.overrideAddInputRow = function () {
  this.addInputRow = (function (_this, fn) {
    return function () {
      fn.apply(this, arguments);
      _this.adaptWindowHeight();
    };
  })(this, this.addInputRow);
};

/**
 * override to add "adaptWindowHeight" functionality
 * @return {function}
 */
PrepareTestView.prototype.overrideDeleteInputRow = function () {
  this.deleteInputRow = (function (_this, fn) {
    return function () {
      fn.apply(this, arguments);
      _this.adaptWindowHeight();
    };
  })(this, this.deleteInputRow);
};

module.exports = PrepareTestView;
