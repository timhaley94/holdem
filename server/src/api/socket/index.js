const IO = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('../../config');
const Room = require('./room');
const Game = require('./game');
const User = require('./user');
const Auth = require('./auth');

const modules = [Room, Game, User];

async function Socket(server) {
  const io = IO(server, {
    origins: '*:*',
    serveClient: false,
    pingInterval: config.socket.pingInterval,
    pingTimeout: config.socket.pingTimeout,
    transports: ['websocket'],
  });

  if (process.env.NODE_ENV !== 'test') {
    // Figure out a way to mock redis in tests
    io.adapter(redisAdapter(config.redis));
  }

  io.use(Auth.middleware);

  modules.forEach((module) => {
    if (module.onStart) {
      module.onStart(io);
    }
  });

  io.sockets.on('connection', (socket) => {
    modules.forEach((module) => {
      if (module.onConnect) {
        module.onConnect(socket);
      }
    });

    socket.on('disconnect', () => {
      modules.forEach((module) => {
        if (module.onDisconnect) {
          module.onDisconnect(socket);
        }
      });
    });
  });
}

module.exports = Socket;
