'use strict';
var fs = require('fs'),
    path = require('path'),

    unixifyPath = function(filepath) {
      if (process.platform === 'win32') {
        return filepath.replace(/\\/g, '/');
      } else {
        return filepath;
      }
    };

module.exports = (function () {
  return function recurse(rootdir, callback, subdir) {
      var abspath, filepath;

      abspath = subdir ? path.join(rootdir, subdir) : rootdir;

      fs.readdirSync(abspath).forEach(function (filename) {
        filepath = path.join(abspath, filename);

        if (fs.statSync(filepath).isDirectory()) {
          recurse(rootdir, callback, unixifyPath(path.join(subdir || '', filename || '')));
        } else {
          callback(unixifyPath(filepath), rootdir, subdir, filename);
        }
      });
    };
})();
