module.exports = function(grunt) {
    grunt.initConfig({

        // nodemon watches for changes and restarts app
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    ext: 'js',
                    ignore: [ 'node_modules/**', 'public/lib/**' ],
                    args: grunt.option.flags()
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    'node_modules/**/*.js',
                    'public/lib/**/*.js'
                ]
            },
            javascripts: {
                src: [ '**/*.js' ]
            }
        },
        open: {
            coverage : {
                path: 'coverage/index.html'
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test'], // multiple folders also works
                options: {
                    coverage: false, // this will make the grunt.event.on('coverage') event listener to be triggered
                    check: {
                        statements: 75,
                        branches: 50,
                        lines: 75
                    },
                    root: 'app',
                    reportFormats: ['html']
                }
            }
        },
        mochaTest: {
            options: 'test/mocha.opts',
            src: ['test/**/*.js']
        }
    });

    [
        'grunt-nodemon',
        'grunt-contrib-jshint',
        'grunt-cucumber',
        'grunt-mocha-istanbul',
        'grunt-open',
        'grunt-mocha-test'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    grunt.registerTask('test', [
        'mocha_istanbul:coverage',
        'open:coverage'
    ]);

    grunt.registerTask('coverage', [
        'mocha_istanbul:coverage',
        'open:coverage'
    ]);

    grunt.registerTask('cucumber', ['cucumberjs']);

    grunt.registerTask('default', [
        'jshint',
        'nodemon:dev'
    ]);

};
