var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    fenster: ['index']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      __dirname
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
