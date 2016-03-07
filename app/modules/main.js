/* global document */
'use strict'

var $ = require('jquery')
var Eev = require('eev')

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

  fetch: function () {
    $.ajax(this.$el.find('.js-fenster-content').data('url')).then(this.render.bind(this))
  },

  render: function (text) {
    this.$el.find('.js-fenster-content').html(text)
  },
}

module.exports = function ($el) {
  return Object.create(Fenster).init($el)
}
