module.exports = (grunt) ->
  dev:
    options:
      platforms: ['win', 'osx']
      buildDir: '../build'
    src: ['../app/css/*', '../app/images/*', '../app/js/*', '../app/node_modules/BaseView/*', '../app/node_modules/BaseView/*', '../app/node_modules/CreateSetView/*', '../app/node_modules/data-collector/*', '../app/node_modules/fs-extra/**/*', '../app/node_modules/recurse/*', '../app/node_modules/validator/*', '../app/index.html', '../app/package.json']
