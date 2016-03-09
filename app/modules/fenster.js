'use strict'

var $ = require('jquery')

var Fenster = {
  init: function (el) {
    var $el = $(el)
    var plugin = $el.data('plugin-fenster')
    if (plugin) {
      return plugin
    }

    $el.data('plugin-fenster', this)

    this.$el = $el
    this.el = this.$el.get(0)
    this.fetch()
    return this
  },

  url: function (url) {
    if (url === undefined) {
      return this.$el.data('url')
    } else {
      if (url) {
        this.$el.data('url', url)
        this.el.dataset.url = url
        this.fetch()
      } else {
        this.$el.empty()
      }
    }
  },

  fetch: function () {
    if (this.r) {
      this.r.abort()
    }

    this.r = $.ajax(this.$el.data('url'))
    this.r.then(this.render.bind(this))
    .fail(function () {
      this.$el.empty()
    }.bind(this))
  },

  render: function (text) {
    this.$el.html(text)
  },
}

module.exports = function (el) {
  return Object.create(Fenster).init(el)
}
