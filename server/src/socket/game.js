const { Games } = require('../models');

class GameError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

function onStart(sockets) {
  Games.listen(async (id) => {
    const state = await Games.retrieve({ id });
    sockets.to(id).emit('game_state_updated', state);
  });
}

function onConnect(socket) {
  const userId = socket.decoded_token.data.id;
  let gameId = null;

  function joinRoom(id) {
    gameId = id;
    return new Promise((resolve) => {
      socket.join(gameId, resolve);
    });
  }

  function leaveRoom() {
    const p = new Promise((resolve) => {
      socket.leave(gameId, resolve);
    });

    gameId = null;
    return p;
  }

  const wrap = (fn) => async (...args) => {
    let result;

    try {
      result = await fn(...args);
    } catch (e) {
      if (e instanceof GameError) {
        socket.emit('game_error', {
          message: e.message,
        });
      } else {
        socket.emit('room_error', {
          message: e.message,
        });

        await leaveRoom();
      }
    }

    return result;
  };

  function sendMessage(message) {
    const name = 'incoming_message';
    const payload = {
      message,
      userId,
      timestamp: new Date(),
    };

    socket.emit(name, payload);
    socket.to(gameId).emit(name, payload);
  }

  async function join(id) {
    await joinRoom(id);
    await Games.addUser({ id, userId });
    const isFull = await Games.isFull({ id });

    if (isFull) {
      throw new GameError('Game is already full.');
    }

    await Games.addPlayer({ id, userId });
  }

  async function setReady(isReady) {
    if (gameId) {
      await Games.setPlayerReady({
        id: gameId,
        userId,
        isReady,
      });
    }
  }

  async function move(data) {
    if (gameId) {
      await Games.makeMove({
        id: gameId,
        userId,
        data,
      });
    }
  }

  async function leave() {
    if (gameId) {
      await Games.removePlayer({
        id: gameId,
        userId,
      });

      await leaveRoom();
    }
  }

  socket.on('send_message', wrap(sendMessage));
  socket.on('join_game', wrap(join));
  socket.on('set_ready', wrap(setReady));
  socket.on('make_move', wrap(move));
  socket.on('leave_game', wrap(leave));
  socket.on('disconnect', wrap(leave));
}

module.exports = {
  onStart,
  onConnect,
};
