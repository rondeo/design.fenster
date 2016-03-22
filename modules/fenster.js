'use strict'

var $ = require('jquery')

var fenster = {

  init: function (el) {
    var $el = $(el)
    var plugin = $el.data('plugin-fenster')
    if (plugin) { return plugin }

    this.$el = $el.data('plugin-fenster', this)
    this.fetch()
    return this
  },

  get src () {
    return this.$el.data('src')
  },

  set src (src) {
    if (src) {
      this.$el.data('src', src)
      this.fetch()
    } else {
      this.$el.empty()
    }
  },

  fetch: function () {
    if (this.r) {
      this.r.abort()
    }

    var _this = this
    this.r = $.ajax(this.src)
    this.r.then(function (response) {
      _this.render(response)
      _this.$el.trigger('load')
    })
    .fail(function () {
      _this.$el.empty()
    })
  },

  render: function (text) {
    this.$el.html(text)
  }
}

module.exports = function (el) {
  return Object.create(fenster).init(el)
}
