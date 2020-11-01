const Joi = require('@hapi/joi');
const { Schema } = require('mongoose');
const { Errors } = require('../../modules');
const Utils = require('../../utils');
const Handler = require('../handler');
const Card = require('../card');
const Deck = require('../deck');
const Hand = require('../hand');
const Purse = require('../purse');
const Solver = require('../solver');
const Stage = require('../stage');

const schema = new Schema({
  players: [{
    userId: Schema.ObjectId,
    hasFolded: Boolean,
    pocketCards: [Card.schema],
    hand: Hand.schema,
    purse: Purse.schema,
  }],
  currentPlayer: Schema.ObjectId,
  deck: Deck.schema,
  communityCards: [Card.schema],
  stage: Stage.schema,
  isComplete: Boolean,
});

function nextTurnOrder(ids, lastIds) {
  let firstIdIndex = Utils.mapFind(
    lastIds.slice(1),
    (id) => {
      const i = ids.findIndex((x) => x === id);
      return i >= 0 ? i : null;
    },
  );

  if (!firstIdIndex) {
    firstIdIndex = (
      ids.findIndex((x) => x === lastIds[0]) || 0
    );
  }

  return [
    ...ids.slice(firstIdIndex),
    ...ids.slice(0, firstIdIndex),
  ];
}

function create({ players, lastRound }) {
  const userIds = players.map((p) => p.userId);
  const lastUserIds = (
    lastRound
      && lastRound.players
      ? lastRound.players.map((p) => p.userId)
      : null
  );

  const turnOrder = (
    lastUserIds
      ? nextTurnOrder(userIds, lastUserIds)
      : userIds
  );

  return {
    players: turnOrder.map((id) => {
      const {
        userId,
        bankroll,
      } = players.find(
        (p) => p.userId === id,
      );

      return {
        userId,
        hasFolded: false,
        purse: Purse.create(bankroll),
      };
    }),
    currentPlayer: turnOrder[0],
    deck: Deck.create(),
    stage: Stage.first(),
    isComplete: false,
  };
}

function winnings({ isComplete, players }) {
  if (!isComplete) {
    throw new Errors.Fatal('Round is not complete.');
  }

  return players.reduce(
    (acc, p) => ({
      ...acc,
      [p.userId]: Purse.resolve(p.purse),
    }),
    {},
  );
}

function isFinished({ isComplete }) {
  return isComplete;
}

function createHands(round) {
  return {
    ...round,
    players: round.players.map(
      (player) => {
        if (player.hasFolded) {
          return player;
        }

        return {
          ...player,
          hand: Hand.create([
            ...player.pocketCards,
            ...round.communityCards,
          ]),
        };
      },
    ),
  };
}

function distributeWinnings(round) {
  const hands = (
    round.players
      .filter((player) => !player.hasFolded)
      .reduce(
        (acc, player) => ({
          ...acc,
          [player.userId]: player,
        }),
        {},
      )
  );

  const wagers = (
    round.players
      .reduce(
        (acc, player) => ({
          ...acc,
          [player.userId]: player.purse.wagered,
        }),
        {},
      )
  );

  const solution = Solver.run(hands, wagers);

  return {
    ...round,
    players: round.players.map(
      (player) => ({
        ...player,
        purse: Purse.win(
          player.purse,
          solution[player.userId] || 0,
        ),
      }),
    ),
  };
}

function completeRound(round) {
  let next = { ...round };

  next = distributeWinnings(next);
  next = createHands(next);

  next.isComplete = true;
  return next;
}

function dealPocketCards(round) {
  let { deck } = round;

  const players = round.players.map(
    (player) => {
      const result = Deck.deal(deck, 2);
      deck = result.deck;

      return {
        ...player,
        pocketCards: result.cards,
      };
    },
  );

  return {
    ...round,
    deck,
    players,
  };
}

function communityCount(stage) {
  return {
    [Stage.FLOP]: 3,
    [Stage.TURN]: 1,
    [Stage.RIVER]: 1,
  }[stage] || 0;
}

function dealCommunityCards(round) {
  const { deck, cards } = Deck.deal(
    round.deck,
    communityCount(round.stage),
  );

  return {
    ...round,
    deck,
    communityCards: [
      ...round.communityCards,
      ...cards,
    ],
  };
}

function advanceStage(round) {
  const next = {
    ...round,
    stage: Stage.next(round.stage),
  };

  if (next.stage === Stage.PRE_FLOP) {
    return dealPocketCards(next);
  }

  if (next.stage === Stage.POST_RIVER) {
    return completeRound(next);
  }

  return dealCommunityCards(next);
}

function advance(round) {
  const i = round.players.findIndex(
    (player) => player.userId === round.currentPlayer,
  );

  if (i + 1 >= round.players.length) {
    return advanceStage({
      ...round,
      currentPlayer: round.players[0].userId,
    });
  }

  return {
    ...round,
    currentPlayer: (
      round
        .players[i + 1]
        .userId
    ),
  };
}

const validators = {
  round: Joi.object(),
  userId: (
    Joi
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(1)
      .max(36)
  ),
  amount: (
    Joi
      .number()
      .integer()
      .min(0)
  ),
};

function highestBet({ players }) {
  const bets = players.map(
    ({ purse }) => purse.wagered,
  );

  return Math.max(...bets);
}

const bet = Handler.wrap({
  validators,
  required: ['round', 'userId', 'amount'],
  fn: ({ round, userId, amount }) => {
    if (round.isComplete) {
      throw new Errors.BadRequest('Can\'t bet on complete round');
    }

    if (round.currentPlayer !== userId) {
      throw new Errors.BadRequest(`${userId} is not the current player`);
    }

    // check if bet is valid, throw otherwise
    const player = round.players.find(
      (p) => p.userId === userId,
    );

    const nextBet = player.purse.wagered + amount;
    const isValid = nextBet >= highestBet(round);

    if (isValid) {
      throw new Errors.BadRequest(`${amount} is not a valid bet at this time.`);
    }

    const next = {
      ...round,
      players: round.players.map(
        (p) => {
          if (p.userId !== userId) {
            return p;
          }

          return {
            ...p,
            purse: Purse.bet(
              p.purse,
              amount,
            ),
          };
        },
      ),
    };

    return advance(next);
  },
});

const allIn = Handler.wrap({
  validators,
  required: ['round', 'userId'],
  fn: ({ round, userId }) => bet({
    round,
    userId,
    // This looks goofy put Purse makes sure you
    // can only bet what you have.
    amount: Infinity,
  }),
});

function remainingPlayers({ players }) {
  return (
    players
      .filter((p) => !p.hasFolded)
      .length
  );
}

const fold = Handler.wrap({
  validators,
  required: ['round', 'userId', 'amount'],
  fn: ({ round, userId }) => {
    if (round.isComplete) {
      throw new Errors.BadRequest('Can\'t fold on complete round');
    }

    const next = {
      ...round,
      players: round.players.map(
        (player) => {
          if (player.userId !== userId) {
            return player;
          }

          return {
            ...player,
            hasFolded: true,
          };
        },
      ),
    };

    if (remainingPlayers(next) <= 1) {
      return completeRound(next);
    }

    return advance(next);
  },
});

module.exports = {
  schema,
  create,
  bet,
  allIn,
  fold,
  winnings,
  isFinished,
};
