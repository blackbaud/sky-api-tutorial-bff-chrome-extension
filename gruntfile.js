module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        buildPath: grunt.option('buildpath') || 'build',
        concat_sourcemap: {
            options: {
                sourcesContent: true,
                sourceRoot: '../..'
            },
            background: {
                files: {
                    '<%= buildPath %>/js/background.js': [
                        'bower_components/jquery/dist/jquery.min.js',
                        'src/lib/yaml.min.js',
                        'src/scripts/background.js'
                    ]
                }
            },
            content: {
                files: {
                    '<%= buildPath %>/js/content.js': [
                        'src/lib/inboxsdk.js',
                        'bower_components/handlebars/handlebars.min.js',
                        'src/scripts/content.js'
                    ]
                }
            }
        },
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['*'],
                    dest: '<%= buildPath %>/img/'
                }]
            }
        },
        sass: {
            options: {
                style: 'compressed'
            },
            app: {
                files: {
                    '<%= buildPath %>/css/styles.css': 'src/sass/styles.scss'
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            background: {
                options: {
                    sourceMapIn: '<%= buildPath %>/js/background.js.map',
                },
                src: ['<%= buildPath %>/js/background.js'],
                dest: '<%= buildPath %>/js/background.min.js'
            },
            content: {
                options: {
                    sourceMapIn: '<%= buildPath %>/js/content.js.map',
                },
                src: ['<%= buildPath %>/js/content.js'],
                dest: '<%= buildPath %>/js/content.min.js'
            }
        },
        watch: {
            sass: {
                files: ['src/**/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['src/scripts/**/*.js'],
                tasks: ['concat_sourcemap', 'uglify']
            }
        }
    });

    grunt.registerTask('build', [
        'concat_sourcemap',
        'uglify',
        'sass',
        'copy',
        'watch'
    ]);

    grunt.registerTask('default', 'build');
};
