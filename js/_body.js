// Project configuration.
uglify: {
	dev: {
		options: {
			mangle: {
				reserved: ['jQuery']
			}
		}
	}
	files: [{
		expand: true,
		src: ['dist/assets/js/*.js', '!dist/assets/js/*.min.js'],
		dest: 'dist/assets',
		cwd: '.',
		rename: function (dst, src) {
		j// To keep the source js files and make new files as `*.min.js`:
		// return dst + '/' + src.replace('.js', '.min.js');
		// Or to override to src:
		return src;
		}
	}]
}
