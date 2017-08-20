module.exports = function(grunt) {
    pkg: grunt.file.readJSON('package.json'),
    grunt.initConfig({
        uglify: {
            // 这里是uglify任务的配置信息
            options: {
                banner: '/*!create by yaopan <%= grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
//            static_mappings: {
//                files: [{
//                    src: 'js/index.js',
//                    dest: 'build/index.min.js'
//                }, {
//                    src: 'js/main.js',
//                    dest: 'build/main.min.js'
//                }],
//            }
			target: {
				expand: true,
				cwd: 'js/',
//				src: ['*.js', '!*.min.js'],
				src: '*.js',
				dest: 'build/'
			}
        },
        concat: {
            bar: {
                src: ["build/*.js"],
                dest: 'dest/all.min.js',
            },
            css: {
                src: ["build/*.min.css"],
                dest: 'dest/all.min.css'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css/',
//                    src: ['*.css', '!*.min.css'],
					src: '*.css',
                    dest: 'build',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            files: ['js/*.js', 'css/*css'],
            tasks: ['uglify', 'concat', 'cssmin']
        }

    });

//	grunt.loadNpmTasks('grunt-contrib-uglify');
//	grunt.loadNpmTasks('grunt-contrib-concat');
//	grunt.loadNpmTasks('grunt-contrib-cssmin');
//	grunt.loadNpmTasks('grunt-contrib-watch');
	require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['uglify', 'concat', 'cssmin', 'watch']);



}
