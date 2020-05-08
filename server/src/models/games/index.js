const Joi = require('@hapi/joi');
const { v4: uuid } = require('uuid');
const config = require('../../config');
const Users = require('../users');
const Tables = require('../tables');
const Listener = require('../listener');
const Handler = require('../handler');
const Errors = require('../errors');

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

const listFields = [
  'id',
  'name',
  'isPrivate',
  'isStarted',
  'userCount',
];

const detailFields = [
  ...listFields,
  'users',
  'tableId',
];

const renderers = {
  isStarted: ({ tableId }) => !!tableId,
  userCount: async ({ users }) => Object.values(users).length,
  users: async ({ users }) => {
    const data = await Promise.all(
      Object.entries(users).map(
        async ([id, user]) => {
          const userData = await Users.retrieve({ id });
          return {
            ...userData,
            player: user.player,
          };
        },
      ),
    );

    return data.reduce(
      (acc, user) => ({
        ...acc,
        [user.id]: user,
      }),
      {},
    );
  },
};

const render = async (game, useListView) => {
  const fields = (
    useListView
      ? listFields
      : detailFields
  );

  const entries = await Promise.all(
    fields.map(
      async (field) => {
        const value = (
          renderers[field]
            ? await renderers[field](game)
            : game[field]
        );

        return [field, value];
      },
    ),
  );

  return entries.reduce(
    (acc, [field, value]) => ({
      ...acc,
      [field]: value,
    }),
    {},
  );
};

// State
let games = {};
const listener = Listener.create();

function reset() {
  games = {};
}

function Game({ name, isPrivate }) {
  return {
    id: uuid(),
    name,
    isPrivate,
    users: {},
    tableId: null,
    cleanupTimer: null,
  };
}

// Helpers
function has(id) {
  return !!games[id];
}

function get(id) {
  if (!games[id]) {
    throw new Errors.NotFound('User does not exist');
  }

  return games[id];
}

function set(id, update) {
  games[id] = {
    ...games[id],
    ...update,
  };
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
const list = Handler.wrap({
  schemas,
  fn: async () => Promise.all(
    Object
      .values(games)
      .filter((game) => !game.isPrivate)
      .map((game) => render(game, true)),
  ),
});

const exists = Handler.wrap({
  schemas,
  required: ['id'],
  fn: async ({ id }) => has(id),
});

const abridged = Handler.wrap({
  schemas,
  required: ['id'],
  fn: async ({ id }) => render(get(id), true),
});

const retrieve = Handler.wrap({
  schemas,
  required: ['id'],
  fn: async ({ id }) => render(get(id)),
});

const create = Handler.wrap({
  schemas,
  required: ['name'],
  optional: ['isPrivate'],
  fn: async ({ name, isPrivate }) => {
    const game = Game({
      name,
      isPrivate: isPrivate || false,
    });

    games[game.id] = game;
    attemptCleanup(game.id);
    return render(game);
  },
});

const addUser = Handler.wrap({
  schemas,
  required: ['id', 'userId', 'socketId'],
  fn: async ({ id, userId, socketId }) => {
    await Users.retrieve({ id: userId });
    addConnection(id, userId, socketId);

    if (isFull(id)) {
      throw new Errors.Conflict('Game is already full.');
    }

    addPlayer(id, userId);
    clearCleanup(id);
    console.log('emitting', id);
    listener.emit(id);
  },
});

const removeUser = Handler.wrap({
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

const setPlayerReady = Handler.wrap({
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

module.exports = {
  // Handlers
  list,
  exists,
  abridged,
  retrieve,
  create,
  addUser,
  removeUser,
  setPlayerReady,
  // For tests
  reset,
  // For real time udpates
  listener,
};
