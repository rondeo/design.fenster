var path = require('path')
var pug = require('pug')

module.exports = function (app) {
  app.get('/d/:page.html', function (req, res) {
    var template = pug.compileFile(
      path.join(__dirname, '../fixtures/' + req.params.page + '.pug')
    )
    res.set('Content-Type', 'text/html')
    res.send(template({
      require: require,
      casual: require('casual')
    }))
  })
}
