var fenster = require('./fenster')

module.exports = function (el) {
  return Object.create(fenster).init(el)
}
