/* global jasmine, describe, it, expect, beforeEach, loadFixtures, afterEach, spyOn */

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
      var result
      var onload
      var onfail

      beforeEach(function () {
        result = component.fetch()

        onload = jasmine.createSpy('onload')
        onfail = jasmine.createSpy('onfail')

        $fenster.on('load', onload)
        $fenster.on('fail', onfail)

        request = mostRecentRequest()
      })

      it('deve retornar uma promise', function () {
        expect(result.promise).toBeDefined()
      })

      describe('com sucesso', function () {
        beforeEach(function () {
          request.respondWith(responses.page1)
        })

        it('deve fazer uma requisição em data-url', function () {
          expect(request.url).toBe(component.src)
          expect(request.method).toBe('GET')
        })

        it('deve emitir o evento `load`', function () {
          expect(onload).toHaveBeenCalled()
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

        it('deve emitir o evento `fail`', function () {
          expect(onfail).toHaveBeenCalled()
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

  describe('plugin jquery', function () {
    require('../modules/fenster-jquery.js')

    var element

    beforeEach(function () {
      element = $('#page2')
    })

    it('deve publicar um plugin jquery', function () {
      expect($.fn.fenster).toBeDefined()
    })

    it('deve inicializar um `fenster` pela chamada do plugin jquery', function () {
      element.fenster()
      expect(element.data('plugin-fenster')).not.toBeEmpty()
    })

    it('deve inicializar múltiplos componentes via composite pattern', function () {
      var components = $('.js-fenster')
      components.fenster()

      expect(components.length).toBeGreaterThan(1)
      components.each(function () {
        expect($(this).data('plugin-fenster')).not.toBeEmpty()
      })
    })

    it('deve impedir a criação duplicada', function () {
      element.fenster()
      var f1 = element.data('plugin-fenster')
      element.fenster()
      var f2 = element.data('plugin-fenster')
      expect(f1).toBeDefined()
      expect(f1).toBe(f2)
    })

    it('deve retonar o próprio elemento jquery', function () {
      expect(element.fenster() instanceof $).toBe(true)
    })

    it('deve permitir a chamada de métodos estilo jquery', function () {
      element.fenster()
      component = element.data('plugin-fenster')
      spyOn(component, 'fetch')
      element.fenster('fetch')
      expect(component.fetch).toHaveBeenCalled()
    })
  })
})
