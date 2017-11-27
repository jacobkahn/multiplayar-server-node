var express = require('express');
var uuid = require('uuid');

var router = express.Router();

module.exports = function(app, io) {
  io.on('connection', function (socket) {
    console.log('Client has connected');
    socket.emit('event', { connected: true });
  });

  return router;
}
