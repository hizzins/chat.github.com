/*
 * @author Jenny (hjshin@rsupport.com)
 *
 */
const gulp = require('gulp');
const livereload = require('gulp-livereload');

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./public/css/*.css').on('change', livereload.changed);
});