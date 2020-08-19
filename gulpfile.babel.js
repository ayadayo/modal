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
    src:['./src/**/*.ejs','!./src/**/_*.ejs'],
    dest:'./public/'
  },
  scss: {
    src:'./src/assets/css/**/*.scss',
    dest:'./public/assets/css/'
  },  
  js: {
    src:'./src/assets/js/**/*.js',
    dest:'./public/assets/js/'
  },
  images: {
    src:'./src/assets/images/**/*',
    dest:'./public/assets/images'
  }  
}

export function ejs() {
  return src(paths.ejs.src)
  .pipe(plugins.ejs())
  .pipe(plugins.rename({extname:'.html'}))
  .pipe(dest(paths.ejs.dest))
}

export function scss() {
  return src(paths.scss.src,{
    sourcemaps: true
  })
  .pipe(plugins.plumber({ 
    errorHandler: plugins.notify.onError("Error: <%= error.message %>") 
  }))
  .pipe(plugins.sassGlob())
  .pipe(plugins.sass({
    outputStyle: 'expanded'
  }))
  .pipe(plugins.postcss([
    autoprefixer({ 
      Browserslist: ['ie >= 11'],
      grid: true 
    }),
  ]))
  .pipe(dest(paths.scss.dest,{
    sourcemaps: '.'
  }));  
}


export function js() {
  const mode = process.env.NODE_ENV === 'development' ? webpackConfigDev : webpackConfigProd;
  return plugins.plumber({
    errorHandler: plugins.notify.onError("Error: <%= error.message %>"),
  })
  .pipe(webpackStream(mode,webpack))
  .pipe(dest(paths.js.dest));
}

export function images() {
  const mode = process.env.NODE_ENV === 'production' ? true : false;
  return src(paths.images.src)
  .pipe(plugins.if(mode,plugins.imagemin([
    plugins.imagemin.mozjpeg({
      quality: [ 0.65, 0.8 ],
      speed: 1
    }),
    plugins.imagemin.optipng({
      quality: 80
    }),    
  ])))
  .pipe(dest(paths.images.dest))
}



export function server(done) {
  browserSync.init({
    server: {
      baseDir: 'public/',
      port:8080,
      reloadOnRestart:true
    }
  });
  done();
}


export function clean() {
  return del(['public/**', '!public'])
}


export function watchTask(done) {
  watch(paths.scss.src,parallel(scss))
  watch(paths.ejs.src,parallel(ejs))
  watch(paths.js.src,parallel(js))
  watch(paths.images.src,parallel(images))
  done();
}


export const dev = series(clean,parallel(ejs,scss,images,js),server,watchTask)
export const prod = series(clean,parallel(ejs,scss,images,js))

export default dev