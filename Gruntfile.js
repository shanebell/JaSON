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
					//layout: 'byType',
					//layout: function(type, component, source) {
					//	// We maintain the original bower layout, but only include main files
					//	var tokens = source.split("/");
					//	var end = tokens.length < 3 ? tokens.length : tokens.length - 1;
					//	return tokens.slice(1, end).join("/");
					//}

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
				tasks: ['copy'],
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
		'copy',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:package',
		'clean:dist',
		'less',
		'copy',
		'compress'
	]);
};
