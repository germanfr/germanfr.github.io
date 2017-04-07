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
				src: 'src/css/**/*.css',
				expand: true
			},
			options: {
				map: false,
				processors: [
					require('autoprefixer')({
						browsers: ['> 0.5%']
					})
				]
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

		shell: {
			jekyll_serve: {
				command: 'jekyll serve'
			},
			jekyll_build: {
				command: 'jekyll build'
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
				tasks: ['watch', 'shell:jekyll_serve'],
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
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('build', [
		'browserify:dist',
		'uglify:dist',
		'sass:dist',
		'postcss:dist',
		'cssmin:dist',
		'shell:jekyll_build'
	]);
};
