/* global $ */

require('./plugin')
require('./poll')
require('./plugin/obergaden')

$('.js-fenster').fenster()
.on('render', function () {
  $(this).fadeOut().fadeIn()
})

$('.js-obergaden').obergaden()
