//****************************************************************************************************
//
// .. VARIABLES
//
//****************************************************************************************************
var
  del = require('del'),
  es = require('event-stream'),
  gulp = require('gulp'),
  plugin = require('gulp-load-plugins')(),
  path = require('./path.json');



//****************************************************************************************************
//
// .. TASKS
//
//****************************************************************************************************
//
// .. Clean
//
gulp.task('clean', function(cb) {
  del(path.build, cb);
});

//
// .. Layouts
//
gulp.task('layouts:d', function() {
  gulp.src([path.layouts.all, path.layouts.views.none])
    .pipe(plugin.rubyHaml())
    .pipe(gulp.dest(path.build));
});

gulp.task('layouts:s', function() {
  gulp.src([path.layouts.all, path.layouts.views.none])
    .pipe(plugin.rubyHaml())
    .pipe(gulp.dest(path.build));
});

gulp.task('layouts:p', function() {
  gulp.src([path.layouts.all, path.layouts.views.none])
    .pipe(plugin.rubyHaml())
    .pipe(plugin.htmlReplace({javascripts: {src: path.javascripts.app, tpl: '<script src=\'%s\'></script>'}}))
    .pipe(plugin.minifyHtml({conditionals: true}))
    .pipe(gulp.dest(path.build));
});

//
// .. Stylesheets
// .. https://github.com/sindresorhus/gulp-ruby-sass/issues/156
//
gulp.task('stylesheets:d', function() {
  gulp.src(path.stylesheets.app)
    .pipe(plugin.rubySass({noCache: true, 'sourcemap=none': true}))
    .pipe(gulp.dest(path.stylesheets.dest));
});

gulp.task('stylesheets:s', function() {
  gulp.src(path.stylesheets.app)
    .pipe(plugin.rubySass({noCache: true, 'sourcemap=none': true}))
    .pipe(plugin.autoprefixer('last 2 versions'))
    .pipe(gulp.dest(path.stylesheets.dest));
});

gulp.task('stylesheets:p', function() {
  var
    _scss = gulp.src(path.stylesheets.app)
              .pipe(plugin.rubySass({noCache: true, 'sourcemap=none': true}))
              .pipe(plugin.autoprefixer('last 2 versions'))
              .pipe(plugin.minifyCss()),
  
    _vendor = gulp.src(path.stylesheets.vendor.all)
                .pipe(plugin.minifyCss());

  return es.merge(_scss, _vendor)
          .pipe(plugin.concat('application.css'))
          .pipe(gulp.dest(path.stylesheets.dest));
});

gulp.task('stylesheets:v', function() {
  gulp.src(path.stylesheets.vendor.all)
    .pipe(gulp.dest(path.stylesheets.vendor.dest));
});

//
// .. Javascripts
//
gulp.task('javascripts:d', function() {
  gulp.src(path.javascripts.all)
    .pipe(gulp.dest(path.javascripts.dest));
});

gulp.task('javascripts:s', function() {
  gulp.src(path.javascripts.all)
    .pipe(gulp.dest(path.javascripts.dest));
  gulp.src([path.javascripts.all, path.javascripts.vendor.none])
    .pipe(plugin.jshint())
    .pipe(plugin.jshint.reporter());
});

gulp.task('javascripts:p', function() {
  gulp.src([path.javascripts.all, path.javascripts.vendor.none])
    .pipe(plugin.jshint())
    .pipe(plugin.jshint.reporter());
  gulp.src(path.javascripts.list)
    .pipe(plugin.concat('application.js'))
    .pipe(plugin.uglify())
    .pipe(gulp.dest(path.javascripts.dest));
});

//
// .. Images
//
gulp.task('images:d', function() {
  gulp.src(path.images.all)
    .pipe(gulp.dest(path.images.dest));
});

gulp.task('images:s', function() {
  gulp.src(path.images.all)
    .pipe(plugin.imagemin())
    .pipe(gulp.dest(path.images.dest));
});

gulp.task('images:p', function() {
  gulp.src(path.images.all)
    .pipe(plugin.imagemin())
    .pipe(gulp.dest(path.images.dest));
});

//
// .. Copy
//
gulp.task('copy:fonts', function() {
  gulp.src(path.fonts.all)
    .pipe(gulp.dest(path.fonts.dest));
});

gulp.task('copy:files', function() {
  gulp.src(path.files.list)
    .pipe(gulp.dest(path.build));
});

//
// .. Connect
//
gulp.task('connect', function() {
  plugin.connect.server({
    root: [path.build],
    port: 1111
  });
});

//
// .. Watch
//
gulp.task('watch', function() {
  // .. Layouts
  gulp.src([path.layouts.all, path.layouts.views.none])
    .pipe(plugin.watch([path.layouts.all, path.layouts.views.none]))
    .pipe(plugin.rubyHaml())
    .pipe(gulp.dest(path.build));

  gulp.watch(path.layouts.views.all, ['layouts:d']);

  // .. Stylesheets
  gulp.watch(path.stylesheets.all, ['stylesheets:d']);

  gulp.src(path.stylesheets.vendor.all)
    .pipe(plugin.watch(path.stylesheets.vendor.all))
    .pipe(gulp.dest(path.stylesheets.vendor.dest));
  
  // .. Javascripts
  gulp.src(path.javascripts.all)
    .pipe(plugin.watch(path.javascripts.all))
    .pipe(gulp.dest(path.javascripts.dest));

  // .. Images
  gulp.src(path.images.all)
    .pipe(plugin.watch(path.images.all))
    .pipe(gulp.dest(path.images.dest));

  // .. Fonts
  gulp.src(path.fonts.all)
    .pipe(plugin.watch(path.fonts.all))
    .pipe(gulp.dest(path.fonts.dest));

  // .. Files
  gulp.src(path.files.list)
    .pipe(plugin.watch(path.files.list))
    .pipe(gulp.dest(path.build));
});



//****************************************************************************************************
//
// .. RUN
//
//****************************************************************************************************
gulp.task('default', function() {
  gulp.start(
    'connect',
    'watch'
  );
});

//
// .. Development
//
gulp.task('d', ['clean'], function() {
  gulp.start(
    'layouts:d',
    'stylesheets:d',
    'stylesheets:v',
    'javascripts:d',
    'images:d',
    'copy:fonts',
    'copy:files'
  );
});

//
// .. Staging
//
gulp.task('s', ['clean'], function() {
  gulp.start(
    'layouts:s',
    'stylesheets:s',
    'stylesheets:v',
    'javascripts:s',
    'images:s',
    'copy:fonts',
    'copy:files'
  );
});

//
// .. Production
//
gulp.task('p', ['clean'], function() {
  gulp.start(
    'layouts:p',
    'stylesheets:p',
    'stylesheets:v',
    'javascripts:p',
    'images:p',
    'copy:fonts',
    'copy:files'
  );
});