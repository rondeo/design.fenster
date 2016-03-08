/* global jasmine, describe, it, expect, beforeEach, loadFixtures, afterEach */

'use strict'

var $ = require('jquery')
jasmine.getFixtures().fixturesPath = 'base/app/test/fixtures/'

var fenster = require('../modules/main.js')

describe('<fenster>', function () {

  var $fenster
  var component

  beforeEach(function () {
    loadFixtures('markup.html')
    $fenster = $('#page1')
    component = fenster($fenster)
  })

  describe('antes do primeiro fetch', function () {

    it('deve retornar o component depois da inicialização', function () {
      expect(component).toBeDefined()
    })

    it('deve ficar em branco', function () {
        expect($fenster).toBeEmpty()
    })

    it('não deve possuir altura', function () {
      expect($fenster.height()).toBe(0)
    })

    it('deve ter a largura do parent', function () {
      expect($fenster.width()).toBe($fenster.parent().width())
    })

  })

  describe('render', function () {

    beforeEach(function () {
      jasmine.Ajax.install()
    })

    afterEach(function() {
      jasmine.Ajax.uninstall()
    })

    describe('fetch', function () {

      var request

      beforeEach(function () {
        component.fetch()
        request = jasmine.Ajax.requests.mostRecent()
      })

      describe('quando houver sucesso na requisição', function () {

        beforeEach(function () {
          request.respondWith({
            status: 200,
            contentType: 'text/html;charset=UTF-8',
            responseText: '<b>oi</b>'
          })
        })

        it('deve fazer uma requisição em data-url', function () {
          expect(request.url).toBe($fenster.data('url'))
          expect(request.method).toBe('GET')
        })

        it('deve renderizar texto de resposta da request dentro do component', function () {
          expect($fenster).toContainHtml(request.responseText)
        })

      })

      describe('quando houver erro na requisição', function () {

        beforeEach(function () {
          $fenster.html('stub')
          request.respondWith({
            status: 500,
            contentType: 'text/html;charset=UTF-8',
            responseText: '<b>Erro 500</b>'
          })
        })

        it('deve limpar o component', function () {
          expect($fenster).toBeEmpty()
        })

      })

    })

  })

})
