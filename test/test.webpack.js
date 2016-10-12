/* global jasmine, beforeEach, loadFixtures, afterEach */

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/'

beforeEach(function () {
  loadFixtures('markup.html')
  jasmine.Ajax.install()
  jasmine.clock().install()
})

afterEach(function () {
  jasmine.Ajax.uninstall()
  jasmine.clock().uninstall()
})

var context = require.context('.', true, /-test\.js$/)
context.keys().forEach(context)
