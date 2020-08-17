const IO = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('../config');
const Auth = require('./auth');
const Game = require('./game');
const Games = require('./games');
const Table = require('./table');

const modules = [
  Game,
  Games,
  Table,
];

function Socket(server) {
  const io = IO(server, {
    origins: '*:*',
    serveClient: false,
    pingInterval: config.socket.pingInterval,
    pingTimeout: config.socket.pingTimeout,
  });

  io.adapter(redisAdapter(config.redis));
  io.use(Auth.middleware);

  modules.forEach((module) => {
    module.onStart(io.sockets);
  });

  io.sockets.on('connection', (socket) => {
    modules.forEach((module) => {
      module.onConnect(socket);
    });

    socket.on('disconnect', () => {
      modules.forEach((module) => {
        module.onDisconnect(socket);
      });
    });
  });
}

module.exports = Socket;
