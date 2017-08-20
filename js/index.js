module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            // 这里是uglify任务的配置信息
            options: {
                banner: '/*!create by yaopan <%= grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            static_mappings: {
                files: [{
                    src: 'js/index.js',
                    dest: 'build/index.min.js'
                }, {
                    src: 'js/main.js',
                    dest: 'build/main.min.js'
                }],
            }
        },
        concat: {
            bar: {
                src: ["build/*.js"],
                dest: 'dest/all.min.js',
            },
        },
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['uglify', 'concat']);
}
