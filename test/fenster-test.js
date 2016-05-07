/* global jasmine, describe, it, expect, beforeEach, loadFixtures, afterEach, spyOn, xit */

'use strict'

var $ = require('jquery')
var responses = require('./fixtures/responses')

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/'

var factory = require('../modules/fenster.js')
var fenster = require('../modules/index.js')

var clockTick = function (v) {
  return jasmine.clock().tick(v * 1000)
}

var lastRequest = function () {
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

    xit('deve retornar a mesma istância em caso de inicialização duplicada', function () {
      var component2 = fenster($fenster)
      expect(component2).toBe(component)
    })
  })

  describe('depois do fetch', function () {
    describe('quando houver uma requisição', function () {
      var request
      var fetch
      var onfail
      var onfetch
      var onload

      beforeEach(function () {
        onfail = jasmine.createSpy('fail')
        onfetch = jasmine.createSpy('fetch')
        onload = jasmine.createSpy('load')

        $fenster.on('fail', onfail)
        $fenster.on('load', onload)
        $fenster.on('fetch', onfetch)

        fetch = component.fetch()
        request = lastRequest()
      })

      describe('promise', function () {
        it('deve retornar uma promise', function () {
          expect(fetch.promise).toBeDefined()
        })
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

        it('deve disparar o evento onload', function () {
          expect(onload).toHaveBeenCalled()
        })

        it('não deve disparar o evento onfail', function () {
          expect(onfail).not.toHaveBeenCalled()
        })

        it('deve disparar o evento onfetch', function () {
          expect(onfetch).toHaveBeenCalled()
        })

        it('deve dar sequência à promise', function (done) {
          fetch.then(function () {
            expect(onload).toHaveBeenCalled()
            done()
          })
        })
      })

      describe('com erro', function () {
        beforeEach(function () {
          request.respondWith(responses.error)
        })

        it('deve limpar o component', function () {
          expect($fenster).toBeEmpty()
        })

        it('deve disparar o evento onerror', function () {
          expect(onfail).toHaveBeenCalled()
        })

        it('não deve disparar o evento onload', function () {
          expect(onload).not.toHaveBeenCalled()
        })

        it('deve disparar o evento onfetch', function () {
          expect(onfetch).toHaveBeenCalled()
        })

        it('deve dar sequência à promise', function (done) {
          fetch.fail(function () {
            expect(onfail).toHaveBeenCalled()
            done()
          })
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
        lastRequest().respondWith(responses.page1)
        expect($fenster).toContainHtml('page1')
      })
    })

    describe('quando houver múltiplas requisições', function () {
      it('deve considerar sempre a última', function () {
        component.fetch()

        var firstRequest = lastRequest()
        setTimeout(function () {
          firstRequest.respondWith(responses.page1)
        }, 100)

        component.fetch()

        var secondRequest = lastRequest()
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

  $.fn.fenster = 'old'
  describe('plugin jquery', function () {
    require('../modules/plugin')

    beforeEach(function () {
      $fenster = $('.js-fenster')
      component = $fenster.fenster()
      spyOn(factory, 'fetch')
      spyOn(factory, 'poll')
    })

    it('deve retornar o próprio objeto jquery', function () {
      expect(component instanceof $).toBe(true)
    })

    it('deve retornar a mesma instância em caso de inicialização duplicada', function () {
      var c1 = $fenster.data('plugin-fenster')
      $fenster.fenster()
      var c2 = $fenster.data('plugin-fenster')
      expect(c1).toBe(c2)
    })

    it('deve aplicar o plugin em todos os elementos do objeto jQuery', function () {
      expect($fenster.length).toBeGreaterThan(1)
      $fenster.each(function () {
        var plugin = $(this).data('plugin-fenster')
        expect(factory.isPrototypeOf(plugin)).toBe(true)
      })
    })

    it('deve permitir chamada de métodos depois da primeira inicialização', function () {
      component.fenster('fetch')
      expect($fenster.length).toBeGreaterThan(1)
      expect(factory.fetch.calls.count()).toBe($fenster.length)
    })

    it('deve chamar um método do plugin se chamado com argumentos', function () {
      $fenster.fenster('fetch')
      expect(factory.fetch).toHaveBeenCalled()

      $fenster.fenster('poll', 120)
      expect(factory.poll).toHaveBeenCalled()
      expect(factory.poll.calls.argsFor(0)).toEqual([120])
    })

    it('deve preservar a antiga instância do plugin jquery', function () {
      $.fn.fenster.noConflict()
      expect($.fn.fenster).toBe('old')
    })
  })
})
