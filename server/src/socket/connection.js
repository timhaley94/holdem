const { v4: uuid } = require('uuid');
const Games = require('../games');

function onConnect(socket) {
  const playerId = socket.decoded_token.data.id;
  let gameId = null;

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

  function reportError(msg, e, data) {
    const payload = {
      ...data,
      message: e.message,
    };

    socket.emit(msg, payload);
  }

  const gameError = (...args) => reportError('game_error', ...args);
  const roomError = (...args) => reportError('room_error', ...args);

  function create() {
    if (!gameId) {
      joinRoom(uuid());

      try {
        Games.new({
          playerId,
          id: gameId,
          emit: massEmit,
        });
      } catch (e) {
        roomError(e, {
          source: 'create',
        });

        leaveRoom();
      }
    }
  }

  function join(id) {
    if (!gameId) {
      joinRoom(id);

      if (Games.isFull({ id })) {
        gameError(
          new Error('Game is already full.'),
          { source: 'join' },
        );
      } else {
        try {
          Games.addPlayer({
            id: gameId,
            playerId,
          });
        } catch (e) {
          roomError(e, {
            source: 'join',
          });

          leaveRoom();
        }
      }
    }
  }

  function setData(data) {
    if (gameId) {
      try {
        Games.setPlayerData({
          id: gameId,
          playerId,
          data,
        });
      } catch (e) {
        gameError(e, {
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
          playerId,
          value,
        });
      } catch (e) {
        gameError(e, {
          source: 'setReady',
        });
      }
    }
  }

  function sendMessage(message) {
    massEmit('incoming_message', {
      message,
      playerId,
      timestamp: new Date(),
    });
  }

  function move(data) {
    if (gameId) {
      try {
        Games.makeMove({
          id: gameId,
          playerId,
          data,
        });
      } catch (e) {
        gameError(e, {
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
          playerId,
        });
      } catch (e) {
        roomError(e, {
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
}

module.exports = onConnect;
