 var path = require('path');
 var BaseView = require('BaseView');

function CreateSetView (document, $) {
  BaseView.apply(this, arguments);
  this.init();
};

CreateSetView.prototype = Object.create(BaseView.prototype);

CreateSetView.prototype.init = function () {
  var bannersetValidator = new this.Validator('form-create', [{
        id: 'ticket',
        rule: 'digit',
        message: 'Please use digits for ticket number!'
      }, {
        id: 'set',
        rule: 'notEmpty',
        message: 'Please provide set name!'
      }
    ]);

  this.initAlertCloseHandler();
  this.initSubmitHandler(bannersetValidator);
  this.overrideShowAlert();
  this.overrideHideAlert();
  this.adaptWindowHeight();
};

/**
 * get user entries for new banner set
 * @return {[object Object]} user entries
 */
CreateSetView.prototype.getData = function() {
  var dc      = this.DataCollector(this.$),
      game    = dc.getGameName(),
      ticket  = dc.getTicketNumber(),
      set     = dc.getSetName(),
      format  = dc.getFormatNames();

  return {
    game: game,
    ticket: ticket,
    set: set,
    format: format
  };
};

/**
 * create set of images (banner set) based on user entries
 * @return {void}
 */
CreateSetView.prototype.createSet = function () {
  var fs = this.fs,
      path = this.path,
      BASE_PATH = this.BASE_PATH,
      recurse = this.recurse,
      entries = this.getData(),
      ticketPath = path.resolve(BASE_PATH, entries.game, 'Banner', 'QA', entries.ticket),
      categories = [],
      log = [];

  // inform user if ticket doesn't exist
  if (!fs.existsSync(ticketPath)) {
    return this.showAlert(
      'danger',
      'There is no ticker with the name ' + entries.ticket
    );
  } else {
    // get categories listed in ticket
    categories = fs.readdirSync(ticketPath);

    // find correspondend categories in "Banner" directory
    categories.forEach(function (category) {

      var dest = path.resolve(BASE_PATH, entries.game, 'Banner', 'Banner_' + category),
          setDir = path.resolve(dest, entries.set),
          fileCount = 0,
          files = [];

      // remove set if it already exists
      if (fs.existsSync(setDir)) {
        fs.removeSync(setDir);
      }

      // create set folder
      fs.mkdirSync(setDir);

      // coppy folders/files from ticket
      recurse(path.resolve(ticketPath, category), function (filepath, rootdir, subdir, filename) {
        if (!/^\./.test(filename)) {
          filename = entries.format ?
                    filename.replace(/\_\d+(?=kb)kb/i, '') :
                    filename;

          if (!fs.existsSync(path.resolve(setDir, subdir))) {
            fs.mkdirSync(path.resolve(setDir, subdir));
          }

          fs.writeFileSync(path.resolve(setDir, subdir, filename), fs.readFileSync(filepath));

          // count create files
          fileCount ++;
          files.push(filename);
        }
      });

      // log create files
      log.push(category + ': ' + fileCount + ' files were copied successfully!');
    });

    this.showAlert('success', log);
  }
};

/**
 * initialization of 'CreateSet' form form submit handler
 * @param  {[type]} setFormValidator [validator of 'SetForm' form]
 * @return {void}
 */
CreateSetView.prototype.initSubmitHandler = function (validator) {
  var $ = this.$;
  var $button = $('#btn-create');

  $button.on('click', (function () {
    validator.validate();

    if (!validator.errors.length) {
      this.hideAlert();
      this.createSet();
    } else {
      this.showAlert('danger', validator.errors);
      validator.errors = [];
    }
  }).bind(this));
};

module.exports = CreateSetView;
