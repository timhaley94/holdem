const { Server } = require('http');
const IO = require('socket.io');
const api = require('./api');
const onConnect = require('./io');
const config = require('./config');

const server = Server(api);
const io = IO(server, {
  origins: '*:*',
  serveClient: false,
  pingInterval: config.socket.pingInterval,
  pingTimeout: config.socket.pingTimeout,
});

io.sockets.on('connection', onConnect);
server.listen(config.port);
