'use strict'

var $ = require('jquery')
var slice = [].slice

module.exports = function (pluginName, factory) {
  var old = $.fn[pluginName]

  $.fn[pluginName] = function (optionsOrMethod) {
    var args = slice.call(arguments, 1)
    return this.each(function () {
      var plugin = $.data(this, 'plugin-' + pluginName)
      if (!plugin) {
        plugin = Object.create(factory)
        $.data(this, 'plugin-' + pluginName, plugin.init(this, optionsOrMethod))
      } else if (plugin[optionsOrMethod]) {
        plugin[optionsOrMethod].apply(plugin, args)
      }
    })
  }

  $.fn[pluginName].factory = factory

  $.fn[pluginName].noConflict = function () {
    $.fn[pluginName] = old
    return this
  }
}

