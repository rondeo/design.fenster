/* global jasmine, describe, it, expect, beforeEach, loadFixtures, afterEach, spyOn */

'use strict'

var $ = require('jquery')
var responses = require('./fixtures/responses')

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/'

var fenster = require('../modules/fenster.js')

var clockTick = function (v) {
  return jasmine.clock().tick(v * 1000)
}

var mostRecentRequest = function () {
  return jasmine.Ajax.requests.mostRecent()
}

describe('<fenster>', function () {
  var $fenster
  var component

  beforeEach(function () {
    loadFixtures('markup.html')

    jasmine.Ajax.install()
    jasmine.clock().install()

    $fenster = $('#page1')
    component = fenster($fenster)
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
    jasmine.clock().uninstall()
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
      it('deve considerar sempre a última', function () {
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

        jasmine.clock().tick(101)
        expect('page2').toBe($fenster.html())
      })
    })
  })

  describe('poll', function () {
    beforeEach(function () {
      component.poll(120)
      spyOn(component, 'fetch')
      spyOn(component, 'stopPoll').and.callThrough()
    })

    it('deve atualizar a cada intervalo de tempo determinado', function () {
      clockTick(1)

      clockTick(120)
      expect(component.fetch.calls.count()).toEqual(1)

      clockTick(120)
      expect(component.fetch.calls.count()).toEqual(2)

      clockTick(100)
      expect(component.fetch.calls.count()).toEqual(2)
    })

    it('deve permitir o cancelamento', function () {
      clockTick(1)
      component.stopPoll()

      clockTick(120)
      expect(component.fetch).not.toHaveBeenCalled()
    })

    it('deve cancelar o timeout depois de removido do DOM', function () {
      $fenster.remove()
      clockTick(121)
      expect(component.fetch).not.toHaveBeenCalled()
    })

    it('deve cancelar o primeiro timeout se a chamada for duplicada', function () {
      component.poll(100)
      clockTick(121)
      expect(component.fetch.calls.count()).toEqual(1)
    })
  })
})
