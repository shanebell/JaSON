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
			},
			lib: {
				src: 'app/lib',
				dot: true
			}
		},

		// install bower dependencies
		bower: {
			install: {
				options: {
					targetDir: 'app/lib',
					verbose: true,
					layout: function(type, component, source) {
						grunt.log.ok('type: %s, component: %s, source: %s', type, component, source);
						var tokens = source.split('/');
						var end = tokens.length < 3 ? tokens.length : tokens.length - 1;
						var layout = tokens.slice(1, end).join('/');
						grunt.log.ok(layout);
						return layout;
					}
				}
			}
		},

		'goog-webfont-dl': { // loads fonts from google fonts
			roboto: {
				options: {
					ttf: true, eot: true, woff: true, woff2: true, svg: true,
					fontname: 'Roboto',
					fontstyles: '400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic',
					fontdest: 'app/fonts/',
					cssdest: 'app/css/roboto.css'
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
							'css/**/*',
							'images/**/*',
							'fonts/**/*',
							'lib/**/*',
							'scripts/**/*',
							'templates/**/*',
							'JaSON.html',
							'manifest.json'
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
		'clean',
		'goog-webfont-dl',
		'bower',
		'less',
		'copy',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean',
		'bower',
		'less',
		'copy',
		'compress'
	]);
};
