
const Joi = require('@hapi/joi');
const {
  Schema,
  Types,
  model,
} = require('mongoose');
const config = require('../../config');
const { Errors, Listener } = require('../../modules');
const Handler = require('../handler');
const Game = require('../game');
const User = require('../user');

const playerSchema = new Schema({
  userId: Schema.ObjectId,
  isReady: Boolean,
});

const schema = new Schema(
  {
    id: String,
    name: String,
    isPrivate: Boolean,
    gameId: Schema.ObjectId,
    players: [playerSchema],
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

schema.virtual('canStart').get(function canStart() {
  return this.players.length >= config.game.minPlayers;
});

schema.virtual('isFull').get(function isFull() {
  return this.players.length >= config.game.maxPlayers;
});

schema.virtual('isEmpty').get(function isEmpty() {
  return this.players.length === 0;
});

schema.virtual('allPlayersReady').get(function allPlayersReady() {
  return (
    Object
      .values(this.players)
      .every(({ isReady }) => isReady)
  );
});

schema.virtual('isStarted').get(function isStarted() {
  return !!this.gameId;
});

schema.virtual('shouldStart').get(function shouldStart() {
  return (
    !this.isStarted
      && this.canStart
      && this.allPlayersReady
  );
});

schema.method('attemptStart', async function attemptStart() {
  if (this.shouldStart) {
    const game = await Game.create({
      userIds: this.players.map(
        (p) => p.userId,
      ),
    });

    this.gameId = game.id;
    await this.save();
  }
});

schema.method('attemptCleanup', async function attemptCleanup() {
  if (this.isEmpty) {
    await this.remove();
  }
});

let Room;

try {
  Room = model('Room');
} catch (_err) {
  Room = model('Room', schema);
}

const listener = Listener.create();

const validators = {
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

// Handlers
const exists = Handler.wrap({
  validators,
  required: ['id'],
  fn: async ({ id }) => {
    const roomExists = await Room.exists({
      _id: Types.ObjectId(id),
    });

    if (!roomExists) {
      throw new Errors.NotFound(
        `No room exists with id, ${id}.`,
      );
    }
  },
});

const list = Handler.wrap({
  validators,
  optional: ['isPrivate'],
  fn: ({ isPrivate }) => {
    const filter = {};

    if (isPrivate) {
      filter.isPrivate = isPrivate;
    }

    return Room.find(filter).exec();
  },
});

const retrieve = Handler.wrap({
  validators,
  required: ['id'],
  fn: async ({ id }, projection) => {
    const args = [Types.ObjectId(id)];

    if (projection) {
      args.push(projection);
    }

    const room = await Room.findById(...args).exec();

    if (room) {
      return room;
    }

    throw new Errors.NotFound(`No room exists with id, ${id}.`);
  },
});

const create = Handler.wrap({
  validators,
  required: ['name'],
  optional: ['isPrivate'],
  fn: async ({ name, isPrivate }) => {
    const room = await Room.create({
      name,
      isPrivate: isPrivate || false,
      gameId: null,
      players: [],
    });

    listener.emit(room._id.toString());
    return room;
  },
});

const addPlayer = Handler.wrap({
  validators,
  lockModel: 'room',
  required: ['id', 'userId'],
  fn: async ({ id, userId }) => {
    const room = await retrieve({ id });
    await User.exists({ id: userId });

    if (room.isFull) {
      throw new Errors.Conflict('Room is already full.');
    }

    const alreadyAdded = room.players.some(
      (p) => p.userId.toString() === userId,
    );

    // If two requests get fired at the same time,
    // they may still both get pushed onto the players array.
    if (!alreadyAdded) {
      room.players.push({
        userId,
        isReady: false,
      });

      // Emit here so that UI sees that the player is ready
      // while the game is being constructed.
      await room.save();
      listener.emit(id);

      await room.attemptStart();
      listener.emit(id);
    }
  },
});

const removePlayer = Handler.wrap({
  validators,
  lockModel: 'room',
  required: ['id', 'userId'],
  fn: async ({ id, userId }) => {
    const room = await retrieve({ id });
    await User.exists({ id: userId });

    room.players.pull({ userId });

    await room.save();
    await room.attemptStart();
    await room.attemptCleanup();

    listener.emit(id);
  },
});

const setPlayerReady = Handler.wrap({
  validators,
  lockModel: 'room',
  required: ['id', 'userId', 'isReady'],
  fn: async ({ id, userId, isReady }) => {
    await exists({ id });
    await User.exists({ id: userId });

    await Room.updateOne(
      { _id: Types.ObjectId(id) },
      {
        $set: {
          'players.$[p].isReady': isReady,
        },
      },
      {
        arrayFilters: [{
          'p.userId': Types.ObjectId(userId),
        }],
      },
    );

    const round = await retrieve({ id });
    await round.attemptStart();

    listener.emit(id);
  },
});

module.exports = {
  exists,
  list,
  retrieve,
  create,
  addPlayer,
  removePlayer,
  setPlayerReady,
  listener,
};
