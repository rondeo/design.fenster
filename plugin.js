'use strict'

var pluginify = require('./pluginify')
var factory = require('./index')

pluginify('fenster', factory)

module.exports = factory
