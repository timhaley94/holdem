const Joi = require('@hapi/joi');
const { v4: uuid } = require('uuid');
const dynamoose = require('dynamoose');
const config = require('../../config');
const {
  Cache,
  Errors,
  Validator,
} = require('../../modules');
const SubGame = require('../game');
const Listener = require('../listener');
const User = require('../user');
const validator = require('../../modules/validator');

// Model
const Schema = new dynamoose.Schema({
  id: String,
  name: String,
  isPrivate: Boolean,
  users: Object,
  gameId: String,
});

const Room = dynamoose.model('Room', Schema);

// View and Controller logic
const schemas = {
  id: (
    Joi
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(1)
      .max(36)
  ),
  name: (
    Joi
      .string()
      .min(1)
      .max(36)
  ),
  userId: (
    Joi
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(1)
      .max(36)
  ),
  socketId: Joi.string(),
  isPrivate: Joi.boolean(),
  isReady: Joi.boolean(),
};

// Helpers
function has(id) {
  return !!games[id];
}

function remove(id) {
  delete games[id];
}

function playerCount(id) {
  const game = get(id);
  return (
    Object
      .values(game.users)
      .filter(({ isPlayer }) => isPlayer)
      .length
  );
}

function canStart(id) {
  return playerCount(id) >= config.game.minPlayers;
}

function isFull(id) {
  return playerCount(id) >= config.game.maxPlayers;
}

function isEmpty(id) {
  return playerCount(id) === 0;
}

function allPlayersReady(id) {
  const game = get(id);
  return (
    Object
      .values(game.users)
      .every(({ isReady }) => isReady)
  );
}

function isStarted(id) {
  return !!(get(id).tableId);
}

function shouldStart(id) {
  return !isStarted(id) && canStart(id) && allPlayersReady(id);
}

function attemptStart(id) {
  if (shouldStart(id)) {
    set(id, {
      isStarted: true,
      table: Tables.create(),
    });
  }
}

function clearCleanup(id) {
  const game = get(id);

  if (game.cleanupTimer) {
    clearTimeout(game.cleanupTimer);

    set(id, {
      cleanupTimer: null,
    });
  }
}

function attemptCleanup(id) {
  if (isEmpty(id)) {
    clearCleanup(id);

    set(id, {
      cleanupTimer: setTimeout(
        () => {
          remove(id);
          listener.emit(id);
        },
        config.game.cleanupTimeout,
      ),
    });
  }
}

function addConnection(id, userId, socketId) {
  const game = get(id);
  const user = game.users[userId] || {};

  let { connection } = user;

  if (!connection) {
    const cb = () => listener.emit(id);
    Users.listener.subscribe(userId, cb);
    connection = cb;
  }

  set(id, {
    users: {
      ...game.users,
      [userId]: {
        ...user,
        connection,
        socketIds: [
          ...(user.socketIds || []),
          socketId,
        ],
      },
    },
  });
}

function removeConnection(id, userId, socketId) {
  const game = get(id);
  const users = { ...game.users };

  users[userId].socketIds = (
    users[userId]
      .socketIds
      .filter((i) => i !== socketId)
  );

  if (users[userId].socketIds.length === 0) {
    users[userId].player = null;
  }

  set(id, { users });
}

function addPlayer(id, userId) {
  const game = get(id);
  const user = game.users[userId];

  set(id, {
    users: {
      ...game.users,
      [userId]: {
        ...user,
        player: user.player || {
          isReady: false,
        },
      },
    },
  });
}

// Handlers
const list = Validator.wrap({
  schemas,
  fn: async () => {
    return await (
      Room
        .scan('isPrivate')
        .eq(false)
        .exec()
    );
  },
});

const retrieve = Validator.wrap({
  schemas,
  required: ['id'],
  fn: async ({ id }) => {
    return await Room.get(id);
  },
});

const create = Validator.wrap({
  schemas,
  required: ['name'],
  optional: ['isPrivate'],
  fn: async ({ name, isPrivate }) => {
    return await Room.create({
      id: uuid(),
      name,
      isPrivate: isPrivate || false,
    });
  },
});

const addUser = Validator.wrap({
  schemas,
  required: ['id', 'userId', 'socketId'],
  fn: async ({ id, userId }) => {
    await Users.retrieve({ id: userId });
    addConnection(id, userId, socketId);

    if (isFull(id)) {
      throw new Errors.Conflict('Game is already full.');
    }

    addPlayer(id, userId);
    clearCleanup(id);
    listener.emit(id);
  },
});

const removeUser = Validator.wrap({
  schemas,
  required: ['id', 'userId', 'socketId'],
  fn: async ({ id, userId, socketId }) => {
    await Users.retrieve({ id: userId });
    removeConnection(id, userId, socketId);
    attemptStart(id);
    attemptCleanup(id);
    listener.emit(id);
  },
});

const setPlayerReady = Validator.wrap({
  schemas,
  required: ['id', 'userId', 'isReady'],
  fn: async ({ id, userId, isReady }) => {
    const game = get(id);

    if (!game.players[userId]) {
      throw new Errors.BadRequest('User not player in game.');
    }

    set(id, {
      players: {
        ...game.players,
        [userId]: {
          ...game.players[userId],
          isReady,
        },
      },
    });

    attemptStart(id);
    listener.emit(id);
  },
});

const setUnready = validator.wrap({

});

module.exports = {
  // Handlers
  list,
  retrieve,
  create,
  addUser,
  removeUser,
  setPlayerReady,
  setUnready,
  // For tests
  reset,
  // For real time udpates
  listener,
};
