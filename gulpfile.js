var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

//report js errors
gulp.task('jshint', function(){
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//transpile scss to css
// Compile Sass task 

gulp.task('sass', function() { 
  return gulp.src('scss/*.scss') 
  //includePaths makes sure that bourbon and neat are part of the 'sass' task path.
    .pipe(sass({ includePaths: require('node-bourbon', 'node-neat').includePaths, 
                includePaths: require('node-neat').includePaths })) 
    .pipe(gulp.dest('css')); 
});

//gulp.task('sass', function(){
//  return gulp.src('scss/*.scss')
//    .pipe(sass())
//    .pipe(gulp.dest('css'));
//});

//watch for changes
gulp.task('watch', function(){
  gulp.watch('js/*.js', ['jshint']);
  gulp.watch('scss/*.scss', ['sass']);
});

//default task
gulp.task('default', ['jshint', 'sass', 'watch']);

//minify index.html
gulp.task('html', function(){
  return gulp.src('index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/'));
});

//concat and minify js files
gulp.task('scripts', function(){
  return browserify('js/main.js')
    //.add('./js/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

//concat and minify compiled css files
gulp.task('styles', function(){
  return gulp.src('css/*.css')
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'));
});

//image optimization
gulp.task('images', function(){
  return gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'));
});

//build task
gulp.task('build', ['jshint', 'sass', 'html', 'scripts', 'styles', 'images']);