'use strict';

module.exports = function (grunt) {
  require('load-grunt-config')(grunt, {
    data : {
      config: {
        app: 'app',
        dist: 'dist'
      }
    }
  })
}
