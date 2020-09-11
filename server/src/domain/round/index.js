const _ = require('lodash');
const Deck = require('../deck');
const Stage = require('../stage');
const { Errors } = require('../../modules');

function create({
  turnOrder,
  bankroll,
}) {
  let pot = Pot.create(bankroll || null);
  pot = Pot.bet();
  pot = Pot.bet();

  return {
    turnOrder,
    currentPlayer: turnOrder[0],
    isComplete: false,
    winner: null,
    deck: Deck.create(),
    pocketCards: {},
    communityCards: [],
    stage: Stage.first(),
    pot,
  };
}

function completeRound(round) {

}

function dealPocketCards(round) {
  const {
    deck,
    pocketCards,
  } = round.turnOrder.reduce(
    (acc, userId) => {
      const result = Deck.deal(acc.deck, 2);
      return {
        ...acc,
        deck: result.deck,
        pocketCards: {
          ...acc.pocketCards,
          [userId]: result.cards,
        },
      };
    },
    {
      deck: round.deck,
      pocketCards: {},
    },
  );

  return {
    ...round,
    deck,
    pocketCards,
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
    communityCount(round.stage)
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
    return dealPocketCards(round);
  }

  if (next.stage === Stage.POST_RIVER) {
    return completeRound(round);
  }

  return dealCommunityCards(round);
}

function advance(reound) {

}

function bet(round, userId, amount) {
  if (round.isComplete) {
    throw new Errors.BadRequest(`Can't bet on complete round`);
  }

  if (round.currentPlayer !== userId) {
    throw new Errors.BadRequest(`${userId} is not the current player`);
  }

  const next = {
    ...round,
  };
}

function fold(round, userId) {
  if (round.isComplete) {
    throw new Errors.BadRequest(`Can't fold on complete round`);
  }

  const next = {
    ...round,
    pot: Pot.fold(round.pot, userId),
    turnOrder: round.turnOrder.filter(
      id => id !== userId
    ),
    pocketCards: _.omit(
      round.pocketCards,
      [userId],
    ),
  };

  if (next.turnOrder.length <= 1) {
    return completeRound(next);
  }

  if (next.currentPlayer === userId) {
    return advance(next);
  }
  
  return next;
}

module.exports = {
  create,
  bet,
  fold,
};
