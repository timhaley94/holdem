const Games = require('./games');
const { uuidv4: uuid } = require('uuid');

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  origins: '*:*',
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000
});

app.get('/ping', (req, res) => res.sendStatus(200))

io.sockets.on('connection', function(socket) {
  const gameId = null;

  function joinRoom(id) {
    gameId = id;
    socket.join(gameId);
  }

  function leaveRoom() {
    socket.leave(gameId);
    gameId = null;
  }

  function reportError(e) {
    socket.send('error_encountered', {
      message: e.message
    });
  }

  function create() {
    if (!gameId) {
      joinRoom(uuid());

      try {
        Games.new({
          id: gameId,
          playerId: socket.id,
          emit: io.sockets.in(gameId).emit
        });
      } catch (e) {
        reportError(e);
        leaveRoom();
      }
    }
  }

  function join(id) {
    if (!gameId) {
      joinRoom(id);

      try {
        Games.addPlayer({
          id: gameId,
          playerId: socket.id
        });
      } catch (e) {
        reportError(e);
        leaveRoom();
      }
    }
  }

  function start() {
    if (gameId) {
      try {
        Games.start({
          id: gameId
        });
      } catch (e) {
        reportError(e);
      }
    }
  }

  function move(data) {
    if (gameId) {
      try {
        Games.makeMove({
          id: gameId,
          playerId: socket.id,
          data
        });
      } catch (e) {
        reportError(e);
      }
    }
  }

  function leave() {
    if (gameId) {
      try {
        Games.removePlayer({
          id: gameId,
          playerId: socket.id
        });
      } catch (e) {
        reportError(e);
      }

      leaveRoom();
    }
  };

  socket.on('new_game', create);
  socket.on('join_game', join);
  socket.on('start_game', start);
  socket.on('make_move', move);
  socket.on('leave_game', leave);
  socket.on('disconnect', leave);
});

server.listen(80);
