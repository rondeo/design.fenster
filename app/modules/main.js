/*global window*/
'use strict'

var $ = require('jquery')
var fenster = require('./fenster')

var fensters = $('.Fenster').toArray().map(function (el) {
  return fenster($(el))
})

$('.js-click').on('click', function (e) {
  var url = $(e.currentTarget).data('url')
  fensters[1].url(url)
})

var sto;
var i = 0
function myFunc() {
  var list = ['/h1.html', '/pag1.html', '/pag2.html', '/pag3.html']
  sto = setInterval(function () {
    console.log(fensters)
    fensters[0].url(list[i])
    i++
    if (i >= list.length) {
      clearTimeout(sto)
    }
  }, 2000)
}

myFunc()

window.fenster = fenster


