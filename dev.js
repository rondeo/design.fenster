/* global $ */
require('./plugin')
require('./poll')
require('./plugin/obergaden')

$('.js-fenster').fenster().on('render', function () {
  var $this = $(this)
  $this.fadeOut(200, function () {
    $this.fadeIn(200)
  })
})

$('.js-obergaden').obergaden()
