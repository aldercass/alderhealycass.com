var gulp = require('gulp');
var watch = require('gulp-watch');
var coffeescript = require('gulp-coffeescript');
var sass = require('gulp-sass')(require('sass'));
var pug  = require('gulp-pug');
var gutil = require('gutil');
var minify = require('gulp-minify');

gulp.task('html', function (callback) {
    gulp.src('./src/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('./'));
    callback();
});

gulp.task('css', function () {
    return gulp.src('./src/scss/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css/'));
});

gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./images/'));
});

gulp.task('sitemap', function() {
    return gulp.src('./src/sitemap.xml')
    .pipe(gulp.dest('./'));
});

gulp.task('manifest', function() {
    return gulp.src('./src/manifest.json')
    .pipe(gulp.dest('./'));
});

gulp.task('serviceworker', function() {
    return gulp.src('./src/service-worker.js')
    .pipe(gulp.dest('./'));
});

gulp.task('js', function() {
    return gulp.src('./src/coffee/*.coffee')
    .pipe(coffeescript({bare: true}).on('error', gutil.log))
    .pipe(minify({
        ext: {
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('./js/'));
});

gulp.task('default', gulp.series('css','js','images','html','sitemap','manifest','serviceworker'));

gulp.task('watch', function () {
    watch('./src/coffee/**/*.coffee', function () {
        gulp.start('js');
    });
    watch('./src/scss/**/*.scss', function () {
        gulp.start('css');
    });
    watch('./src/**/*.pug', function () {
        gulp.start('html');
    });
    return
});
