var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    'fenster': ['./index.js'],
    'fenster.poll': ['./index.js', './poll.js'],
    'fenster.poll.obergaden': ['./index.js', './poll.js', './obergaden.js'],
    'all': ['./index.js', './poll.js', './obergaden.js', './plugin', './plugin/obergaden.js'],
    dev: './dev'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },

  module: {
    rules: [{
      test: /css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer()]
          }
        }
      ]
    }, {
      test: /pug$/,
      loader: 'pug-loader'
    }]
  },

  externals: {
    jquery: 'jQuery'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'fixtures/index.pug',
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
