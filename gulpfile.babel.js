/*
 Automation Project
 =====================================================================================
 Specialization: New Media Development
 Author : Philippe De Pauw - Waterschoot
 Version: 1.0.0
*/

'use strict';

/*
 Libraries
 =====================================================================================
*/
import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack-stream';
import path from 'path';
import pkg from './package.json';
import runSequence from 'run-sequence';
import sassdoc from 'sassdoc';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const devMode = true;

/*
 HTML
 =====================================================================================
 Scan HTML for assets
 Optimize assets
*/
gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe($.plumberNotifier())
    .pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

/*
 Handlebars
 =====================================================================================
 Compile Handlebars Pages to HTML
*/
gulp.task('handlebars:compile', () => {
  gulp
    .src('app/_hb/pages/**/*.hbs')
    .pipe($.hb({
      partials: 'app/_hb/partials/**/*.hbs',
      helpers: 'app/_hb/helpers/*.js',
      data: 'app/_hb/data/**/*.{js,json}'
    }))
    .pipe($.rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./app'));
});

/*
 HTML Lint
 =====================================================================================
 Lint the HTML code
*/
gulp.task('html:lint', () =>
  gulp.src('app/**/*.html')
    .pipe($.htmllint({}, htmllintReporter))
);

function htmllintReporter (filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      $.gutil.log($.gutil.colors.cyan('[gulp-htmllint] ') + $.gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + $.gutil.colors.red('(' + issue.code + ') ' + issue.msg));
    });
    process.exitCode = 1;
  }
}

/*
 Styles
 =====================================================================================
 Transpile Sass to CSS
 Automatically prefix stylesheets
*/
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10', 
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
    'app/assets/sass/*.scss',
    'app/assets/css/**/*.css'
  ])
    .pipe($.plumberNotifier())
    .pipe($.newer('.tmp/assets/css'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/assets/css'))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(gulp.dest('.tmp/assets/css'));
});

/*
 Sass & CSS Lint
 =====================================================================================
 Lint the Sass & CSS code --> check code quality
*/
gulp.task('styles:lint', () => {
  gulp.src([
    'app/assets/sass/**/*.scss',
    'app/assets/css/**/*.css'
  ])
    .pipe($.plumberNotifier())
    .pipe($.stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
});

/*
 Sass Documentation Generator
 =====================================================================================
 Transpile Sass to CSS
 Automatically prefix stylesheets
*/
gulp.task('sass:docs', () => {
  var options = {
    dest: 'dist/sassdocs',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true
    },
    groups: {
      'undefined': 'Ungrouped'
    },
    basePath: 'https://github.com/SassDoc/sassdoc'
  };

  return gulp.src('app/assets/sass/**/*.scss')
    .pipe(sassdoc(options));
});

/*
 Scripts
 =====================================================================================
 Transpile ES2015 to ES5
 Concatenate and minify JavaScript
*/
gulp.task('scripts', () =>
  gulp.src(['app/assets/es/main.js'])
    .pipe($.plumberNotifier())
    .pipe($.newer('.tmp/assets/js'))
    .pipe($.sourcemaps.init())
    .pipe(webpack({
      entry: {
        app: './app/assets/es/main.js'
      },
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
          }
        ]
      }
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/js'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify(
      {
        output: {
          comments: false
        }
      }
    ))
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(gulp.dest('.tmp/assets/js'))
);

/*
 ES & JS Lint
 =====================================================================================
 Lint the ES6 code --> check code quality
*/
gulp.task('scripts:lint', () =>
  gulp.src(['app/assets/es/**/*.js', 'app/assets/js/**/*.js', '!node_modules/**'])
    .pipe($.plumberNotifier())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

/*
 Images
 =====================================================================================
 Optimize images
*/
gulp.task('images', () =>
  gulp.src('app/assets/images/**/*')
    .pipe($.plumberNotifier())
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size({title: 'images'}))
);

/*
 Fonts
 =====================================================================================
 Optimize images
*/
gulp.task('fonts', () =>
  gulp.src('app/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'))
);

/*
 Clean
 =====================================================================================
 Clean the dist directory
*/
gulp.task('clean', () =>
  del([
    '.tmp',
    'dist/*',
    '!dist/.git'
  ],
  {
    dot: true
  })
);

/*
 Copy
 =====================================================================================
 Copy all files (root-level) from the app folder
*/
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/_hb',
    '!app/*.html'
  ], {
    dot: true
  })
    .pipe($.plumberNotifier())
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

/*
 PUML
 =====================================================================================
 UML with puml
*/
gulp.task('dev:puml', () =>
  gulp.src('app/docs/puml/**/*.puml')
    .pipe($.plumberNotifier())
    .pipe($.puml())
    .pipe(gulp.dest('dist/docs/uml/'))
);

/*
 PhantomJS Screenshots
 =====================================================================================
 Screenshots mad by headless browser
*/
gulp.task('phantomjs:screenshots', () =>
  gulp.src('app/assets/es/phantomjs/screenshots.js')
    .pipe($.phantom())
    .pipe(gulp.dest('dist/docs/screenshots/'))
);

/*
 Server
 =====================================================================================
 Watch files for changes and reload
*/
gulp.task('serve', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    logPrefix: 'NMD',
    scrollElementMapping: ['main', '.mdl-layout'],
    https: false,
    server: ['.tmp', 'app'],
    port: 8080,
    ui: {
      port: 8081,
      weinre: {
        port: 9081
      }
    }
  });

  gulp.watch(['app/_hb/**/*.hbs'], ['handlebars:compile', reload]);
  gulp.watch(['app/**/*.html'], ['html', reload]);
  gulp.watch(['app/assets/sass/**/*.scss', 'app/assets/css/**/*.css'], ['styles:lint', 'styles', reload]);
  gulp.watch(['app/assets/es/**/*.js', 'app/assets/js/**/*.js'], ['scripts:lint', 'scripts', reload]);
  gulp.watch(['app/assets/images/**/*'], reload);
});

/*
 Server Distribution
 =====================================================================================
 Watch files for changes and reload
*/
gulp.task('serve:dist', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    logPrefix: 'NMD',
    scrollElementMapping: ['main', '.mdl-layout'],
    https: false,
    server: ['dist'],
    port: 8080,
    ui: {
      port: 8081,
      weinre: {
        port: 9081
      }
    }
  });
});

/*
 Default Task
 =====================================================================================
 Build production files
*/
gulp.task('default', ['clean'], cb =>
  runSequence(
    ['scripts:lint', 'styles:lint'],
    'sass:docs',
    'handlebars:compile',
    ['html', 'styles', 'scripts', 'images', 'fonts', 'copy'],
    cb
  )
);
