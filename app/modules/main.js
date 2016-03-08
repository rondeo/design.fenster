'use strict'

var $ = require('jquery')
var Fenster = require('./fenster')
var fenster = Fenster('.js-fenster')

$('.js-click').on('click', function (e) {
  var url = $(e.currentTarget).data('url')
  fenster.setSrc(url)
})

var sto;
var i = 0
function myFunc() {
  var list = ['/h1.html', '/pag1.html', '/pag2.html', '/pag3.html']
  sto = setInterval(function () {
    fenster.setSrc(list[i])
    i++
    if (i >= list.length) {
      clearTimeout(sto)
    }
  }, 2000)
}

myFunc()
