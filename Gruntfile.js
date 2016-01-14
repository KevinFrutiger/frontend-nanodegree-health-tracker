module.exports = function(grunt) {

  grunt.initConfig({

    // Build

    clean: {
      build: {
        src: ['dist/*']
      },
      // Remove the css folder since all CSS is now inlined.
      inlinedcss: {
        src: ['dist/css/']
      },
      // Remove the JS folder since all relative JS is now inlined.
      inlinedjs: {
        src: ['dist/js/']
      }
    },

    htmlmin: {
      main: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.html'],
          dest: 'dist/'
        }]
      }
    },

    cssmin: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css'],
          dest: 'dist/css/'
        }]
      }
    },

    // Embed custom CSS, JS, and backbone.localStorage
    replace: {
      dist: {
        options: {
          patterns: [{ // CSS
            match: /<link rel=\"stylesheet\" href=\"css\/styles.css\">/g,
            replacement: '<style>' +
                         '<%= grunt.file.read("dist/css/styles.css") %>' +
                         '</style>'
          },{ // JS (relative)
            match: /<script src=\"(js\/[\w-\/.]+)\"><\/script>/g,
            replacement: function(match, p1) {
              return '<script>' + grunt.file.read('dist/' + p1) + '</script>';
            }
          }]
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['index.html'],
          dest: 'dist/'
        }]
      }
    },

    uglify: {
      options: {
        mangle: false,
        wrap: false,
        compress: {
          negate_iife: false,
          drop_console: true
        }
      },
      main: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: ['**/*.js'],
          dest: 'dist/js/'
        }]
      }
    },

    copy: {
      hidden: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.htaccess'],
          dest: 'dist/',
          dot: true
        }]
      }
    },


    // Testing

    jshint: {
      main: ['src/js/**/*.js','!src/js/lib/**']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('build', ['jshint', 'clean:build', 'htmlmin',
                               'cssmin', 'uglify', 'copy', 'replace',
                               'clean:inlinedcss', 'clean:inlinedjs']);

};