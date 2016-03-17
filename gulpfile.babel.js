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

// Misc Functions
var bundles = [];
let checkJsBundles = () => {
	let p = SOURCES_DIR + '/js/';
	fs.readdir(p, (err, files)  => {
		if (err){
			throw err;
		}

		files.map((file) => {
			return path.join(p, file)
		}).filter((file) => {
			return fs.statSync(file).isFile();
		}).forEach((file) => {
			console.log("%s (%s)", file, path.extname(file))
		})
	})
};

let genJsBundles = (config) => {

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
	checkJsBundles();
});

// browserify

let bundler;

let browserifyConfig = {
	entryFile: SOURCES_DIR + '/js/main.js',
	outputDir: PUBLIC_DIR + '/js/',
	outputFile: 'es6.js'
};

function getBundler() {
	if (!bundler) {
		bundler = watchify(browserify(browserifyConfig.entryFile, _.extend({ debug: true }, watchify.args)));
	}
	return bundler;
}

function bundle() {
	return getBundler()
		.transform(babelify)
		.bundle()
		.on('error', function(err) { console.log('Error: ' + err.message); })
		.pipe(source(browserifyConfig.outputFile))
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