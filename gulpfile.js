const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const order = require('gulp-order');
const sourcemaps = require('gulp-sourcemaps');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', () => {
  browserSync.init({
    proxy: '#',
    notify: false
  });

  gulp.watch('./scss/**/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./**/*.php').on('change', browserSync.reload);
  gulp.watch('./js/main.js', gulp.parallel('scripts'));
  gulp.watch('./js/vendor/*.js', gulp.parallel('libs'));
});

gulp.task('sass', () => {
  return gulp
    .src('./scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./assets'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp
    .src('./js/main.js')
    .pipe(rename('main.min.js'))
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/'))
    .pipe(browserSync.stream());
});

gulp.task('libs', () => {
  return gulp
    .src(['./js/vendor/*.js', '!./js/vendor/jquery-3.3.1.min.js'])
    .pipe(order(['ScrollMagic.min.js', '*.js']))
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('./js/'))
    .pipe(browserSync.stream());
});

// Watchers
gulp.task('watch', gulp.series('sass', 'libs', 'scripts', 'browserSync'));