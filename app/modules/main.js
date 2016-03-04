/* global document */
'use strict'

var $ = require('jquery')

// var initEvents = require('./initEvents').initEvents

var Fenster = {

  init: function (selector) {
    if (typeof selector === 'string') {
      this.el = document.querySelector(selector)
    } else {
      this.el = selector
    }

    this.$el = $(this.el)
    this.events = {
      clear:{ typesEvent:'click', selector:'.js-fenster-clear', container:this.el },
      fetch:{ typesEvent:'click', selector:'.js-fenster-render', container:this.el },
      initRender:{ typesEvent:'load', selector:'.js-fenster-content', container:this.el },
      selectUrl:{ typesEvent:'click', selector:'.js-fenster-url', container:this.el },
    }
    this.initEvents(this)
    this.initRender()
  },

  initEvents: function (object) {
    var events = object.events
    for (var evt in events) {
      var objectEvt = events[evt]
      var typeEvt = objectEvt.typesEvent
      var selector = objectEvt.selector
      var $container = $(objectEvt.container)
      $container.on(typeEvt, selector, object[evt].bind(this))
    }
  },

  initRender: function () {
    this.fetch()
  },

  selectUrl: function (e) {
    var url = e.currentTarget.dataset.url
    this.$el.find('.js-fenster-content').data()['url'] = url
    this.fetch()

    // console.log(e.currentTarget.dataset['url'])
  },

  fetch: function (e) {
    if (e) {
      e.stopPropagation()
    }

    $.ajax(this.$el.find('.js-fenster-content').data('url')).then(this.render.bind(this))
  },

  render: function (text) {
    this.$el.find('.js-fenster-content').html(text)
  },

  clear: function (e) {
    e.stopPropagation()
    this.$el.find('.js-fenster-content').empty()
    console.log('um')
  }

}

$('.js-fenster').each(function () {
  var fenster = Object.create(Fenster)
  fenster.init(this)
})
