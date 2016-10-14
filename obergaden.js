'use strict'

var $ = require('jquery')
var fenster = require('./fenster')
var slice = [].slice

var _render = fenster.render
var _init = fenster.init

fenster.init = function () {
  _init.apply(this, slice.call(arguments))
  this.group = this.$el.data('group')
  this.group && this.$el.on('updateRequested', this.applyRender.bind(this))
  this.response = ''
  return this
}

fenster.render = function (response, status, xhr) {
  if (this.group === undefined) {
    return _render.apply(this, slice.call(arguments))
  }

  if (this.response !== response) {
    this.response = response
    this.$el
      .addClass('is-pending')
      .trigger('updateAvailable')
  }
}

fenster.applyRender = function () {
  if (this.$el.is('.is-pending')) {
    this.$el.removeClass('is-pending')
    return _render.call(this, this.response)
  }
}

var obergaden = {
  init: function (el) {
    this.$el = el instanceof $ ? el : $(el)
    this.flush = this.flush.bind(this)

    var group = this.$el.data('group')
    if (group !== void 0) {
      this.$el.on('click', this.flush)
      this.parts = $('.js-fenster[data-group="' + group + '"]')
        .on('updateAvailable', this.handleIncomingUpdate.bind(this))
    }

    return this
  },

  get pendingOperations () {
    return this.parts ? this.parts.filter('.is-pending').length : 0
  },

  handleIncomingUpdate: function () {
    this.$el.addClass('is-pending').trigger('updateAvailable')
  },

  flush: function () {
    if (this.parts && this.parts.length > 0) {
      this.parts.trigger('updateRequested')
    }
    this.$el.removeClass('is-pending')
  }
}

module.exports = function (el) {
  return Object.create(obergaden).init(el)
}
