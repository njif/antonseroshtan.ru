'use strict';

/********************************
*********************************
			VARS
*********************************
*********************************/

var gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	header = require('gulp-header'),
	jshint = require('gulp-jshint'),
	processhtml = require('gulp-processhtml'),
	path = require('path'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	concatCss = require("gulp-concat-css"),
	minifyCss = require("gulp-minify-css"),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	notify = require("gulp-notify"),
	plumber = require('gulp-plumber'),

	connect = require('gulp-connect'),

	pkg = require('./package.json'),

	banner = ['/**',
  ' * <%= pkg.author %>',
  ' * <%= pkg.name %> v<%= pkg.version %>',
  ' */',
  ''].join('\n');


/********************************
*********************************
			TASKS
*********************************
*********************************/

gulp.task('default', [/*'connectToserver', */'build', 'watch']); 	// prepareAssets is very long
																	// DO NOT INCLUDE IT INTO DEFAULT, please!
																	// Do it only once than you change fonts or images

gulp.task('prepareAssets', ['makeAssets', 'clearAssets', 'copyResources']); // async: first, check root assets folder and create it if not exist,  
																			// then clean up it, 
																			// and finaly copy resources (images, fonts)
gulp.task('makeAssets', makeAssets);
gulp.task('clearAssets', ['makeAssets'], clearAssets);
gulp.task('copyResources', ['clearAssets'], copyResources);

gulp.task('build', ['processStyles', 'processScripts', 'processHtml']);

gulp.task('processHtml', processHtml);

gulp.task('processScripts', processJs)
gulp.task('processStyles', ['buildLess', 'processCss']); // async: first, build LESS files then process css
gulp.task('buildLess', buildLess);
gulp.task('processCss', ['buildLess'], processCss);

gulp.task('copyImages', copyImages);
gulp.task('copyPdf', copyPdf);
gulp.task('copyFonts', copyFonts);
/*
gulp.task('connectToserver', connectToserver);
*/
gulp.task('watch', watch);
gulp.task('watchCss', watchCss);
gulp.task('watchHtml', watchHtml);

/********************************
*********************************
			FUNCTIONS
*********************************
*********************************/

function clearAssets() {	
	del([ 'assets/*'  ], function (err) {
		console.log('All files in root assets folder was deleted');
	});
}

function makeAssets() {	
	if (!fs.existsSync('./assets')) {
		fs.mkdirSync('./assets');
	}
}

function copyResources() {
	copyImages();
	copyPdf();
	copyFonts();
}


/* Process something */

function processHtml() {
	gulp.src('src/index.html')
		.pipe(plumber())
		.pipe(processhtml('index.html'))
		.pipe(gulp.dest('./'))
		//.pipe(connect.reload())
		.pipe(notify('Html processed!'));
};

function buildLess() {
	return gulp.src('src/less/main.less')
		.pipe(less())
		.pipe(gulp.dest('src/assets/css'));
}

function processCss() {
	gulp.src([
			'bower_components/components-bootstrap/css/bootstrap.css ', 
			'src/assets/css/**/*.css'
		]).pipe(plumber())
		//.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(concatCss("bundle.css"))
		.pipe(minifyCss())
		//.pipe(sourcemaps.write())
		.pipe(rename('bundle.min.css'))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('assets/css'))
		//.pipe(connect.reload())
		.pipe(notify('Styles processed!'))
}

function processJs() {
	gulp.src([
			'bower_components/jquery/dist/jquery.js',
			'node_modules/jquery-mousewheel/jquery.mousewheel.js',
			'src/assets/js/main.js'
		]).pipe(plumber())
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('assets/js'))
		//.pipe(connect.reload())
		.pipe(notify('Scripts processed!'))
};

/* Copy only tasks */

function copyHtml() {
	return gulp.src('src/*.html')
		.pipe(plumber())
		.pipe(gulp.dest('./'))
		.pipe(notify('Html copied!'))
};

function copyImages() {
	gulp.src('src/assets/img/**/*.*')
		.pipe(plumber())
		.pipe(gulp.dest('assets/img'))
		.pipe(notify('Images copied!'));
};

function copyPdf() {
	gulp.src('src/assets/pdf/**/*.*')
		.pipe(plumber())
		.pipe(gulp.dest('assets/pdf'))
		.pipe(notify('Pdf copied!'));
};

function copyFonts() {
	gulp.src('src/assets/css/fonts/**/*.*')
		.pipe(plumber())
		.pipe(gulp.dest('assets/css/fonts'))
		.pipe(notify('Fonts copied!'));
};

/* Watch tasks */

function watchCss() {
	gulp.watch('src/assets/css/**/*.css', ['processCss']);
};

function watchHtml() {
	gulp.watch('src/*.html', ['processHtml']);
};

function watch() {
	gulp.run(['watchCss', 'watchHtml']);
};

function notifyChanges(event){
	notify(event.path+' -> '+event.type);
};

/*
function connectToserver() {
	connect.server({
		root: './',
		livereload: true
	});
};*/