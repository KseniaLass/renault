'use strict';

import del from "del";
import fs from "fs";
import path from "path";
import gulp from "gulp";
import open from "open";
import rimraf from "rimraf";
import _ from "lodash";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import gulpLoadPlugins from "gulp-load-plugins";
import packageJson from "./package.json";
import runSequence from "run-sequence";
import optipng from "imagemin-optipng";

import browserSync from "browser-sync";
let reload = browserSync.reload;
let bs = browserSync.create();

import watchify from "watchify";
import browserify from "browserify";
import babelify from "babelify";

const PORT = process.env.PORT || 3000;
const $ = gulpLoadPlugins({camelize: true});

const PUBLIC_DIR = './public';
const SOURCES_DIR = './sources';

var sassConfig = {
	sassPath: './' + SOURCES_DIR + '/css',
	bowerDir: './bower_components'
};


// Main Tasks
gulp.task('serve', () => runSequence('serve:clean', 'serve:start'));
gulp.task('dist', () => runSequence('dist:clean', 'dist:build', () => {
	open('http://localhost:' + PORT)
}));
gulp.task('clean', ['dist:clean, serve:clean']);
gulp.task('open', () => open('http://localhost:' + PORT));

//gulp.task('serve:start')

// Remove all built files
gulp.task('serve:clean', cb => del([PUBLIC_DIR + '/*', '!' + PUBLIC_DIR + '/.gitkeep'], {dot: true}, cb));
gulp.task('dist:clean', cb => del([PUBLIC_DIR + '/*', '!' + PUBLIC_DIR + '/.gitkeep'], {dot: true}, cb));

