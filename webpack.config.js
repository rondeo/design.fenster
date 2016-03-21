
var webpack = require('webpack')

module.exports = {
  entry: {
    fenster: ['fenster']
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js'
  },
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      __dirname + '/modules'
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    })
  ]
}
