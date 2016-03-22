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
gulp.task('dist', () => runSequence('dist:clean', 'dist:build'));
gulp.task('clean', ['dist:clean, serve:clean']);
gulp.task('open', () => open('http://localhost:' + PORT));

//gulp.task('serve:start')

// Remove all built files
gulp.task('serve:clean', cb => del([PUBLIC_DIR + '/*', '!' + PUBLIC_DIR + '/.gitkeep'], {dot: true}, cb));
gulp.task('dist:clean', cb => del([PUBLIC_DIR + '/*', '!' + PUBLIC_DIR + '/.gitkeep'], {dot: true}, cb));

// Styles handling
gulp.task('serve:sass', () => {
	return gulp.src(sassConfig.sassPath + '/style.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'compact'
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PUBLIC_DIR + '/css'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('dist:sass', () => {
	return gulp.src(sassConfig.sassPath + '/style.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'compressed'
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PUBLIC_DIR + '/css'))
		.pipe(browserSync.reload({stream:true}))
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
		.pipe(browserSync.reload({stream:true}));
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
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('serve:start', ['serve:sass', 'serve:jade', 'watch', 'web-bs'], () => {
	console.log(browserifyConfig.entryFile);
});

// browserify

let bundler;

// Misc Functions
let bundlers = [];
let checkIfBundleExists = (filename, array) => {
	let result = false;

	array.some(function(el){
		result = el.fileName === filename;
		return result;
	});

	return result;
};

/// todo: Написана ф-ция проверки, если бандл уже записан в массив. Реализовать дополнение новыми бандлами, подключить вотчер.
/// todo: Написать обработку бандлов и компиляцию. Подумать о конкатенации.


let checkJsBundles = () => {
	let p = SOURCES_DIR + '/js/';
	let newFiles = [];

	var returns = true;

	var files = fs.readdirSync(p);

	files.map((file) => {
		console.log('1: ', file);
		return path.join(p, file)
	}).filter((file) => {
		console.log('2: ', file);
		return fs.statSync(file).isFile();
	}).forEach((file) => {
		console.log('3: ', file);
		let exists = checkIfBundleExists(path.basename(file), browserifyConfig.entryFile);

		if (!exists){
			newFiles.push(path.basename(file));
		}

		//console.log("%s (%s)", file, path.extname(file), exists);
	});

	console.log('new::: ', newFiles);


	return (newFiles.length ? genJsBundles(newFiles) : false);

};

let genJsBundles = (arr, entriesStorage=browserifyConfig.entryFile) => {
	arr.forEach((el) => {
		let temp = {
			fileName: el,
			filePath: SOURCES_DIR + '/js/',
			bundleName: 'bundle.' + el
		};

		entriesStorage.push(temp);
	});

	return entriesStorage;
};

let browserifyConfig = {
	entryFile: [{
		fileName: 'main.js',
		filePath: SOURCES_DIR + '/js/',
		bundleName: 'bundle.main.js'
	}],
	outputDir: PUBLIC_DIR + '/js/'
};

function getBundler() {

	var res = checkJsBundles();
	console.log('res', res);

	if (!bundler) {
		bundler = watchify(browserify(browserifyConfig.entryFile.filePath + browserifyConfig.entryFile.fileName, _.extend({ debug: true }, watchify.args)));
	}
	return bundler;
}

function bundle() {
	return getBundler()
		.transform(babelify)
		.bundle()
		.on('error', function(err) { console.log('Error: ' + err.message); })
		.pipe(source(browserifyConfig.entryFile[0].bundleName))
		.pipe(gulp.dest(browserifyConfig.outputDir))
		.pipe(reload({ stream: true }));
}

gulp.task('js-clean', function(cb){
	rimraf(browserifyConfig.outputDir, cb);
	// todo: переписать
});

gulp.task('build-persistent', ['js-clean'], function() {
	return bundle();
});

gulp.task('build', ['build-persistent'], function() {
	process.exit(0);
});

gulp.task('web-bs', ['build-persistent'], function() {

	browserSync({
		server: {
			baseDir: PUBLIC_DIR
		}
	});

	getBundler().on('update', function() {
		gulp.start('build-persistent')
	});
});

// WEB SERVER
gulp.task('web', function () {
	browserSync({
		server: {
			baseDir: PUBLIC_DIR
		}
	});
});

gulp.task('watch', () => {
	gulp.watch([SOURCES_DIR + '/css/*.scss'], ['serve:sass']);
	gulp.watch([SOURCES_DIR + '/*.jade'], ['serve:jade']);
	//gulp.watch([SOURCES_DIR + '/js/*.js'], ['serve:js']);
	//gulp.watch([SOURCES_DIR + '/css/*.scss'], ['serve:sass']);
	//gulp.watch([SOURCES_DIR + '/css/*.scss'], ['serve:sass']);
	//gulp.watch([SOURCES_DIR + '/css/*.scss'], ['serve:sass']);
});