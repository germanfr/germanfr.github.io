const { src, dest, parallel, series, watch } = require('gulp');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');
const babelify = require('babelify');
const minify = require('gulp-babel-minify');
// const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const mergeStream = require('merge-stream');

const { spawn } = require('child_process');


const SASS_SRC = 'src/scss/';
const JS_SRC = 'src/js/';
const JS_DEST = '_site/assets/js/';
const CSS_DEST = '_site/assets/css/';


function css(dev = false) {
	return function css() {
		return src('*.scss', { cwd: SASS_SRC })
			.pipe(sourcemaps.init())
			.pipe(sass({
					outputStyle: dev ? 'nested' : 'compressed',
					sourceMap: CSS_DEST,
					includePaths: 'node_modules/',
				}).on('error', sass.logError))
			.pipe(sourcemaps.write('.'))
			.pipe(dest(CSS_DEST));
	}
}


function js(dev = false) {
	return function js() {
		let files = [ 'index.js', 'homepage.js' ];
		return mergeStream(files.map(file => {
			return browserify({
					entries: JS_SRC+'/'+file,
					debug: dev,
				})
				.transform('babelify')
				.bundle()
				.pipe(source(file))
				.pipe(buffer())
				.pipe(gulpif(!dev, minifyJS()))
				// .pipe(rename({ suffix: '.min' }))
				.pipe(dest(JS_DEST));
		}));
	}
}

const minifyJS = () => minify({
	mangle: {
		keepClassName: true
	}
});

// function npm() {
// 	return src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
// 		.pipe(dest('_site/assets/fonts/'));
// }


function jekyll(serve) {
	let task = function (cb) {
		const proc = spawn('jekyll', [ serve ? 'serve' : 'build', '--incremental' ], {
			stdio: 'inherit',
			env: {
				'JEKYLL_ENV': serve ? 'development' : 'production',
			},
		});

		proc.on('close', () => cb());
	};
	task.displayName = serve ? 'jekyll-serve' : 'jekyll';
	return task;
}


function watchTask(cb) {
	const options = { ignoreInitial: false };

	// npm();

	let w1 = watch(JS_SRC, options, js(true));
	let w2 = watch(SASS_SRC, options, css(true));
	jekyll(true)(() => {
		w1.close();
		w2.close();
		cb();
	});
}



const defaultTask = parallel(css(), js(), jekyll());


module.exports = {
	default: defaultTask,
	watch: watchTask,
	js: js(),
	css: css(),
	jekyll: jekyll(),
};
