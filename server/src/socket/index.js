const IO = require('socket.io');
const config = require('../config');
const Auth = require('./auth');
const Game = require('./game');
// const Games = require('./games');

function Socket(server) {
  const io = IO(server, {
    origins: '*:*',
    serveClient: false,
    pingInterval: config.socket.pingInterval,
    pingTimeout: config.socket.pingTimeout,
  });

  io.use(Auth.middleware);

  Game.onStart(io.sockets);

  io.sockets.on('connection', (socket) => {
    Game.onConnect(socket);
    // Games.onConnect(socket);
  });
}

module.exports = Socket;
