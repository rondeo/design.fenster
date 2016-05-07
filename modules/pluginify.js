'use strict'

var $ = require('jquery')

module.exports = function (pluginName, factory) {
  var old = $.fn[pluginName]

  $.fn[pluginName] = function (optionsOrMethod) {
    return this.each(function () {
      var plugin = $.data(this, 'plugin-' + pluginName)
      if (!plugin) {
        plugin = Object.create(factory)
        $.data(this, 'plugin-' + pluginName, plugin.init(this, optionsOrMethod))
      } else if (plugin[optionsOrMethod]) {
        var args = Array.prototype.slice.call(arguments, 1)
        plugin[optionsOrMethod].apply(plugin, args)
      }
    })
  }

  $.fn[pluginName].noConflict = function () {
    $.fn[pluginName] = old
    return this
  }
}

