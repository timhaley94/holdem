const { Schema } = require('mongoose');
const { Errors } = require('../../modules');
const Card = require('../card');
const Deck = require('../deck');
const Hand = require('../hand');
const Purse = require('../purse');
// const Solver = require('../solver');
const Stage = require('../stage');

const schema = new Schema({
  players: [{
    userId: Schema.ObjectId,
    folded: Boolean,
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

function create(/* { players, lastRound } */) {
  return {
    // players
    // currentPlayer: turnOrder[0],
    deck: Deck.create(),
    communityCards: [],
    stage: Stage.first(),
    isComplete: false,
  };
}

// function completeRound(round) {

// }

// function dealPocketCards(round) {
// const {
//   deck,
//   pocketCards,
// } = round.turnOrder.reduce(
//   (acc, userId) => {
//     const result = Deck.deal(acc.deck, 2);
//     return {
//       ...acc,
//       deck: result.deck,
//       pocketCards: {
//         ...acc.pocketCards,
//         [userId]: result.cards,
//       },
//     };
//   },
//   {
//     deck: round.deck,
//     pocketCards: {},
//   },
// );

// return {
//   ...round,
//   deck,
//   pocketCards,
// };
// }

// function communityCount(stage) {
//   return {
//     [Stage.FLOP]: 3,
//     [Stage.TURN]: 1,
//     [Stage.RIVER]: 1,
//   }[stage] || 0;
// }

// function dealCommunityCards(round) {
//   const { deck, cards } = Deck.deal(
//     round.deck,
//     communityCount(round.stage),
//   );

//   return {
//     ...round,
//     deck,
//     communityCards: [
//       ...round.communityCards,
//       ...cards,
//     ],
//   };
// }

// function advanceStage(round) {
//   const next = {
//     ...round,
//     stage: Stage.next(round.stage),
//   };

//   if (next.stage === Stage.PRE_FLOP) {
//     return dealPocketCards(round);
//   }

//   if (next.stage === Stage.POST_RIVER) {
//     return completeRound(round);
//   }

//   return dealCommunityCards(round);
// }

// function advance(round) {

// }

function bet(round, userId /* amount */) {
  if (round.isComplete) {
    throw new Errors.BadRequest('Can\'t bet on complete round');
  }

  if (round.currentPlayer !== userId) {
    throw new Errors.BadRequest(`${userId} is not the current player`);
  }

  // const next = {
  //   ...round,
  // };
}

function fold(round /* userId */) {
  if (round.isComplete) {
    throw new Errors.BadRequest('Can\'t fold on complete round');
  }

  // const next = {
  //   ...round,
  //   pot: Pot.fold(round.pot, userId),
  //   turnOrder: round.turnOrder.filter(
  //     (id) => id !== userId,
  //   ),
  //   pocketCards: _.omit(
  //     round.pocketCards,
  //     [userId],
  //   ),
  // };

  // if (next.turnOrder.length <= 1) {
  //   return completeRound(next);
  // }

  // if (next.currentPlayer === userId) {
  //   return advance(next);
  // }

  // return next;
}

module.exports = {
  schema,
  create,
  bet,
  fold,
};
