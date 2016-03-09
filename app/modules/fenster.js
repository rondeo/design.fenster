/* global document */
'use strict'

var $ = require('jquery')

var Fenster = {
  init: function (selector) {
    if (typeof selector === 'string') {
      this.el = document.querySelector(selector)
      if (!this.el) {
        return undefined
      }
    } else {
      this.el = selector
    }

    this.$el = $(this.el)
    this.fetch()
    return this
  },

  url: function (url) {
    if (url === undefined) {
      return this.$el.data('url')
    } else {
      if (url) {
        this.$el.data('url', url)
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