// Styles handling
gulp.task('serve:sass', () => {
	return gulp.src(sassConfig.sassPath + '/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'compact'
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PUBLIC_DIR + '/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('dist:sass', () => {
	return gulp.src(sassConfig.sassPath + '/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'compressed'
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PUBLIC_DIR + '/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('serve:jade', () => {
	return gulp.src(SOURCES_DIR + '/*.jade')
		.pipe($.jade({
			pretty: true
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.prettify({indent_char: '	', indent_size: 1}))
		.pipe(gulp.dest(PUBLIC_DIR + '/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('dist:jade', () => {
	return gulp.src(SOURCES_DIR + '/*.jade')
		.pipe($.jade({
			pretty: true
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.prettify({indent_char: '	', indent_size: 1}))
		.pipe(gulp.dest(PUBLIC_DIR + '/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('serve:start', ['serve:sass', 'serve:images', 'serve:jade', 'watch', 'web-bs'], () => {
	console.log(browserifyConfig.entryFile);
});

gulp.task('dist:build', ['dist:sass', 'dist:images', 'dist:jade', 'lint', 'web']);

gulp.task('dist:images', () => {
	return gulp.src([SOURCES_DIR + '/img/**/*'])
		.pipe($.image({

		})).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		}))
		.pipe(gulp.dest(PUBLIC_DIR + '/img/'));
});

gulp.task('serve:images', () => {
	return gulp.src([SOURCES_DIR +'/img/**/*'])
		.pipe($.changed(PUBLIC_DIR + '/img/'))
		.pipe(gulp.dest(PUBLIC_DIR + '/img/'));
});

gulp.task('lint', () => {
	return gulp.src(SOURCES_DIR + '/js/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format());
		//.pipe($.eslint.failAfterError())
});


// ----------------------------------------------------------------------------

// browserify

// Misc Functions
let bundlers = {};
let checkIfBundleExists = (filename, array) => {
	let result = false;

	for (let i in array) {

		if (array.hasOwnProperty(i)) {
			if (array[i].fileName === filename) {
				result = true;
				break;
			}
		}

	}

	return result;
};


let checkJsBundles = () => {
	let p = SOURCES_DIR + '/js/';
	let newFiles = [];

	var files = fs.readdirSync(p);

	files.map((file) => {
		return path.join(p, file)
	}).filter((file) => {
		return fs.statSync(file).isFile();
	}).forEach((file) => {
		let exists = checkIfBundleExists(path.basename(file), browserifyConfig.entryFile);

		if (!exists) {
			newFiles.push({
				fileName: path.basename(file, path.extname(file)),
				fileExt: path.extname(file)
			});
		}

		//console.log("%s (%s)", file, path.extname(file), exists);
	});

	console.log('new::: ', newFiles);


	return (newFiles.length ? genJsBundles(newFiles) : false);

};

let genJsBundles = (arr, entriesStorage = browserifyConfig.entryFile) => {
	arr.forEach((el) => {

		entriesStorage[el.fileName] = {
			fileName: el.fileName + el.fileExt,
			filePath: SOURCES_DIR + '/js/',
			bundleName: el.fileName + '.bundle' + el.fileExt
		};
	});

	return entriesStorage;
};

let browserifyConfig = {
		entryFile: {
			main: {
				fileName: 'main.js',
				filePath: SOURCES_DIR + '/js/',
				bundleName: 'main.bundle.js'
			}
		},

		outputDir: PUBLIC_DIR + '/js/'
	}
	;

let getBundler = () => {

	let res = checkJsBundles();
	let bundlesList = browserifyConfig.entryFile;

	for (let i in bundlesList) {
		if (bundlesList.hasOwnProperty(i)) {
			//console.log(bundlers, i);


			if (typeof bundlers[i] === 'undefined') {
				bundlers[i] = {};
				let bundler = watchify(browserify(bundlesList[i].filePath + bundlesList[i].fileName, _.extend({debug: true}, watchify.args)));
				//console.log(bundler);

				bundlers[i].bundler = bundler;
				bundlers[i].name = i;
			}

		}
	}

	return bundlers;
};

let bundle = (name = null) => {

	let b = getBundler();

	if (name) {
		b[name].bundler
			.transform(babelify)
			.bundle()
			.on('error', function (err) {
				console.log('Error: ' + err.message);
			})
			.pipe(source(browserifyConfig.entryFile[b[name].name].bundleName))
			.pipe(gulp.dest(browserifyConfig.outputDir))
			.pipe(reload({stream: true}));

		return b;
	}

	for (let key in b) {
		if (b.hasOwnProperty(key)) {

			b[key].bundler
				.transform(babelify)
				.bundle()
				.on('error', function (err) {
					console.log('Error: ' + err.message);
				})
				.pipe(source(browserifyConfig.entryFile[b[key].name].bundleName))
				.pipe(gulp.dest(browserifyConfig.outputDir))
				.pipe(reload({stream: true}));

		}
	}

	return b;

};

gulp.task('js-clean', (cb) => {
	rimraf(browserifyConfig.outputDir, cb);
});

gulp.task('build-persistent', ['js-clean'], () => {
	return bundle();
});

gulp.task('build', ['build-persistent'], () => {
	process.exit(0);
});

gulp.task('web-bs', ['build-persistent'], () => {

	browserSync({
		server: {
			baseDir: PUBLIC_DIR
		}
	});

	let b = getBundler();

	for (let key in b) {
		if (b.hasOwnProperty(key)) {
			b[key].bundler.on('update', function () {
				bundle(key);
			});
		}
	}
});

// WEB SERVER
gulp.task('web', () => {
	browserSync({
		server: {
			baseDir: PUBLIC_DIR
		}
	});
});

gulp.task('watch', () => {
	gulp.watch(['css/*.scss'], {cwd: SOURCES_DIR + '/'}, ['serve:sass']);
	gulp.watch(['*.jade'], {cwd: SOURCES_DIR + '/'}, ['serve:jade']);
	gulp.watch(['img/**/*.svg', 'img/**/*.jpg', 'img/**/*.jpeg', 'img/**/*.png', 'img/**/*.bmp'], {cwd: SOURCES_DIR + '/'}, ['serve:images']);
	//gulp.watch([SOURCES_DIR + '/js/*.js'], ['serve:js']);
	//gulp.watch([SOURCES_DIR + '/css/*.scss'], ['serve:sass']);
});