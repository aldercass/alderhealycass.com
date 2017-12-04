var gulp = require('gulp');
var watch = require('gulp-watch');
var coffeescript = require('gulp-coffeescript');
var sass = require('gulp-sass');
var pug  = require('gulp-pug');
var gutil = require('gutil');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');
var s3 = require('gulp-s3-upload')({});
var runSequence = require('run-sequence').use(gulp)

gulp.task('html', function () {
    gulp.src('./src/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./public/'));
});

gulp.task('css', function () {
    return gulp.src('./src/scss/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(uncss({
        html: ['./public/index.html'],
        ignore: []
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('libs', function() {
    return gulp.src([
    ])
    .pipe(minify({
        ext: {
            src:'.js',
            min:'.min.js'
        },
        ignoreFiles: ['*.min.js']
    }))
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js', function() {
    return gulp.src('./src/coffee/*.coffee')
    .pipe(coffeescript({bare: true}).on('error', gutil.log))
    .pipe(minify({
        ext: {
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('default', function(callback) {
    return runSequence('libs','css','js','images','html',callback);
});

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

gulp.task("upload", function() {
    gulp.src("./public/**")
        .pipe(s3({
            Bucket: 'www.aldercass.com',
            ACL: 'public-read'
        }, {
            maxRetries: 5
        }))
    ;
});