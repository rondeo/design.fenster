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
      this.$content.empty()
      return
    }

    this.$el.data('url', url)
    this.fetch()
  },

  fetch: function () {
    $.ajax(this.$el.data('url'))
    .then(this.render.bind(this))
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
