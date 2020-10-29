const Joi = require('@hapi/joi');
const {
  Schema,
  Types,
  model,
} = require('mongoose');
const {
  DB,
  Errors,
  Validator,
  Listener,
} = require('../../modules');
const config = require('../../config');
const Round = require('../round');

const schema = new Schema({
  round: Round.schema,
  players: [{
    userId: Schema.ObjectId,
    bankroll: Number,
    removed: Boolean,
  }],
});

schema.virtual('shouldStartRound').get(function shouldStartRound() {
  return Round.isFinished(this.round);
});

schema.method('applyWinnings', function applyWinnings() {
  const winnings = Round.winnings(this.round);

  this.players = this.players.map(
    (p) => ({
      ...p,
      bankroll: p.bankroll + winnings[p.userId],
    }),
  );
});

schema.method('startRound', async function startRound() {
  this.round = Round.create({
    players: this.players,
    lastRound: this.round || null,
  });

  await this.save();
});

async function init() {
  await DB.init();
}

let Game;

try {
  Game = model('Game');
} catch (_err) {
  Game = model('Game', schema);
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
  userIds: (
    Joi.array().items(
      Joi
        .string()
        .regex(/^[a-z0-9-]+$/)
        .min(1)
        .max(36),
    )
  ),
  userId: (
    Joi
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(1)
      .max(36)
  ),
  type: (
    Joi
      .string()
      .min(1)
      .max(36)
  ),
  data: Joi.object(),
};

const retrieve = Validator.wrap({
  validators,
  required: ['id'],
  fn: async ({ id }) => {
    const game = await Game.findById(Types.ObjectId(id)).exec();

    if (game) {
      return game;
    }

    throw new Errors.NotFound(`No game exists with id, ${id}.`);
  },
});

const create = Validator.wrap({
  validators,
  required: ['userIds'],
  fn: async ({ userIds }) => {
    const game = await Game.create({
      players: userIds.map(
        (userId) => ({
          userId,
          bankroll: config.game.defaultBankroll,
          removed: false,
        }),
      ),
    });

    await game.startRound();
  },
});

const makeMove = Validator.wrap({
  validators,
  required: ['id', 'userId', 'type', 'data'],
  fn: async ({
    id, userId, type, data,
  }) => {
    const game = await retrieve({ id });

    const methods = {
      BET: Round.bet,
      FOLD: Round.fold,
    };

    game.round = methods[type](
      game.round,
      {
        ...data,
        userId,
      },
    );

    if (game.shouldStartRound) {
      await game.startRound();
    }

    listener.emit(id);
  },
});

module.exports = {
  init,
  retrieve,
  create,
  makeMove,
  listener,
};
