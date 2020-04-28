const express = require('express');
const { Server } = require('http');
const IO = require('socket.io');
const { v4: uuid } = require('uuid');
const Games = require('./games');
const config = require('./config');

const app = express();
const server = Server(app);
const io = IO(server, {
  origins: '*:*',
  serveClient: false,
  pingInterval: config.socket.pingInterval,
  pingTimeout: config.socket.pingTimeout,
});

app.get('/ping', (req, res) => res.sendStatus(200));

io.sockets.on('connection', (socket) => {
  let gameId = null;
  socket.emit('player_id', socket.id);

  function massEmit(...args) {
    socket.emit(...args);
    socket.to(gameId).emit(...args);
  }

  function joinRoom(id) {
    gameId = id;
    socket.join(gameId);
  }

  function leaveRoom() {
    socket.leave(gameId);
    gameId = null;
  }

  function reportError(e, data) {
    const payload = {
      ...data,
      message: e.message,
    };

    console.log(payload);
    socket.emit('game_error', payload);
  }

  function create() {
    if (!gameId) {
      joinRoom(uuid());

      try {
        Games.new({
          id: gameId,
          playerId: socket.id,
          emit: massEmit,
        });
      } catch (e) {
        reportError(e, {
          source: 'create',
        });

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
          playerId: socket.id,
        });
      } catch (e) {
        reportError(e, {
          source: 'join',
        });

        leaveRoom();
      }
    }
  }

  function setData(data) {
    if (gameId) {
      try {
        Games.setPlayerData({
          id: gameId,
          playerId: socket.id,
          data,
        });
      } catch (e) {
        reportError(e, {
          source: 'setData',
        });
      }
    }
  }

  function setReady(value) {
    if (gameId) {
      try {
        Games.setPlayerReady({
          id: gameId,
          playerId: socket.id,
          value,
        });
      } catch (e) {
        reportError(e, {
          source: 'setReady',
        });
      }
    }
  }

  function sendMessage(message) {
    massEmit('incoming_message', {
      message,
      playerId: socket.id,
      timestamp: new Date(),
    });
  }

  function move(data) {
    if (gameId) {
      try {
        Games.makeMove({
          id: gameId,
          playerId: socket.id,
          data,
        });
      } catch (e) {
        reportError(e, {
          source: 'move',
        });
      }
    }
  }

  function leave() {
    if (gameId) {
      try {
        Games.removePlayer({
          id: gameId,
          playerId: socket.id,
        });
      } catch (e) {
        reportError(e, {
          source: 'leave',
        });
      }

      leaveRoom();
    }
  }

  socket.on('new_game', create);
  socket.on('join_game', join);
  socket.on('set_data', setData);
  socket.on('set_ready', setReady);
  socket.on('send_message', sendMessage);
  socket.on('make_move', move);
  socket.on('leave_game', leave);
  socket.on('disconnect', leave);
});

server.listen(config.port);
