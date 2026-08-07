const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const rtlcss = require('gulp-rtlcss');
const sass = require('gulp-sass/legacy')(require('sass'));
const sort = require('gulp-sort');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const wpPot = require('gulp-wp-pot');
const config = require('./wpgulp.config');

const prefixer = () => autoprefixer({ overrideBrowserslist: config.BROWSERS_LIST });

function styles() {
  return gulp.src(config.styleSRC)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: config.outputStyle }))
    .pipe(postcss([prefixer()]))
    .pipe(gulp.dest(config.styleDestination))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.styleDestination))
    .pipe(browserSync.stream());
}

function stylesRTL() {
  return gulp.src(config.styleSRC)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: config.outputStyle }))
    .pipe(postcss([prefixer()]))
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(gulp.dest(config.styleDestination))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.styleDestination));
}

function vendorsJS() {
  return gulp.src(config.jsVendorSRC, { allowEmpty: true })
    .pipe(concat(`${config.jsVendorFile}.js`))
    .pipe(gulp.dest(config.jsVendorDestination))
    .pipe(rename({ suffix: '.min' }))
    .pipe(terser())
    .pipe(gulp.dest(config.jsVendorDestination));
}

function customJS() {
  return gulp.src(config.jsCustomSRC, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(concat(`${config.jsCustomFile}.js`))
    .pipe(gulp.dest(config.jsCustomDestination))
    .pipe(rename({ suffix: '.min' }))
    .pipe(terser())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.jsCustomDestination));
}

function images() {
  return gulp.src(config.imgSRC, { allowEmpty: true })
    .pipe(gulp.dest(config.imgDST));
}

function translate() {
  return gulp.src(config.watchPhp)
    .pipe(sort())
    .pipe(wpPot({
      domain: config.textDomain,
      package: config.packageName,
      bugReport: config.bugReport,
      lastTranslator: config.lastTranslator,
      team: config.team
    }))
    .pipe(gulp.dest(`${config.translationDestination}/${config.translationFile}`));
}

function server(done) {
  browserSync.init({
    proxy: config.projectURL,
    open: config.browserAutoOpen,
    injectChanges: config.injectChanges
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function watchFiles() {
  gulp.watch(config.watchPhp, reload);
  gulp.watch(config.watchStyles, styles);
  gulp.watch(config.watchJsVendor, gulp.series(vendorsJS, reload));
  gulp.watch(config.watchJsCustom, gulp.series(customJS, reload));
  gulp.watch(config.imgSRC, gulp.series(images, reload));
}

const build = gulp.parallel(styles, stylesRTL, vendorsJS, customJS, images);

gulp.task('styles', styles);
gulp.task('stylesRTL', stylesRTL);
gulp.task('vendorsJS', vendorsJS);
gulp.task('customJS', customJS);
gulp.task('images', images);
gulp.task('translate', translate);
gulp.task('clearCache', done => done());
gulp.task('build', build);
gulp.task('default', gulp.series(build, gulp.parallel(server, watchFiles)));
