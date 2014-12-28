var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var template = require('gulp-template');
var fs = require('fs');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;

var RELEASE = false;

gulp.task('lib', function () {
	return gulp.src('src/libglitch/index.js')
		.pipe(plumber())
		.pipe(browserify({
			insertGlobals: false,
			debug: false,
			standalone: "Glitch",
		}))
		.pipe(RELEASE ? uglify() : gutil.noop())
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
		.pipe(RELEASE ? uglify() : gutil.noop())
		.pipe(concat('glitcher.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('appcss', function () {
	return gulp.src('src/glitcher/glitcher.css')
		.pipe(RELEASE ? minifyCss() : gutil.noop())
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

gulp.task("release=yes", function(complete) {
	RELEASE = true;
	complete();
});

gulp.task("gh", function(complete) {
	runSequence('release=yes', 'app', function() {
		var data = fs.readFileSync("dist/glitcher.html", "UTF-8");
		data += '\n<script>!function(e,a,t,n,c,o,s){e.GoogleAnalyticsObject=c,e[c]=e[c]||function(){(e[c].q=e[c].q||[]).push(arguments)},e[c].l=1*new Date,o=a.createElement(t),s=a.getElementsByTagName(t)[0],o.async=1,o.src=n,s.parentNode.insertBefore(o,s)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-282164-17","auto"),ga("send","pageview");</script>';
		spawn("git", ["checkout", "gh-pages"], {"stdio": "inherit"}).on("close", function(code) {
			if(code) return;
			fs.writeFileSync("./index.html", data, "UTF-8");
			complete();
		});
	});
});
