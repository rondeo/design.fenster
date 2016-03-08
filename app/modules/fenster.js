/* global document */
'use strict'

var $ = require('jquery')

var Fenster = {
  init: function (selector) {
    if (typeof selector === 'string') {
      this.el = document.querySelector(selector)
    } else {
      this.el = selector
    }

    this.$el = $(this.el)
    return this
  },

  setSrc: function (url) {
    if (!url) {
      this.$el.empty()
      return
    }

    this.$el.data('url', url)
    this.fetch()
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
