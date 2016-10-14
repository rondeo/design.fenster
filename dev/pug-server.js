var path = require('path')
var pug = require('pug')
var avatar = require('avatar-generator')()

module.exports = function (app) {
  app.get('/d/:page.html', function (req, res) {
    var template = pug.compileFile(
      path.join(__dirname, '../fixtures/' + req.params.page + '.pug')
    )
    res.set('Content-Type', 'text/html')

    avatar(Math.random(), 'male', 75).toBuffer(function (err, buffer) {
      if (err) return
      var datasrc = buffer.toString('base64')
      res.send(template({
        casual: require('casual'),
        avatar: datasrc
      }))
    })
  })
}
