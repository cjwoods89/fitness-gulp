'use strict';

var validate = require('gulp-w3c-css');

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var htmlhint = require("gulp-htmlhint");
const babel = require('gulp-babel');
var beautify = require('gulp-beautify');
var concat = require('gulp-concat');
var about = require('gulp-about');
var strip = require('gulp-strip-comments');

var srcPath = path.join(__dirname, './assets/css/*.css');
var dstPath = path.join(__dirname, './assets/build');

gulp.task('sass', function() {
    return gulp.src('./assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./assets/css/'));
});

gulp.task('cssValidator', function() {
    return gulp.src(srcPath)
        .pipe(validate())
        .pipe(gulp.dest(dstPath));
});

gulp.task('htmlHinter', function() {
    return gulp.src("*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});

gulp.task('babel', () => {
    return gulp.src('./assets/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('beautify', function() {
    return gulp.src('./assets/js/*.js')
        .pipe(beautify({indent_size: 2}))
        .pipe(gulp.dest('./public/'))
});

gulp.task('concat', function() {
  return gulp.src('./assets/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./assets/concatJS/'));
});

gulp.task('about', function () {
    return gulp.src('package.json')
        .pipe(about({
            keys: ['name', 'version', 'description','homepage', 'scripts', 'author'],   // properties to pick from the source 
            inject: {                              // custom properties to inject 
                buildDate: Date.now()
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('commentJS', function () {
  return gulp.src('./assets/js/*.js')
    .pipe(strip())
    .pipe(gulp.dest('dist'));
});

gulp.task('commentHTML', function () {
  return gulp.src('*.html')
    .pipe(strip())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass', 'cssValidator', 'htmlHinter', 'babel', 'beautify', 'concat', 'about', 'commentJS', 'commentHTML']);
gulp.task('js', ['babel', 'beautify', 'concat', 'commentJS']);
gulp.task('css', ['sass', 'cssValidator']);
gulp.task('html', ['htmlHinter', 'commentHTML']);
gulp.task('files', ['about']);
