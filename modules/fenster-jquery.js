var $ = require('jquery')
var fenster = require('./fenster')

var pluginName = 'fenster'

$.fn[pluginName] = function (optionsOrMethod) {
  return this.each(function () {
    var plugin = $.data(this, 'plugin-' + pluginName)
    if (!plugin) {
      plugin = fenster(this)
      // $.data(this, 'plugin-' + pluginName, plugin)
    } else if (plugin[optionsOrMethod]) {
      plugin[optionsOrMethod]()
    }
  })
}
