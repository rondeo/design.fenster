var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var pug = require('pug')

module.exports = {
  entry: {
    dist: ['./index'],
    dev: './dev'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'fixtures/index.html',
      chunks: ['dev']
    }),
    new CopyWebpackPlugin([
      { from: 'fixtures/*' },
      { from: 'node_modules/jquery/dist/jquery.js', to: 'jquery.js' },
      { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css'}
    ])
  ],
  devServer: {
    setup: function (app) {
      app.get('/d/:page.html', function (req, res) {
        var template = pug.compileFile('./fixtures/' + req.params.page + '.pug')
        res.set('Content-Type', 'text/html')
        res.send(template())
      })
    }
  }
}
