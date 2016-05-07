var fenster = require('fenster')

fenster.poll = function (seconds) {
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
}

fenster.stopPoll = function () {
  if (this.pollId) {
    clearInterval(this.pollId)
  }
}
