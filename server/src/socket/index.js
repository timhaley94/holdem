const IO = require('socket.io');
const config = require('../config');
const auth = require('./auth');
const onConnect = require('./connection');

function Socket(server) {
  const io = IO(server, {
    origins: '*:*',
    serveClient: false,
    pingInterval: config.socket.pingInterval,
    pingTimeout: config.socket.pingTimeout,
  });

  io.use(auth);
  io.sockets.on('connection', onConnect);
}

module.exports = Socket;
