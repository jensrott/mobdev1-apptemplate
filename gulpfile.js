// Deze hebben we geinstantiërd, create an instance
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulpSass = require('gulp-sass');

// Static Server and watching scss / html files
gulp.task('serve', function() {
    browserSync.init({
        server: './app'
    });
    gulp.watch('app/scss/*.scss', ['sass']);
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('app/css'));
});