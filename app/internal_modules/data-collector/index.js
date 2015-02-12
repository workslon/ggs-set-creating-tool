'use strict';

module.exports = function ($) {
    /**
     * get game name from the user dropdown
     * @return {string} game name
     *                  (same as folder name that contains all game image sets)
     */
    var getGameName = function () {
      return $('#game').val();
    },

    /**
     * get ticket number - value entered by user to correspondend field
     * @return {string} ticket number (same as ticket folder name)
     */
    getTicketNumber = function () {
      return ('AM-' + $('#ticket').val());
    },

    /**
     * get set name
     * @return {string} set name - value entered by user to correspondend field
     */
    getSetName = function () {
      return $('#set').val();
    },

    /**
     * get info if image size info should be cut from image name (e.g _149K)
     * @return {boolean}
     */
    getFormatNames = function () {
      return $('#format-names')[0].checked;
    },

    getTestName = function () {
      return $('#test').val();
    },

    getClones = function () {
      var _clones = [];

      $('.clone').each(function () {
        _clones.push(this.value);
      });

      return _clones;
    },

    getTreatments = function () {
      var _treatments = [];

      $('.treatment').each(function () {
        _treatments.push(this.value);
      });

      return _treatments;
    },

    getLanguages = function () {
      var _langs = [];

      $('.langs input:checked').each(function () {
        if (this.value !== 'all') {
          _langs.push(this.value);
        }
      });

      return _langs;
    },

    getFormats = function () {
      var _formats = [];

      $('.format input:checked').each(function () {
        if (this.value !== 'all') {
          _formats.push(this.value);
        }
      });

      return _formats;
    },

    getExtensions = function () {
      var _extensions = [];

      $('.extension input:checked').each(function () {
        if (this.value !== 'all') {
          _extensions.push(this.value);
        }
      });

      return _extensions;
    };

    return {
      getGameName: getGameName,
      getTicketNumber: getTicketNumber,
      getSetName: getSetName,
      getFormatNames: getFormatNames,
      getTestName: getTestName,
      getClones: getClones,
      getTreatments: getTreatments,
      getLanguages: getLanguages,
      getFormats: getFormats,
      getExtensions: getExtensions
    };
}
