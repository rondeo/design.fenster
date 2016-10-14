var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    'fenster': ['./index'],
    'fenster.poll': ['./index', './poll'],
    'fenster.poll.obergaden': ['./index', './poll', './obergaden'],
    'all': ['./index', './poll', './obergaden', './plugin', './plugin/obergaden'],
    dev: './dev'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  module: {
    loaders: [{
      test: /css$/,
      loader: 'style!css?importLoaders=1!postcss'
    }]
  },

  postcss: () => [
    autoprefixer({ browsers: 'last 2 versions' })
  ],

  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'fixtures/index.html',
      chunks: ['dev']
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/jquery/dist/jquery.js', to: 'jquery.js' },
      { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css' }
    ])
  ],
  devServer: {
    setup: function (app) {
      require('./dev/pug-server')(app)
    }
  }
}
