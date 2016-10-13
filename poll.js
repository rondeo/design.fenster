'use strict'

var fenster = require('./fenster')
var slice = [].slice

var _init = fenster.init

fenster.init = function () {
  _init.apply(this, slice.call(arguments))

  var interval = this.$el.data('pollInterval')
  var headStart = this.$el.data('headStart')
  if (interval) {
    if (headStart !== undefined) {
      this.fetch()
    }
    this.poll(interval)
  }

  this.errors = 0

  return this
}

fenster._poll = function () {
  var _this = this
    // checar se está na DOM
  if (this.$el.closest(document.documentElement).length) {
    this.fetch()
    .then(function () {
      _this.errors = 0
    })
    .fail(function (jqXHR, status) {
      if (status !== 'abort') {
        _this.errors++
      }
    })
    .always(function () {
      if (_this.errors > 4) {
        _this.halt()
      }
    })
  } else {
    this.halt()
  }
}

fenster.poll = function (seconds, headStart) {
  var _this = this
  this.halt()
  this.pollId = setInterval(function () {
    _this._poll()
  }, seconds * 1000)

  if (headStart) {
    this.fetch()
  }

  return this.pollId
}

fenster.halt = function () {
  if (this.pollId) {
    clearInterval(this.pollId)
  }
}
