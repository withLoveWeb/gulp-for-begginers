const gulp = require('gulp'),
    scss = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify-es').default,
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminPngquant = require('imagemin-pngquant'),
    plumber = require('gulp-plumber'),
    shorthand = require('gulp-shorthand'),
    htmlmin = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('watch', function() {
    gulp.watch('../src/scss/*.scss', gulp.parallel('scss'))
    gulp.watch('../src/*.html', gulp.parallel('html'))
    gulp.watch('../src/js/main.js', gulp.parallel('js'))
    gulp.watch('../src/images', gulp.parallel('imageMinify'))
});

gulp.task('html', function() {
    return gulp.src('../src/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../build'))
        .pipe(browserSync.reload({stream: true}))
});
    
gulp.task('scss', function() {
    return gulp.src('../src/scss/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(autoprefixer({overrideBrowserslist: ['last 2 versions'], cascade: false}))
        .pipe(shorthand())
        .pipe(cleanCSS({
            debug: true,
            compatibility: '*'
          }, details => {
            console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../build/css'))
        .pipe(browserSync.reload({stream: true}))
});
    
    
gulp.task('js', function(){
    return gulp.src('../src/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../build/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js-libs', function(){
    return gulp.src(['node_modules/slick-carousel/slick/slick.js',])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../build/js'))
});

gulp.task('imageMinify', function (){
    return gulp.src('../src/images/*.{gif,png,jpg,svg,webp}')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imageminJpegRecompress({
        progressive: true,
        max: 80,
        min: 70
      }),
      imageminPngquant({quality: [0.6, 0.7]}),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('../build/img'))
})

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./../build",
            index: 'index.min.html'
        },
    });
});

    

gulp.task('default', gulp.parallel('scss', 'js', 'html', 'imageMinify', 'js-libs', 'browser-sync', 'watch'));