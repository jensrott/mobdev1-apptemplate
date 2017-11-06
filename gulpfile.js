// Deze hebben we geinstantiërd, we create an instance
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulpSass = require('gulp-sass');

// Babel
var gulpBabel = require('gulp-babel');

// Static Server and watching scss / html files
gulp.task('serve', function() {
    browserSync.init({
        server: './app',
        // De pagina
        port: 8080,
        // De interface
        ui: {
            port: 8081,
            weinre: {
                port: 9081
            }

        }
    });

    gulp.watch('app/scss/*.scss', ['sass']);
    // De html te watchen en de server te herladen dan als er iets word aangepaast
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

// Compile ES6 Into JS
gulp.task('es6', function(){
    // Het eerste wat je doet is waar is de bron van mijn scriptbestanden
    // mapje es6 en javascript file aanmaken daarin
    return gulp.src('app/es6/**/*.js')
        .pipe(gulpBabel())
        .pipe(gulp.dest('app/js'));
});

// Default task
gulp.task('default', ['serve']);