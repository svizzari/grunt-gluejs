/*
 * grunt-gluejs
 * https://github.com/svizzari/grunt-gluejs
 *
 * Copyright (c) 2013 Stefan Vizzari
 * Licensed under the MIT license.
 */


'use strict';

module.exports = function(grunt) {

  var _    = grunt.util._,
      Glue = require('gluejs'),
      fs   = require('fs'),
      path = require('path');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('gluejs', 'Grunt plugin for GlueJS (~2.0)', function() {

    var options = this.options(),
        done    = this.async(),
        base    = process.cwd();

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var glue = new Glue();

      // Handle options
      if (options.export) { glue.export(options.export); }
      if (options.basepath) {
        glue.basepath(options.basepath);
        // We need to tell GlueJS to work from the basepath dir., not from Gruntfile dir.
        grunt.file.setBase(path.resolve(options.basepath));
      }
      // if (options.include) { glue.include(options.include); }
      if (options.exclude) { glue.exclude(options.exclude); }
      if (options.replace) { glue.replace(options.replace); }
      if (options.main) { glue.main(options.main); }
      if (options.cache) { glue.set('cache', options.cache); }
      if (!!options.globalRequire) { glue.set('global-require', true); }
      if (options.remap) {
        if ('object' !== grunt.util.kindOf(options.remap)) {
          grunt.log.error('remap options should be provided as an Object ' +
                          'where key is the module being mapped and value ' +
                          'is a module name or expression');
        } else {
          Object.keys(options.remap).forEach(function(key) {
            glue.remap(key, options.remap[key]);
          });
        }
      }

      f.src.forEach(function(src) {
        if (src !== f.dest) {
          glue.include(src);
        }
      });

      // Reinstate the original working directory, if it was changed for basepath
      if (options.basepath) { grunt.file.setBase(base); }

      grunt.log.write('Glueing ' + f.dest + '...');

      glue.render(function(err, output) {
        if (err) {
          grunt.log.error();
          grunt.event.emit('gluejs.fail');
          done(false);
        } else {
          grunt.file.write(f.dest, output);
          grunt.event.emit('gluejs.done');
          grunt.log.ok();
          done();
        }
      });

    });
  });

};
