var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var pug = require('pug')

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
      { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css' }
    ])
  ],
  devServer: {
    setup: function (app) {
      app.get('/d/:page.html', function (req, res) {
        var template = pug.compileFile('./fixtures/' + req.params.page + '.pug')
        res.set('Content-Type', 'text/html')
        require('avatar-generator')()(Math.random(), 'male', 75)
        .toBuffer(function (err, buffer) {
          if (err) return
          var datasrc = buffer.toString('base64')
          res.send(template({
            casual: require('casual'),
            avatar: datasrc
          }))
        })
      })
    }
  }
}
