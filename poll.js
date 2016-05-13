var fenster = require('./fenster')

fenster._init = fenster.init

fenster.init = function () {
  fenster._init.apply(this, [].slice.call(arguments))

  this.interval = this.$el.data('pollInterval')
  if (this.interval) {
    this.fetch()
    this.poll()
  }

  this.errors = 0

  return this
}

fenster._poll = function () {
  var _this = this
    // checar se está na DOM
  if (_this.$el.closest(document.documentElement).length) {
    _this.fetch()
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
        _this.stopPoll()
      }
    })
  } else {
    _this.stopPoll()
  }
}

fenster.poll = function (seconds, headStart) {
  seconds = seconds || this.interval
  var _this = this
  this.stopPoll()
  this.pollId = setInterval(function () {
    _this._poll()
  }, seconds * 1000)

  if (headStart) {
    this.fetch()
  }

  return this.pollId
}

fenster.stopPoll = function () {
  if (this.pollId) {
    clearInterval(this.pollId)
  }
}
