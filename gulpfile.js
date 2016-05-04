/*
 * @author Jenny (hjshin@rsupport.com)
 *
 */
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
// var connect = require('connect');
// var url = require('url');
// var proxy = require('proxy-middleware');
// var app = connect();

// app.use('/socket.io', proxy(url.parse('//cdn.socket.io/socket.io-1.4.5.js')));

// Static server + watching scss/html files
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: {
      baseDir: './',
      // port: 3000,
      // middleware: [proxy]
    }
  });

  gulp.watch('public/sass/*.sass', ['sass']);
  gulp.watch('public/*.html').on('change', browserSync.reload);
});
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('public/sass/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
