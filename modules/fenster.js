'use strict'

var $ = require('jquery')

module.exports = {
  init: function (el) {
    this.$el = el instanceof $ ? el : $(el)
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
    this.r = $.ajax({
      url: this.src,
      type: 'GET',
      dataType: 'html'
    })
    this.r.then(function (response) {
      _this.render(response)
      _this.$el.trigger('load')
    })
    .fail(function (jqXHR, status) {
      if (status !== 'abort') {
        _this.$el.trigger('fail')
      }
      _this.$el.empty()
    })

    this.$el.trigger('fetch', this.r)

    return this.r
  },

  poll: function (seconds) {
    var _this = this
    this.stopPoll()
    this.pollId = setInterval(function () {
      // checar se está na DOM
      if (_this.$el.closest(document.documentElement).length) {
        _this.fetch()
      } else {
        _this.stopPoll()
      }
    }, seconds * 1000)
    return this.pollId
  },

  stopPoll: function () {
    if (this.pollId) {
      clearInterval(this.pollId)
    }
  },

  render: function (text) {
    this.$el.html(text)
  }
}
