const gulp = require('gulp')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
// const rename = require('gulp-rename');
const cssBase64 = require('gulp-css-base64');
// const base64 = require('gulp-base64');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const tap = require('gulp-tap')

// 能被转成base64 的最大文件大小
const IMG_LIMIT_SIZE = 600 * 1024

// 清空目录
gulp.task('clean', function() {
  return gulp.src('dist', { allowEmpty: true }).pipe(clean());
})

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
  cb()
}


// 打包js
const handleJs = (cb) => {
  const { src, dest } = gulp
  src('./entry/*.js')
  .pipe(uglify())
  .pipe(dest('./dist/js', { allowEmpty: true }))
  cb()
}

// 打包html
const handleHtml = (cb) => {
  const { src, dest } = gulp
  src('public/*.html')
  .pipe(replace('__STYLE__', './css/index.css'))
  .pipe(replace('__JS__', './js/index.js'))
  .pipe(dest('./dist/'))
  cb()
}

const handleImg = (cb) => {
  const { src, dest } = gulp
  src('./src/images/*', { allowEmpty: true })
  .pipe(tap(function(file, t) {
    console.log(file.contents.length)
    if (file.contents.length > IMG_LIMIT_SIZE) {
      return t.through(dest, ['./dist/images'])
    }
  }))
  cb()
}

gulp.task('default', gulp.series('clean', gulp.parallel(handleImg, handleHtml, handleScss, handleJs)))
