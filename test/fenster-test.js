/* global jasmine, describe, it, expect, beforeEach, loadFixtures, afterEach */

'use strict'

var $ = require('jquery')
var responses = require('./fixtures/responses')

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/'

var fenster = require('../modules/fenster.js')

describe('<fenster>', function () {

  var $fenster
  var component

  beforeEach(function () {
    loadFixtures('markup.html')

    jasmine.Ajax.install()

    $fenster = $('#page1')
    component = fenster($fenster)
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
  })

  describe('antes do primeiro fetch', function () {

    it('deve retornar o component depois da inicialização', function () {
      expect(component).toBeDefined()
    })

    it('deve retornar a mesma istância em caso de inicialização duplicada', function () {
      var component2 = fenster($fenster)
      expect(component2).toBe(component)
    })

  })

  describe('depois do fetch', function () {

    var mostRecentRequest = function () {
      return jasmine.Ajax.requests.mostRecent()
    }

    describe('quando houver uma requisição', function () {
      var request
      beforeEach(function () {
        component.fetch()
        request = mostRecentRequest()
      })

      describe('com sucesso', function () {
        beforeEach(function () {
          request.respondWith(responses.page1)
        })

        it('deve fazer uma requisição em data-url', function () {
          expect(request.url).toBe(component.src)
          expect(request.method).toBe('GET')
        })

        it('deve renderizar texto de resposta da request dentro do component', function () {
          expect($fenster).toContainHtml('page1')
        })
      })

      describe('com erro', function () {
        beforeEach(function () {
          request.respondWith(responses.error)
        })

        it('deve limpar o component', function () {
          expect($fenster).toBeEmpty()
        })
      })
    })

    describe('ao setar o atributo url', function () {
      beforeEach(function () {
        $fenster.html('stub')
      })

      describe('vazio', function () {
        beforeEach(function () {
          component.fetch = jasmine.createSpy('fetch')
          component.src = ''
        })

        it('deve limpar o componente', function () {
          expect($fenster).toBeEmpty()
        })

        it('não deve chamar o método fetch', function () {
          expect(component.fetch).not.toHaveBeenCalled()
        })
      })

      it('deve recarregar o conteudo', function () {
        component.src = '/page1.html'
        mostRecentRequest().respondWith(responses.page1)
        expect($fenster).toContainHtml('page1')
      })
    })

    describe('quando houver múltiplas requisições', function () {

      it('deve considerar sempre a última', function (done) {

        component.fetch()

        var firstRequest = mostRecentRequest()
        setTimeout(function () {
          firstRequest.respondWith(responses.page1)
        }, 100)

        component.fetch()

        var secondRequest = mostRecentRequest()
        setTimeout(function () {
          secondRequest.respondWith(responses.page2)
        }, 50)

        setTimeout(function () {
          expect('page2').toBe($fenster.html())
          done()
        }, 150)

      })

    })

  })

})
