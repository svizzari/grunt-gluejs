/*
 * grunt-gluejs
 * https://github.com/svizzari/grunt-gluejs
 *
 * Copyright (c) 2013 Stefan Vizzari
 * Licensed under the MIT license.
 */


'use strict';

module.exports = function(grunt) {

  var Glue = require('gluejs');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('gluejs', 'Grunt plugin for GlueJS (~2.0)', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      main: 'index.js'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var glue = new Glue();

      // Handle options
      if (options.export) { glue.export(options.export); }
      if (options.basepath) { glue.basepath(options.basepath); }
      if (options.exclude) { glue.exclude(options.exclude); }
      if (options.replace) { glue.replace(options.replace); }
      if (options.main) { glue.main(options.main); }
      if (options.cache) { glue.set('cache', options.cache); }
      if (!!options.globalRequire) { glue.set('global-require', true); }
      // TODO: Add support for remap

      f.src.forEach(function(src) {
        if (src !== f.dest) {
          glue.include(src);
        }
      });

      glue.render(function(err, output) {
        grunt.file.write(f.dest, output);
        grunt.log.writeln('Package "' + f.dest + '" created.');
      });

    });
  });

};
