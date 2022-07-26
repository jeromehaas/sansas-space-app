const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const { filePaths } = require('../configs/file-paths');
const { series, parallel, dest } = require('gulp');

const scssTask = ( done )  => {
	gulp.src(filePaths.scss.src)
	.pipe(plumber())
	.pipe(concat('main.min.css'))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(cssnano())
	.pipe(sourcemaps.write('.'))
	.pipe(dest(filePaths.scss.dist[0]));
	done();
};

module.exports = {
	scssTask
};