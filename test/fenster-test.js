/* global jasmine, describe, it, expect, beforeEach, spyOn, spyOnEvent, xit */

'use strict'

var $ = require('jquery')
var baseObject = require('../fenster')
var fenster = require('../index')
var obergaden = require('../obergaden')

require('../poll')
require('../plugin/index')

var responses = require('./fixtures/responses')

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
    $fenster = $('#page1')
    component = fenster($fenster)

    spyOn(baseObject, 'render').and.callThrough()
    spyOn(baseObject, 'fetch').and.callThrough()
    spyOn(baseObject, 'poll').and.callThrough()
    spyOn(baseObject, 'halt').and.callThrough()

    spyOnEvent($fenster, 'fail')
    spyOnEvent($fenster, 'fetch')
    spyOnEvent($fenster, 'load')
    spyOnEvent($fenster, 'render')
  })

  describe('antes do primeiro fetch', function () {
    it('deve retornar o component depois da inicialização', function () {
      expect(component).toBeDefined()
    })
  })

  describe('quando houver uma requisição', function () {
    var request
    var fetch

    beforeEach(function () {
      fetch = component.fetch()
      request = lastRequest()
    })

    it('deve retornar uma promise', function () {
      expect(fetch.promise).toBeDefined()
    })

    it('deve desmarcar o status is-updated do componente', function () {
      $fenster.addClass('is-updated')
      component.fetch()
      expect($fenster).not.toHaveClass('is-updated')
    })

    describe('vazia', function () {
      beforeEach(function () {
        request.respondWith(responses.empty)
      })
      it('deve limpar o componente se a resposta for vazia', function () {
        expect($fenster).toBeEmpty()
      })
      it('deve marcar o componente com is-updated', function () {
        expect($fenster).toHaveClass('is-updated')
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

      it('deve marcar o componente com is-updated', function () {
        expect($fenster).toHaveClass('is-updated')
      })

      it('deve emitir o evento render', function () {
        expect($fenster).toContainHtml('page1')
        expect('render').toHaveBeenTriggeredOn($fenster)
      })

      it('deve disparar o evento onload', function () {
        expect('load').toHaveBeenTriggeredOn($fenster)
      })

      it('não deve disparar o evento onfail', function () {
        expect('fail').not.toHaveBeenTriggeredOn($fenster)
      })

      it('deve disparar o evento onfetch', function () {
        expect('fetch').toHaveBeenTriggeredOn($fenster)
      })

      it('deve dar sequência à promise', function (done) {
        fetch.then(function () {
          done()
        })
      })
    })

    describe('com erro', function () {
      beforeEach(function () {
        request.respondWith(responses.error)
      })

      it('não deve limpar o component', function () {
        expect($fenster).toContainText('INITIAL_STATE')
      })

      it('não deve marcar o component', function () {
        expect($fenster).not.toHaveClass('is-updated')
      })

      it('deve disparar o evento onerror', function () {
        expect('fail').toHaveBeenTriggeredOn($fenster)
      })

      it('não deve disparar o evento onload', function () {
        expect('load').not.toHaveBeenTriggeredOn($fenster)
      })

      it('deve disparar o evento onfetch', function () {
        expect('fetch').toHaveBeenTriggeredOn($fenster)
      })

      it('deve dar sequência à promise', function (done) {
        fetch.fail(function () {
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
    it('não deve disparar o evento fail devido ao `abort`', function () {
      var onfail = jasmine.createSpy('fail')
      $fenster.on('fail', onfail)
      component.fetch()
      component.fetch()

      expect(onfail).not.toHaveBeenCalled()
    })

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

  describe('poll', function () {
    beforeEach(function () {
      component.poll(120)
    })

    it('deve atualizar a cada intervalo de tempo determinado', function () {
      var fetch = component.fetch.calls

      clockTick(1)
      expect(fetch.count()).toEqual(0)

      clockTick(120)
      expect(fetch.count()).toEqual(1)

      clockTick(120)
      expect(fetch.count()).toEqual(2)

      clockTick(100)
      expect(fetch.count()).toEqual(2)
    })

    it('deve atualizar antes do primeiro intervalo se o parâmetro start for passado', function () {
      component.poll(120, true)
      clockTick(1)
      expect(component.fetch.calls.count()).toEqual(1)
    })

    it('deve permitir o cancelamento', function () {
      clockTick(1)
      component.halt()

      clockTick(120)
      expect(component.fetch).not.toHaveBeenCalled()
    })

    it('deve cancelar o timeout depois de removido do DOM', function () {
      $fenster.remove()
      clockTick(121)
      expect(component.fetch).not.toHaveBeenCalled()
    })

    it('deve cancelar o primeiro timeout se a chamada for duplicada', function () {
      component.poll(400)
      clockTick(121)
      expect(component.fetch.calls.count()).toEqual(0)
    })
  })

  describe('parada automática do poll', function () {
    beforeEach(function () {
      component.poll(10)
    })

    it('deve parar o poll assim que receber 5 erros consecutivos', function () {
      var calls = baseObject.fetch.calls

      clockTick(1)
      for (var i = 1; i <= 5; i++) {
        clockTick(10)
        expect(calls.count()).toEqual(i)
        lastRequest().respondWith(responses.error)
      }

      clockTick(10)
      expect(calls.count()).toEqual(5)
      clockTick(10)
      expect(calls.count()).toEqual(5)
    })
  })

  describe('poll automático', function () {
    beforeEach(function () {
      component = fenster($('.js-fensterpoll'))
    })

    it('deve disparar poll automaticamente se [data-head-start]', function () {
      expect(baseObject.poll.calls.count()).toEqual(1)
    })

    it('deve disparar fetch automaticamente se [data-head-start]', function () {
      expect(baseObject.fetch.calls.count()).toEqual(1)
    })

    it('deve executar o fetch a cada pollInterval', function () {
      clockTick(1)
      expect(baseObject.fetch.calls.count()).toEqual(1)
      clockTick(5)
      expect(baseObject.fetch.calls.count()).toEqual(2)
      clockTick(5)
      expect(baseObject.fetch.calls.count()).toEqual(3)
    })
  })

  describe('group', function () {
    var $groupedElement
    var updateAvailableEvent

    beforeEach(function () {
      $groupedElement = $('.js_t-group').first()
      updateAvailableEvent = spyOnEvent($groupedElement, 'updateAvailable')

      component = fenster($groupedElement)
      component.fetch()
      lastRequest().respondWith(responses.page1)
    })

    it('não deve atualizar ao fetch', function () {
      expect($groupedElement).toContainHtml('INITIAL_STATE')
    })

    it('não deve disparar o evento render ao fetch', function () {
      expect($groupedElement).not.toHaveBeenTriggeredOn('render')
    })

    it('deve marcar com a classe is-pending ao receber uma atualização', function () {
      expect($groupedElement).toHaveClass('is-pending')
    })

    it('deve disparar o evento updateAvailable', function () {
      expect('updateAvailable').toHaveBeenTriggeredOn($groupedElement)
    })

    it('não deve disparar o evento updateAvailable se a resposta for a mesma', function () {
      updateAvailableEvent.reset()
      component.fetch()
      lastRequest().respondWith(responses.page1)
      expect('updateAvailable').not.toHaveBeenTriggeredOn($groupedElement)
    })

    it('deve permitir atualização', function () {
      component.applyRender()
      expect($groupedElement).toContainHtml('page1')
    })

    it('deve se atualizar ao receber o evento updateRequested', function () {
      $groupedElement.trigger('updateRequested')
      expect($groupedElement).toContainHtml('page1')
    })

    it('deve utilizar sempre a última atualização', function () {
      component.fetch()
      lastRequest().respondWith(responses.page1)
      component.fetch()
      lastRequest().respondWith(responses.page2)
      $groupedElement.trigger('updateRequested')
      expect($groupedElement).toContainHtml('page2')
    })
  })

  describe('<obergaden>', function () {
    var $obergaden
    var $parts
    var parts

    beforeEach(function () {
      $obergaden = $('.js-obergaden').first()
      $parts = $('.js_t-group').fenster()
      parts = $parts.toArray().map(function (part) {
        return $(part).data('plugin-fenster')
      })
      component = obergaden($obergaden)
    })

    it('deve inicializar sem atualizações pendentes', function () {
      expect(component.pendingOperations).toBe(0)
      expect($obergaden).not.toHaveClass('is-pending')
    })

    it('deve chamar o poll dos fenster adjacentes para resetar seus timers', function () {
      expect(baseObject.poll.calls.count()).toEqual(0)
      component.flush()
      expect(baseObject.poll.calls.count()).toEqual(3)
    })

    describe('operações', function () {
      beforeEach(function () {
        // group_1
        parts[0].fetch()
        lastRequest().respondWith(responses.page1)
        parts[1].fetch()
        lastRequest().respondWith(responses.page2)
        // group_2
        parts[3].fetch()
        lastRequest().respondWith(responses.page2)

        spyOnEvent($obergaden, 'updateAvailable')
      })

      it('deve contar as operações pendentes apenas de seu grupo', function () {
        expect(component.pendingOperations).toBe(2)
      })

      it('deve liberar ao click', function () {
        expect($obergaden).toHandleWith('click', component.flush)
      })

      it('deve contar apenas uma atualização para cada fenster', function () {
        parts[0].fetch()
        lastRequest().respondWith(responses.empty)
        expect(component.pendingOperations).toBe(2)

        parts[0].fetch()
        lastRequest().respondWith(responses.page1)
        expect(component.pendingOperations).toBe(2)
      })

      it('deve emitir o evento updateAvailable assim que algum fenster atualizar', function () {
        expect('updateAvailable').not.toHaveBeenTriggeredOn($obergaden)
        parts[0].fetch()
        lastRequest().respondWith(responses.page2)
        expect('updateAvailable').toHaveBeenTriggeredOn($obergaden)
      })

      describe('flush', function () {
        beforeEach(function () {
          component.flush()
        })

        it('deve atualizar os apenas os componentes que foram atualizados', function () {
          expect($parts[0]).toContainHtml('page1')
          expect($parts[1]).toContainHtml('page2')
          expect($parts[2]).toContainHtml('INITIAL_STATE')
        })

        it('deve desmarcar os componentes', function () {
          expect($obergaden).not.toHaveClass('is-pending')
        })

        it('deve cuidar só dos elementos do mesmo grupo', function () {
          expect($parts[3]).toHaveClass('is-pending')
        })
      })
    })
  })

  describe('plugin jquery', function () {
    beforeEach(function () {
      $fenster = $('.js-fenster')
      component = $fenster.fenster()
    })

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
  })
})
