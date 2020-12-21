const gulp = require('gulp')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const postcss = require('gulp-postcss')
const cssBase64 = require('gulp-css-base64')
const sass = require('gulp-sass')
const replace = require('gulp-replace')
const tap = require('gulp-tap')
const babel = require('gulp-babel')
const connect = require('gulp-connect')
const browserify = require('gulp-browserify')

// 能被转成base64 的最大文件大小
const IMG_LIMIT_SIZE = 600 * 1024

// 打包scss
const handleScss = (cb) => {
  const { src } = gulp
  src('./src/style/index.scss')
    .pipe(sass())
    .pipe(postcss())
    .pipe(cssBase64({
      maxWeightResource: IMG_LIMIT_SIZE, // 小于limit 才会被转
      extensionsAllowed: ['.gif', '.jpg', '.png']
    }))
    .pipe(gulp.dest('./dist/css', { allowEmpty: true }))
    .pipe(connect.reload())
  cb()
}


// 打包js
const handleJs = (cb) => {
  const { src, dest } = gulp
  src('./entry/*.js')
    .pipe(babel({
      'presets': [
        [
          '@babel/preset-env', {
            'targets': {
              'ie': '7',
            },
            'corejs': '3',
            'useBuiltIns': 'usage',
            // 'modules': 'commonjs',
          }
        ]
      ]
    }))
    .pipe(browserify())
    .pipe(dest('./dist/js', { allowEmpty: true }))
    .pipe(connect.reload())
  cb()
}

// 打包html
const handleHtml = (cb) => {
  const { src, dest } = gulp
  src('public/*.html')
    .pipe(replace('__STYLE__', './css/index.css'))
    .pipe(replace('__JS__', './js/index.js'))
    .pipe(dest('./dist/'))
    .pipe(connect.reload())
  cb()
}

// 打包图片
const handleImg = (cb) => {
  const { src, dest } = gulp
  src('./src/images/*', { allowEmpty: true })
    .pipe(tap(function (file, t) {
      // console.log(file.contents.length)
      if (file.contents.length > IMG_LIMIT_SIZE) {
        return t.through(dest, ['./dist/images'])
      }
    }))
    .pipe(connect.reload())
  cb()
}

// 清空目录
gulp.task('clean', function () {
  return gulp.src('dist', { allowEmpty: true }).pipe(clean())
})


gulp.task('build', gulp.series('clean', gulp.parallel(handleImg, handleHtml, handleScss, handleJs)))

// webserver
gulp.task('devSerever', function () {
  return connect.server({
    root: 'dist',
    port: 2345,
    livereload: true
  })
})

// LIVELOAD
gulp.task('watch', () => {
  gulp.watch(['./src/**/*.js', './entry/**/*.js'], gulp.series(handleJs))
  gulp.watch(['./src/style/**/*.scss'], gulp.series(handleScss))
  gulp.watch('./src/images/*', gulp.series(handleImg))
  gulp.watch('./public/*.html', gulp.series(handleHtml))
})

gulp.task('serve', gulp.series('build', gulp.parallel('devSerever', 'watch')))
