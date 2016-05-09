var fenster = require('fenster')

fenster._init = fenster.init

fenster.init = function () {
  fenster._init.apply(this, [].slice.call(arguments))

  this.pollInterval = this.$el.data('pollInterval')
  if (this.pollInterval) {
    this.fetch()
    this.poll()
  }

  return this
}

fenster.poll = function (seconds, headStart) {
  seconds = seconds || this.pollInterval
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
