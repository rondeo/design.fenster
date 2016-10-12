var $ = require('jquery')

module.exports = {
  init: function (el) {
    this.$el = el instanceof $ ? el : $(el)
    return this
  },

  get src () {
    return this.$el.data('src')
  },

  set src (value) {
    if (value) {
      this.$el.data('src', value)
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

    this.r.then(function (response, status, xhr) {
      _this.render(response, status, xhr)
      _this.$el.trigger('load')
    })
    .fail(function (jqXHR, status) {
      if (status !== 'abort') {
        _this.$el.trigger('fail')
      }
    })

    this.$el.trigger('fetch', this.r)
    return this.r
  },

  render: function (text) {
    this.$el.html(text !== undefined ? text : '')
    this.$el.trigger('render')
  }
}
