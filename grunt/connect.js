module.exports = {
  options: {
    port: 8001,
    livereload: 35730,
    hostname: 'localhost'
  },
  dev: {
    options: {
      middleware: function(connect, options, middlewares) {

        middlewares.unshift(function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', '*')
          next()
        })

        var serveStatic = require('serve-static')

        middlewares.unshift(serveStatic('app'))
        middlewares.unshift(serveStatic('dist'))
        middlewares.unshift(serveStatic('node_modules'))

        return middlewares

      }
    }
  }
}
