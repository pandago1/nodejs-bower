module.exports = (grunt) ->
	pkg: grunt.file.readJSON 'package.json',
	grunt.initConfig
		uglify:
				options:
					banner: '/*!create by yaopan <%= grunt.template.today("yyyy-mm-dd")%>/\n'
					spawn: false
				target:
					expand: true
					cwd: 'src/js/'
				#	src: ['*.js', '!.min.js']
					src: '*.js'
					dest: 'dist/js'
		concat:
			bar:
				src: ['build/*.js']
				dest: 'dest/all.min.js'
			css:
				src: ['build/.min.css']
				dest: 'dest/all.min.css'
		cssmin:
			target:
				files:[
					expand: true
					cwd: 'src/css/'
				#	src: ['*.css', '!*.min.css']
					src: '*.css'
					dest: 'dist/css'
					ext: '.css'
				]
		coffee: 
			compile:
			#	spawn: false
				files: [
					expand: true
					cwd: 'src/coffee/'
					src: ['*.coffee']
					dest: 'src/js/'
					ext: '.js'
				]
		watch:
			options:
				nospawn: true
			#js:
			#	files: ['src/js/*.js', 'src/css/*.css']
			#	tasks: ['uglify', 'concat', 'cssmin']
			coffee:
				files: ['src/coffee/*.coffee']
				tasks: 'newer:coffee'
	
	# grunt.loadNpmTasks 'grunt-contrib-uglify'
	# grunt.loadNpmTasks 'grunt-contrib-concat'
	# grunt.loadNpmTasks 'grunt-contrib-cssmin'
	# grunt.loadNpmTasks 'grunt-contrib-watch'
	# grunt.loadNpmTasks 'grunt-contrib-coffee'
	require('load-grunt-tasks') grunt
	# grunt.registerTask 'default', ['uglify', 'concat', 'cssmin', 'watch']
	grunt.registerTask 'dist', ['uglify', 'cssmin']
	grunt.registerTask 'x-coffee', ['coffee', 'watch']
