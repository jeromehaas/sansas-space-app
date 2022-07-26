const gulp = require('gulp');
const { series, parallel, dest } = require('gulp');

const { watchTask } = require('./lib/watch-task');
const { jsTask } = require('./lib/js-task');
const { scssTask } = require('./lib/scss-task');

const dev = series(scssTask, jsTask, watchTask);
const build = series(scssTask, jsTask );

module.exports = {
	default: dev,
	dev: dev,
	build: build
};