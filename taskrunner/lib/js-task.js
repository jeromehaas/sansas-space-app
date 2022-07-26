const gulp = require('gulp');
const webpackConfig = require('../../webpack.config');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const { dest } = require('gulp');
const { filePaths } = require('../configs/file-paths');

const jsTask = ( done ) => {
	gulp.src(filePaths.js.src[0])
		.pipe(plumber())
		.pipe(webpackStream(webpackConfig))
		.pipe(dest(filePaths.js.dist[0]));
	done();
};

module.exports = {
	jsTask
};