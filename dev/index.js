/* global $ */
require('./styles.css')

require('../plugin')
require('../poll')
require('../plugin/obergaden')

$('.js-fenster').fenster().on('render', function () {
  // inicialize os outros plugins aqui.
  // exemplo:
  // $(this).find('audio').audiojs()
})

$('.js-obergaden').obergaden()
