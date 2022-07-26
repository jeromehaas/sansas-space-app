const filePaths = {
	html: {
		src: '../index.html',
		dist: '',
		},
	js: {
		src: ['../src/js/**/*.js'],
		dist: ['../js']
	},
	scss: {
		src: ['../src/scss/configs/reset.scss', '../src/scss/configs/variables.scss', '../src/scss/configs/global.scss', '../src/scss/sections/*.scss'],
		dist: ['../css']
	},
};

module.exports = {
	filePaths
};