var path = require('path')

module.exports = {
  entry: {
    dist: ['./index']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  externals: {
    jquery: 'jQuery'
  }
}
