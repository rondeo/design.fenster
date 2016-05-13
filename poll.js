var fenster = require('./fenster')

fenster._init = fenster.init

var slice = [].slice

fenster.init = function () {
  fenster._init.apply(this, slice.call(arguments))

  var interval = this.$el.data('pollInterval')
  if (interval) {
    this.fetch()
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
