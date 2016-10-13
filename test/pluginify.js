/* global describe, it, expect, beforeEach, spyOn, spyOnEvent, xit */

'use strict'

var $ = require('jquery')
var baseObject = require('../fenster')
$.fn.fenster = 'old'
require('../plugin/index')

describe('<fenster>', function () {
  var $fenster
  var component

  beforeEach(function () {
    $fenster = $('.js-fenster')
    component = $fenster.fenster()

    spyOn(baseObject, 'render').and.callThrough()
    spyOn(baseObject, 'fetch').and.callThrough()

    spyOnEvent($fenster, 'fetch')
  })

  it('asd', function () {
    expect(1).toBe(1)
  })

  describe('plugin jquery', function () {
    it('deve publicar um plugin jquery', function () {
      expect($.fn.fenster).toBeDefined()
    })

    it('deve retornar o próprio objeto jquery', function () {
      expect(component instanceof $).toBe(true)
    })

    xit('deve inicializar e carregar no `domready` os elementos [data-fenster]', function () {
      var $autoFenster = $('[data-fenster]')
      expect($autoFenster.data('plugin-fenster')).toBeDefined()
    })

    it('deve retornar a mesma instância em caso de inicialização duplicada', function () {
      var c1 = $fenster.first().data('plugin-fenster')
      $fenster.fenster()
      var c2 = $fenster.first().data('plugin-fenster')
      expect(c1).toBeDefined()
      expect(c1).toBe(c2)
    })

    it('deve inicializar múltiplos componentes via composite pattern', function () {
      expect($fenster.length).toBeGreaterThan(1)
      $fenster.each(function () {
        var plugin = $(this).data('plugin-fenster')
        expect(baseObject.isPrototypeOf(plugin)).toBe(true)
      })
    })

    it('deve permitir a chamada de métodos estilo jquery', function () {
      $fenster.fenster('fetch')
      expect(baseObject.fetch).toHaveBeenCalled()

      $fenster.fenster('poll', 120)
      expect(baseObject.poll).toHaveBeenCalled()
      expect(baseObject.poll.calls.argsFor(0)).toEqual([120])
    })

    it('deve permitir chamada de métodos em todos os elementos do composite', function () {
      $fenster.fenster('fetch')
      expect($fenster.length).toBeGreaterThan(1)
      expect(baseObject.fetch.calls.count()).toBe($fenster.length)
    })

    xit('deve preservar a antiga instância do plugin jquery', function () {
      $.fn.fenster.noConflict()
      expect($.fn.fenster).toBe('old')
    })
  })
})
