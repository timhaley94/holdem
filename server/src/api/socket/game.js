const { Games } = require('../models');
const events = require('./events');

const GAME_ID = Symbol('gameId');

class GameError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

function getUserId(socket) {
  return socket.decoded_token.data.id;
}

function getGameId(socket) {
  return socket[GAME_ID] || null;
}

function setGameId(socket, value) {
  socket[GAME_ID] = value; // eslint-disable-line no-param-reassign
}

function joinRoom(socket, id) {
  setGameId(socket, id);

  return new Promise((resolve) => {
    socket.join(
      getGameId(socket),
      resolve,
    );
  });
}

function leaveRoom(socket) {
  const p = new Promise((resolve) => {
    socket.leave(
      getGameId(socket),
      resolve,
    );
  });

  setGameId(socket, null);
  return p;
}

async function join(socket, id) {
  const userId = getUserId(socket);

  await joinRoom(socket, id);
  await Games.addUser({
    id,
    userId,
    socketId: socket.id,
  });
}

async function setReady(socket, isReady) {
  const userId = getUserId(socket);
  const gameId = getGameId(socket);

  if (gameId) {
    await Games.setPlayerReady({
      id: gameId,
      userId,
      isReady,
    });
  }
}

async function leave(socket) {
  const userId = getUserId(socket);
  const gameId = getGameId(socket);

  if (gameId) {
    await Games.removeUser({
      id: gameId,
      userId,
      socketId: socket.id,
    });

    await leaveRoom(socket);
  }
}

function sendMessage(socket, message) {
  const userId = getUserId(socket);
  const gameId = getGameId(socket);

  const name = events.game.incomingMessage;
  const payload = {
    message,
    userId,
    timestamp: new Date(),
  };

  socket.emit(name, payload);
  socket.to(gameId).emit(name, payload);
}

async function catchError(socket, e) {
  if (e instanceof GameError) {
    socket.emit(
      events.game.gameError,
      { message: e.message },
    );
  } else {
    socket.emit(
      events.game.roomError,
      { message: e.message },
    );

    await leaveRoom(socket);
  }
}

function onStart(sockets) {
  Games.listener.listen(async (id) => {
    const state = await Games.retrieve({ id });

    sockets.to(id).emit(
      events.game.gameStateUpdated,
      state,
    );
  });
}

function onConnect(socket) {
  const wrap = (fn) => async (...args) => {
    let result;

    try {
      result = await fn(socket, ...args);
    } catch (e) {
      await catchError(socket, e);
    }

    return result;
  };

  socket.on(
    events.game.sendMessage,
    wrap(sendMessage),
  );

  socket.on(
    events.game.joinGame,
    wrap(join),
  );

  socket.on(
    events.games.setReady,
    wrap(setReady),
  );

  socket.on(
    events.game.leaveGame,
    wrap(leave),
  );
}

function onDisconnect(socket) {
  leave(socket);
}

module.exports = {
  onStart,
  onConnect,
  onDisconnect,
};
