'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({

		// clean build artifacts
		clean: {
			bower: {
				src: 'bower_components',
				dot: true
			},
			package: {
				src: 'package',
				dot: true
			},
			dist: {
				src: 'dist',
				dot: true
			}
		},

		// install bower dependencies
		bower: {
			install: {
				options: {
					targetDir: 'app/lib',
					layout: 'byComponent'
				}
			}
		},

		// compile less to css
		less: {
			app: {
				options: {
					compress: true,
					cleancss: true
				},
				files: [
					{
						cwd: 'app',
						src: ['less/*.less'],
						dest: 'app/css/',
						ext: '.css',
						flatten: true,
						expand: true
					}
				]
			}
		},

		// run jshint over javascript
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish'),
				force: true
			},
			all: [
				'Gruntfile.js',
				'app/scripts/{,*/}*.js',
				'test/spec/{,*/}*.js'
			]
		},

		// package artifacts
		copy: {
			package: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'app',
						dest: 'package',
						src: [
							'images/{,*/}*.*',
							'JaSON.html',
							'manifest.json',
							'lib/{,*/}*.*',
							'css/{,*/}*.css',
							'scripts/{,*/}*.js'
						]
					}
				]
			}
		},

		// compress artifacts for distribution
		compress: {
			dist: {
				options: {
					archive: function () {
						var manifest = grunt.file.readJSON('package/manifest.json');
						return 'dist/JaSON-' + manifest.version + '.zip';
					}
				},
				files: [
					{
						expand: true,
						cwd: 'package/',
						src: ['**'],
						dest: ''
					}
				]
			}
		},

		// watch files for changes
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['bower', 'copy']
			},
			html: {
				files: ['app/JaSON.html'],
				tasks: ['copy']
			},
			manifest: {
				files: ['app/manifest.json'],
				tasks: ['copy']
			},
			less: {
				files: ['app/less/*.less'],
				tasks: ['less', 'copy']
			},
			images: {
				files: ['app/images/{,*/}*.*'],
				tasks: ['copy']
			},
			js: {
				files: ['app/scripts/{,*/}*.js'],
				tasks: ['jshint', 'copy'],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.registerTask('default', [
		'clean:package',
		'clean:dist',
		'less',
		'jshint',
		'copy',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:package',
		'clean:dist',
		'less',
		'jshint',
		'copy',
		'compress'
	]);
};
