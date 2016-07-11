'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		projectJsDir: './assets/js/project',
		thirdPartyJsDir: './assets/js/thirdparty',
		closureDir: './assets/js/thirdparty/closure-library',
		publicJsDir: '../public/assets/js',
		publicStylesDir: '../public/assets/styles',
		publicImagesDir: '../public/assets/images/static',

		bower: {
			install: {
				options: {
					targetDir: '<%= thirdPartyJsDir %>',
					install: true,
					verbose: false,
					cleanTargetDir: false,
					cleanBowerDir: false,
					bowerOptions: {}
				},
			}
		},

		open: {
			dev: {
				path: 'http://graceux.craft.dev',
				app: 'Google Chrome'
			},
			release: {
				path: '',
				app: 'Google Chrome'
			},
		},

		watch: {
			html: {
				files: [ './*.{html,php}', '../craft/templates/**/*.{html,php,twig}' ],
				options: {
					livereload: true,
					interrupt: true,
					spawn: true,
				},
			},
			soy: {
				files: [ './assets/soy/*.soy' ],
				tasks: [ 'closureSoys' ],
			},
			js: {
				files: [ '<%= projectJsDir %>/**/*.js' ],
				tasks: [ 'closureDepsWriter' ],
				options: {
					livereload: true,
					interrupt: true,
					spawn: true,
				},
			},
			scss: {
				files: [ './assets/styles/scss/**/*.scss' ],
				tasks: [ 'compass' ]
			},
			css: {
				files: [ '<%= publicStylesDir %>/css/*.css' ],
				options: {
					livereload: true,
					interrupt: true,
					spawn: true,
				},
			},
			svg: {
				files: [ './assets/styles/fonts/fontcustom/*.svg' ],
				tasks: [ 'webfont' ]
			}
		},

		concat: {
			thirdparty: {
				src: [
					'<%= thirdPartyJsDir %>/js-signals.min.js',
					'<%= thirdPartyJsDir %>/crossroads.min.js',
					'<%= thirdPartyJsDir %>/two.min.js',
					'<%= thirdPartyJsDir %>/fastclick.js',
					'<%= thirdPartyJsDir %>/hammer.js',
					'<%= thirdPartyJsDir %>/greensock/TweenMax.min.js',
					'<%= thirdPartyJsDir %>/greensock/plugins/ScrollToPlugin.min.js',
					'<%= thirdPartyJsDir %>/greensock/plugins/ThrowPropsPlugin.min.js',
					'<%= thirdPartyJsDir %>/greensock/utils/Draggable.min.js'
				],
				dest: '<%= publicJsDir %>/thirdparty.js'
			}
		},

		clean: {},

		compass: {
			options: {
				sassDir: './assets/styles/scss',
				cssDir: '<%= publicStylesDir %>/css',
				fontsDir: '<%= publicStylesDir %>/fonts',
				imagesDir: '<%= publicImagesDir %>',
				spriteLoadPath: './assets/images',
				generatedImagesDir: '<%= publicImagesDir %>/generated',
				relativeAssets: true,
				noLineComments: true,
				assetCacheBuster: true,
				watch: false,
				require: [ 'breakpoint' ]
			},
			development: {
				options: {
					outputStyle: 'nested', //nested, expanded, compact, compressed
					environment: 'development',
				}
			},
			production: {
				options: {
					outputStyle: 'compressed', //nested, expanded, compact, compressed
					environment: 'production',
				}
			},
		},

		webfont: {
			icons: {
				src: './assets/styles/fonts/fontcustom/*.svg',
				dest: '<%= publicStylesDir %>/fonts/fontcustom',
				destCss: './assets/styles/scss',
				options: {
					stylesheet: 'scss',
					template: './assets/styles/templates/icons.css',
					relativeFontPath: '../fonts/fontcustom',
					htmlDemo: true,
					hashes: true,
					engine: 'node',
					templateOptions: {
						baseClass: 'icon',
						classPrefix: 'icon-',
						mixinPrefix: 'icon-'
					}
				}
			}
		},

		closureSoys: {
			all: {
				src: './assets/soy/*.soy',
				soyToJsJarPath: 'utils/SoyToJsSrcCompiler.jar',
				outputPathFormat: '<%= projectJsDir %>/templates/{INPUT_FILE_NAME}.js',
				options: {
					shouldGenerateJsdoc: true,
					shouldProvideRequireSoyNamespaces: true
				}
			}
		},

		closureDepsWriter: {
			options: {
				depswriter: '<%= closureDir %>/closure/bin/build/depswriter.py',
				root_with_prefix: '"<%= projectJsDir %> ../../../../project"',
			},

			main: {
				dest: '<%= projectJsDir %>/gux-deps.js'
			}
		},

		closureBuilder: {
			options: {
				builder: '<%= closureDir %>/closure/bin/build/closurebuilder.py',
				inputs: '<%= projectJsDir %>/gux.js',
			},

			main: {
				src: [ '<%= closureDir %>', '<%= projectJsDir %>' ],
				dest: '<%= publicJsDir %>/gux-build.js'
			}
		},

		closureCompiler: {
			options: {
				compilerFile: 'utils/compiler.jar',
				checkModified: true,
				compilerOpts: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS', //WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS
					language_in: 'ECMASCRIPT5_STRICT',
					externs: [ '<%= projectJsDir %>/externs.js', '<%= projectJsDir %>/universal-analytics-api.js' ],
					define: [ "'goog.DEBUG=false'" ],
					warning_level: 'verbose',
					jscomp_off: [ 'checkTypes', 'fileoverviewTags' ],
					summary_detail_level: 3
				},
				execOpts: {
					maxBuffer: 999999 * 1024
				},
			},

			main: {
				src: '<%= publicJsDir %>/gux-build.js',
				dest: '<%= publicJsDir %>/gux-compiled.js'
			}
		}

	} );

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-closure-tools' );
	grunt.loadNpmTasks( 'grunt-closure-soy' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-compass' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-open' );
	grunt.loadNpmTasks( 'grunt-webfont' );
	grunt.loadNpmTasks( 'grunt-bower-task' );

	// Default task.
	grunt.registerTask( 'default', [
		'bower',
		'compass',
		'webfont',
		'concat:thirdparty',
		'closureSoys',
		'closureDepsWriter',
		'open:dev',
		'watch'
	] );

	grunt.registerTask( 'dev', [
		'compass:development',
		'webfont',
		'concat:thirdparty',
		'closureSoys',
		'closureDepsWriter',
		'open:dev',
		'watch'
	] );

	grunt.registerTask( 'prod', [
		'compass:production',
		'webfont',
		'closureSoys',
		'closureBuilder',
		'closureCompiler',
		'concat'
	] );
};