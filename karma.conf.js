
var webpackConfig = require('./webpack.config.js')
webpackConfig.devtool = 'eval'
webpackConfig.mode = 'development'

module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine-jquery', 'jasmine-ajax', 'jasmine'],

    files: [
      'test/test.webpack.js',
      { pattern: 'test/fixtures/*.html', included: false, served: true }
    ],

    exclude: [],

    preprocessors: {
      'test/test.webpack.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true
    },

    reporters: ['progress'],

    port: 9876,
    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [
      'Chrome'
    ],

    singleRun: false,

    concurrency: Infinity
  })
}
