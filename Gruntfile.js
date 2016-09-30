module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Tasks
		sass: { // Compile Sass
			dist: {
				options: {
					sourcemap: 'none'
				},
				files: [{
					expand: true,
					cwd: 'src/sass',
					src: ['**/*.scss'],
					dest: 'src/css',
					ext: '.css'
				}]
			}
		},
		postcss: { // Post CSS
			options: {
				map: false,
				processors: [
					require('autoprefixer')({
						browsers: ['> 0.5%']
					})
				]
			},
			dist: {
				src: 'src/css/**/*.css'
			}
		},
		cssmin: { // CSS Minify
			dist: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['**/*.css', '!**/*.min.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		},
		uglify: { // JS Uglify
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/js',
						src: ['**/*.js', '!scripts.js', '!**/*.min.js'],
						dest: 'dist/js',
						ext: '.min.js'
					},
					{
						'dist/js/scripts.min.js' : 'dist/js/scripts.min.js'
					}
				]
			}
		},
		browserify: {
			dist: {
				files: [{
					'dist/js/scripts.min.js' : 'src/js/scripts.js'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					preventAttributesEscaping: true,
					keepClosingSlash: true,	// Important for xml
					collapseInlineTagWhitespace: false
				},
				files: [{
					expand: true,
					cwd: '_site',
					src: ['**/*.html','blog/feed.xml'],
					dest: '_site'
				}]
			}
		},
		watch: {
			options: {
				atBegin: true
			},
			css: {
				files: 'src/sass/**/*.scss',
				tasks: ['sass', 'postcss', 'cssmin']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['browserify', 'uglify']
			}
		}
	});

	// Load Grunt plugins
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.registerTask('default', ['watch']);
};
