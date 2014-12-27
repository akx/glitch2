var gulp = require('gulp');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var template = require('gulp-template');
var fs = require('fs');

gulp.task('lib', function () {
	return gulp.src('src/libglitch/index.js')
		.pipe(plumber())
		.pipe(browserify({
			insertGlobals: false,
			debug: false,
			standalone: "Glitch",
		}))
		.pipe(concat('libglitch.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('appjs', function () {
	return gulp.src('src/glitcher/index.js')
		.pipe(plumber())
		.pipe(browserify({
			insertGlobals: false,
			debug: false,
		}))
		.pipe(uglify())
		.pipe(concat('glitcher.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('appcss', function () {
	return gulp.src('src/glitcher/glitcher.css')
		.pipe(minifyCss())
		.pipe(concat('glitcher.css'))
		.pipe(gulp.dest('./build'));
});

gulp.task('app', ['appcss', 'appjs'], function () {
	var js = fs.readFileSync("build/glitcher.js", "UTF-8");
	var css = fs.readFileSync("build/glitcher.css", "UTF-8");
	return gulp.src('src/glitcher/template.html')
        .pipe(template({js: js, css: css}))
		.pipe(concat('glitcher.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watchlib', ['lib'], function () {
	gulp.watch('src/libglitch/**/*.js', ['lib']);
});

gulp.task('watchapp', ['app'], function () {
	gulp.watch('src/**/*.js', ['app']);
	gulp.watch('src/glitcher/template.html', ['app']);
	gulp.watch('src/glitcher/glitcher.css', ['app']);
});
