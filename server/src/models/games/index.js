const Joi = require('@hapi/joi');
const { v4: uuid } = require('uuid');
const config = require('../../config');
const Users = require('../users');
const Tables = require('../tables');
const Listener = require('../listener');
const Handler = require('../handler');
const Errors = require('../errors');

let games = {};
const listener = Listener.create();

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
  isPrivate: Joi.boolean(),
  isReady: Joi.boolean(),
};

function reset() {
  games = {};
}

function Game({ name, isPrivate }) {
  return {
    name,
    id: uuid(),
    isPrivate,
    isStarted: false,
    users: [],
    players: {},
    table: null,
    userSubscriptions: {},
  };
}

const render = async (game) => {
  const copy = { ...game };
  delete copy.userSubscriptions;

  copy.users = await Promise.all(
    copy.users.map(
      (userId) => Users.retrieve({ id: userId }),
    ),
  );

  copy.users = copy.users.reduce(
    (acc, user) => ({
      ...acc,
      [user.id]: user,
    }),
    {},
  );

  return copy;
};

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

function playerCount(id) {
  const game = get(id);
  return Object.entries(game.players).length;
}

function canStart(id) {
  return playerCount(id) >= config.game.minPlayers;
}

function isFull(id) {
  return playerCount(id) >= config.game.maxPlayers;
}

function allPlayersReady(id) {
  const game = get(id);
  return Object.values(game.players).every(
    (player) => player.isReady,
  );
}

function shouldStart(id) {
  return canStart(id) && allPlayersReady(id);
}

function attemptStart(id) {
  if (shouldStart(id)) {
    set(id, {
      isStarted: true,
      table: Tables.create(),
    });
  }
}

const list = Handler.wrap({
  schemas,
  fn: async () => Promise.all(
    Object
      .values(games)
      .filter((game) => !game.isPrivate)
      .map(render),
  ),
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
    return render(game);
  },
});

const addUser = Handler.wrap({
  schemas,
  required: ['id', 'userId'],
  fn: async ({ id, userId }) => {
    await Users.retrieve({ id: userId });
    const game = get(id);
    const cb = () => listener.emit(id);

    set(id, {
      users: [...game.users, userId],
      userSubscriptions: {
        ...game.userSubscriptions,
        [userId]: cb,
      },
    });

    Users.listener.subscribe(userId, cb);
    listener.emit(id);
  },
});

const removeUser = Handler.wrap({
  schemas,
  required: ['id', 'userId'],
  fn: async ({ id, userId }) => {
    await Users.retrieve({ id: userId });
    const game = get(id);

    Users.listener.unsubscribe(
      userId,
      game.userSubscriptions[userId],
    );

    const players = { ...game.players };
    const userSubscriptions = { ...game.userSubscriptions };

    delete players[userId];
    delete userSubscriptions[userId];

    set(id, {
      players,
      userSubscriptions,
      users: game.users.filter((x) => x !== userId),
    });

    attemptStart(id);
    listener.emit(id);
  },
});

const addPlayer = Handler.wrap({
  schemas,
  required: ['id', 'userId'],
  fn: async ({ id, userId }) => {
    addUser({ id, userId });

    if (isFull(id)) {
      throw new Errors.Conflict('Game is already full.');
    }

    const game = get(id);
    set(id, {
      players: {
        ...game.players,
        [userId]: { isReady: false },
      },
    });

    listener.emit(id);
  },
});

const isFullHandler = Handler.wrap({
  schemas,
  required: ['id'],
  fn: async ({ id }) => isFull(id),
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

function makeMove() {

}

module.exports = {
  list,
  retrieve,
  create,
  addUser,
  removeUser,
  addPlayer,
  isFull: isFullHandler,
  setPlayerReady,
  makeMove,
  reset,
  listener,
};
