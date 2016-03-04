'use strict'

exports.initEvents = function (object) {
  var events = object.events
  for (var evt in events) {
    var objctEvt = events[evt]
    var container = objctEvt.container
    var typesEvent = objctEvt.typesEvent
    var selector = objctEvt.selector
    container.addEventListener(typesEvent, object[evt], selector)
  }
}
