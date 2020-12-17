const Joi = require('@hapi/joi');
const {
  Schema,
  Types,
  model,
} = require('mongoose');
const { Errors, Listener } = require('../../modules');
const config = require('../../config');
const Handler = require('../handler');
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

schema.method('applyWinnings', async function applyWinnings() {
  const winnings = Round.winnings(this.round);

  this.players = this.players.map(
    (p) => ({
      ...p.toObject(),
      bankroll: p.bankroll + winnings[p.userId],
    }),
  );

  await this.save();
});

schema.method('startRound', async function startRound() {
  this.round = Round.create({
    players: this.players,
    lastRound: this.round?.toObject(),
  });

  await this.save();
});

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
  userIds: Joi.array().items(Joi.object()),
  userId: Joi.object(),
  type: (
    Joi
      .string()
      .min(1)
      .max(36)
  ),
  data: Joi.object(),
};

const retrieve = Handler.wrap({
  validators,
  required: ['id'],
  fn: async ({ id }, projection) => {
    const args = [Types.ObjectId(id)];

    if (projection) {
      args.push(projection);
    }

    const game = await Game.findById(...args).exec();

    if (game) {
      return game;
    }

    throw new Errors.NotFound(`No game exists with id, ${id}.`);
  },
});

const create = Handler.wrap({
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
    listener.emit(game._id.toString());

    return game;
  },
});

const makeMove = Handler.wrap({
  validators,
  lockModel: 'game',
  required: ['id', 'userId', 'type', 'data'],
  fn: async ({
    id, userId, type, data,
  }) => {
    const game = await retrieve({ id });

    const methods = {
      BET: Round.bet,
      ALL_IN: Round.allIn,
      FOLD: Round.fold,
    };

    if (!methods[type]) {
      throw new Errors.Fatal(
        `${type} is not a legal move.`,
      );
    }

    game.round = await methods[type]({
      ...data,
      userId: userId.toHexString(),
      round: game.round.toObject(),
    });

    await game.save();

    if (game.shouldStartRound) {
      await game.applyWinnings();
      await game.startRound();
    }

    listener.emit(id);
  },
});

module.exports = {
  retrieve,
  create,
  makeMove,
  listener,
};
