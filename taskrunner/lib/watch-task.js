const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const { watch } = require('gulp');
const { filePaths } = require('../configs/file-paths');
const { scssTask } = require('../lib/scss-task');
const { jsTask } = require('../lib/js-task');

const watchTask = () => {
	browserSync.init({
		server: { baseDir: '../' },
		open: false,
		port: 3007,
		ui: { port: 3008 }
	});
	watch(filePaths.scss.src, scssTask).on('change', browserSync.reload);
	watch(filePaths.js.src, jsTask).on('change', browserSync.reload);
	watch(filePaths.html.src).on('change', browserSync.reload);
};

module.exports = {
	watchTask
};