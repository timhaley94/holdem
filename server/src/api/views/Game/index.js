const Renderer = require('../Renderer');

const Purse = Renderer.wrap({
  fields: ['bankroll', 'wagered'],
  mapping: {
    bankroll: (v) => parseInt(v, 10),
    wagered: (v) => parseInt(v, 10),
  },
});

const Player = Renderer.wrap({
  fields: [
    'userId',
    'hasFolded',
    'purse',
    'pocketCards',
  ],
  permissions: {
    pocketCards: ({ userId }, context) => (
      userId === context.userId
    ),
  },
  mapping: {
    purse: Purse,
  },
});

const Round = Renderer.wrap({
  fields: [
    'players',
    'currentPlayer',
    'communityCards',
    'stage',
    'isComplete',
  ],
  mapping: {
    players: (players, context) => (
      players.map((p) => Player(p, context))
    ),
  },
});

const Game = Renderer.wrap({
  fields: ['round'],
  mapping: {
    round: Round,
  },
});

module.exports = Game;
