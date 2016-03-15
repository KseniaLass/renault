import del from "del";
import path from "path";
import gulp from "gulp";
import open from "open";
import gulpLoadPlugins from "gulp-load-plugins";
import packageJson from "./package.json";
import runSequence from "run-sequence";

const PORT = process.env.PORT || 3000;
const $ = gulpLoadPlugins({camelize: true});

const PUBLIC_DIR = './public';
const SOURCES_DIR = './sources';

var sassConfig = {
	sassPath: './' + SOURCES_DIR + '/css',
	bowerDir: './bower_components'
};

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
		.pipe(gulp.dest(PUBLIC_DIR + '/css'));
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
		.pipe(gulp.dest(PUBLIC_DIR + '/css'));
});

gulp.task('serve:jade', () => {
	return gulp.src(SOURCES_DIR + '/*.jade')
		.pipe($.jade({
			pretty: true
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.prettify({indent_char: '	', indent_size: 1}))
		.pipe(gulp.dest(PUBLIC_DIR + '/'));
});

gulp.task('dist:jade', () => {
	return gulp.src(SOURCES_DIR + '/*.jade')
		.pipe($.jade({
			pretty: true
		}).on('error', $.notify.onError(function (error) {
			return 'Error: ' + error.message;
		})))
		.pipe($.prettify({indent_char: '	', indent_size: 1}))
		.pipe(gulp.dest(PUBLIC_DIR + '/'));
});

