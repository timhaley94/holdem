const { Schema } = require('mongoose');
const { Errors } = require('../../modules');
const Utils = require('../../utils');
const Card = require('../card');
const Deck = require('../deck');
const Hand = require('../hand');
const Purse = require('../purse');
const Solver = require('../solver');
const Stage = require('../stage');
const config = require('../../config');

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
  callOnly: Boolean,
  isComplete: Boolean,
});

function highestBet({ players }) {
  const bets = players.map(
    ({ purse }) => purse.wagered,
  );

  return Math.max(...bets);
}

function isEligible(player) {
  return !player.hasFolded && !Purse.isAllIn(player.purse);
}

function eligiblePlayers(round) {
  return round.players.filter(isEligible);
}

function nextPlayerId(round) {
  const currentIndex = round.players.findIndex(
    (player) => player.userId.toString() === round.currentPlayer.toString(),
  );

  const players = [
    ...round.players.slice(currentIndex),
    ...round.players.slice(0, currentIndex),
  ];

  return players.find(isEligible).userId;
}

function firstPlayerId(round) {
  return eligiblePlayers(round)[0].userId;
}

function nextTurnOrder(ids, lastIds) {
  const firstIdIndex = Utils.mapFind(
    [
      ...lastIds.slice(1),
      lastIds[0],
    ],
    (id) => {
      const i = ids.findIndex(
        (x) => x.toString() === id.toString(),
      );

      return i >= 0 ? i : null;
    },
  );

  if (!firstIdIndex) {
    throw new Errors.Fatal(
      'Could not find first id index for new round',
    );
  }

  return [
    ...ids.slice(firstIdIndex),
    ...ids.slice(0, firstIdIndex),
  ];
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
          [player.userId]: Hand.create([
            ...player.pocketCards,
            ...round.communityCards,
          ]),
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

function advanceStage(round) {
  const nextStage = Stage.next(round.stage);

  if (!nextStage) {
    return completeRound({
      ...round,
      stage: nextStage,
    });
  }

  const { deck, cards } = Deck.deal(
    round.deck,
    communityCount(nextStage),
  );

  return {
    ...round,
    stage: nextStage,
    deck,
    communityCards: [
      ...(round.communityCards || []),
      ...cards,
    ],
  };
}

function allCalled(round) {
  const b = highestBet(round);
  return eligiblePlayers(round).every(
    (player) => player.purse.wagered === b,
  );
}

function advance(round) {
  const areAllCalled = allCalled(round);

  if (round.callOnly && areAllCalled) {
    return advanceStage(round);
  }

  const i = round.players.findIndex(
    (player) => player.userId.toString() === round.currentPlayer.toString(),
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

function bet({ round, userId, amount }) {
  if (round.isComplete) {
    throw new Errors.BadRequest('Can\'t bet on complete round');
  }

  if (round.currentPlayer.toString() !== userId.toString()) {
    throw new Errors.BadRequest(`${userId} is not the current player`);
  }

  // check if bet is valid, throw otherwise
  const player = round.players.find(
    (p) => p.userId.toString() === userId.toString(),
  );

  const nextBet = player.purse.wagered + amount;
  const isValid = nextBet >= highestBet(round);

  if (!isValid) {
    throw new Errors.BadRequest(`${amount} is not a valid bet at this time.`);
  }

  const next = {
    ...round,
    players: round.players.map(
      (p) => {
        if (p.userId.toString() !== userId.toString()) {
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
}

function allIn({ round, userId }) {
  return bet({
    round,
    userId,
    // This looks goofy put Purse makes sure you
    // can only bet what you have.
    amount: Infinity,
  });
}

function remainingPlayers({ players }) {
  return (
    players
      .filter((p) => !p.hasFolded)
      .length
  );
}

function fold({ round, userId }) {
  if (round.isComplete) {
    throw new Errors.BadRequest('Can\'t fold on complete round');
  }

  const next = {
    ...round,
    players: round.players.map(
      (player) => {
        if (player.userId.toString() !== userId.toString()) {
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
}

function create({ players, lastRound }) {
  if (players.length < 2) {
    throw new Errors.Fatal(
      'Tried to create new round with less than 2 players',
    );
  }

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

  const smallBlind = turnOrder[0];
  const bigBlind = turnOrder[1];

  let round = {
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
    currentPlayer: smallBlind,
    deck: Deck.create(),
    stage: Stage.first(),
    isComplete: false,
  };

  round = bet({
    round,
    userId: smallBlind,
    amount: config.game.smallBlind,
  });

  round = bet({
    round,
    userId: bigBlind,
    amount: config.game.bigBlind,
  });

  round = dealPocketCards(round);
  return round;
}

module.exports = {
  schema,
  create,
  bet,
  allIn,
  fold,
  winnings,
  isFinished,
};
