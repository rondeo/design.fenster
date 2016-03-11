/*global window*/
'use strict'

var $ = require('jquery')
var fenster = require('./fenster')
var dragula = require('dragula')
var prismjs = require('prismjs')
window.pjs = prismjs

/* Drágula - DragAnd Drop */
dragula([$('.drop'), $('.Fenster')], {
  isContainer: function (el) {
    return el.classList.contains('drop')
  },

  copy: true,

  accepts: function (el, target) {
    return target !== $('.Fenster')
  },
}).on('drop', function (el, target) {
  fenster(target).url($(el).data('url'))
})
/* Drágula - DragAnd Drop */

$('.FensterCode').toArray().map(function (el) {
  var $el = $(el).on('load', function () {
    var txt = $el.html()
    $el.empty().text(txt)
    $el.html(prismjs.highlight($el.html(), prismjs.languages.html))
  })

  fenster($el)
})

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
    fensters[1].url(list[i])
    i++
    if (i >= list.length) {
      clearTimeout(sto)
    }
  }, 2000)
}

myFunc()
