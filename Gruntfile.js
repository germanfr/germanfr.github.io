module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Compile SASS, add compatibility stuf and minify
		sass: {
			dist: {
				cwd: 'src/sass/',
				src: '**/*.scss',
				dest: 'dist/css/',
				ext: '.min.css',
				expand: true
			},
			options: {
				sourcemap: 'none'
			}
		},
		postcss: {
			dist: {
				cwd: 'dist/css/',
				src: '**/*.css',
				dest: 'dist/css/',
				expand: true
			},
			options: {
				processors: [
					require('autoprefixer')({
						overrideBrowserslist: [
							'> 0.5%',
							'last 2 versions',
						]
					})
				],
				map: false
			}
		},
		cssmin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'dist/css/',
					src: '**/*.css',
					dest: 'dist/css/',
					ext: '.min.css'
				}]
			}
		},

		// Process JS imports and minify
		browserify: {
			dist: {
				cwd: 'src/js',
				src: ['**/*.js', '!**/_*.js'],
				dest: 'dist/js',
				ext: '.min.js',
				expand: true
			}
		},
		uglify: {
			dist: {
				cwd: 'dist/js/',
				src: '**/*.js',
				dest: 'dist/js/',
				expand: true
			}
		},

		jekyll: {
			dist: {
				options: {
					serve: false
				}
			},
			dev: {
				options: {
					serve: true
				}
			}
		},

		watch: {
			options: {
				atBegin: true
			},
			css: {
				files: 'src/sass/**/*.scss',
				tasks: ['sass', 'postcss']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['browserify']
			}
		},

		concurrent: {
			dist: {
				tasks: ['watch', 'jekyll:dev'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// Load Grunt plugins
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-postcss');

	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('build', [
		'browserify:dist',
		'uglify:dist',
		'sass:dist',
		'postcss:dist',
		'cssmin:dist',
		'jekyll:dist'
	]);
};
