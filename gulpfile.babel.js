const gulp = require('gulp')
const {src,dest,watch,series,parallel} = require('gulp')
const plugins = require('gulp-load-plugins')()
const autoprefixer = require('autoprefixer')
const browserSync = require('browser-sync')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfigDev = require('./webpack.dev')
const webpackConfigProd = require('./webpack.prod')
const del = require('del')

const paths = {
  ejs: {
    src:'./src/**/*.ejs',
    dest:'./public/'
  },
  scss: {
    src:'./src/assets/css/**/*.scss',
    dest:'./public/assets/css/'
  },  
  js: {
    src:'./src/assets/css/**/*.js',
    dest:'./public/assets/js/'
  },
  images: {
    src:'./src/assets/images/**/*',
    dest:'./public/assets/images'
  }  
}

function scss() {
  return gulp.src(paths.scss.src,{
    sourcemaps: true
  })
  .pipe(plugins.plumber({ 
    errorHandler: plugins.notify.onError("Error: <%= error.message %>") 
  }))
  .pipe(plugins.sass({
    outputStyle: 'expanded'
  }))
  .pipe(plugins.postcss([
    autoprefixer({ 
      Browserslist: ['ie >= 11'],
      grid: true 
    }),
  ]))
  .pipe(gulp.dest(paths.scss.dest,{
    sourcemaps: '.'
  }));  
}

exports.scss = scss;

const mode = process.env.NODE_ENV === 'development' ? webpackConfigDev : webpackConfigProd;
function js() {
  return plugins.plumber({
    errorHandler: plugins.notify.onError("Error: <%= error.message %>"),
  })
  .pipe(webpackStream(mode,webpack))
  .pipe(gulp.dest(paths.js.dest));
}

exports.js = js;

function images() {
  return gulp.src(paths.images.src)
  .pipe(plugins.imagemin([
    plugins.imagemin.mozjpeg({
      quality: [ 0.65, 0.8 ],
      speed: 1
    }),
    plugins.imagemin.optipng({
      quality: 80
    }),    
  ]))
  .pipe(gulp.dest(paths.images.dest))
}

exports.images = images;


function server(done) {
  browserSync.init({
    server: {
      baseDir: 'public/',
      port:8080,
      reloadOnRestart:true
    }
  });
  done();
}

exports.server = server;

function clean() {
  return del(['public/**', '!public'])
}

exports.clean = clean;

function watchTask(done) {
  gulp.watch(paths.scss.src,gulp.parallel(scss))
  gulp.watch(paths.js.src,gulp.parallel(js))
  gulp.watch(paths.images.src,gulp.parallel(images))
  done();
}

exports.watchTask = watchTask;

export const dev = gulp.series(clean,gulp.parallel(scss,images,js),server,watchTask)
export const prod = gulp.series(clean,gulp.parallel(scss,images,js))

export default dev