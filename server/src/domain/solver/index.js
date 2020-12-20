const _ = require('lodash');
const Utils = require('../../utils');
const Errors = require('../../modules/errors');
const Card = require('../card');
const Hand = require('../hand');

function typeRank(name) {
  const index = Hand.TYPES.findIndex(
    (type) => type.name === name,
  );

  if (index < 0) {
    throw new Errors.Fatal('Hand type is invalid');
  }

  return index;
}

function compareCards(a, b, indexes = _.range(0, 5)) {
  if (indexes.length === 0) {
    return 0;
  }

  const [i, ...rest] = indexes;
  return Card.sort(a[i], b[i]) || compareCards(a, b, rest);
}

function sort(a, b) {
  const aRank = typeRank(a.type);
  const bRank = typeRank(b.type);

  if (aRank !== bRank) {
    // If a is better, value will be negative,
    // if b i better, value will be positive.
    return aRank - bRank;
  }

  const { tieIndexes } = Hand.TYPES.find(
    (type) => type.name === a.type,
  );

  if (!tieIndexes) {
    return 0;
  }

  return compareCards(
    a.cards,
    b.cards,
    tieIndexes,
  );
}

function orderHands(hands) {
  const sorted = (
    Object
      .entries(hands)
      .sort(
        ([, a], [, b]) => sort(a, b),
      )
      .map(([userId, hand]) => ({
        userId,
        hand,
      }))
  );

  const chunked = Utils.chunkIf(
    sorted,
    ({ hand: a }, { hand: b }) => sort(a, b) === 0,
  );

  return Utils.deepMap(
    chunked,
    ({ userId }) => userId,
  );
}

function reduce(
  {
    wagers,
    awarded,
    offset,
  },
  userId,
  i,
  length,
) {
  const wager = wagers[userId];

  const {
    pot,
    leftovers,
  } = (
    Object
      .entries(wagers)
      .reduce(
        (acc, [loserId, loserWager]) => {
          const contribution = Math.min(wager, loserWager);
          const leftover = Math.max(loserWager - contribution, 0);
          return {
            ...acc,
            pot: acc.pot + contribution,
            leftovers: {
              ...acc.leftovers,
              [loserId]: leftover,
            },
          };
        },
        {
          pot: 0,
          leftovers: {},
        },
      )
  );

  const winnings = (pot / (length - i)) + offset;

  return {
    wagers: leftovers,
    awarded: {
      ...awarded,
      [userId]: winnings,
    },
    offset: winnings,
  };
}

function allocate(hands, wagers, awarded = {}) {
  const [head, ...losers] = hands;
  const winners = (
    Array.isArray(head)
      ? head
      : [head]
  );

  const {
    wagers: newWagers,
    awarded: newAwarded,
  } = (
    winners
      .sort((a, b) => wagers[a] - wagers[b])
      .reduce(
        (acc, val, i) => reduce(
          acc,
          val,
          i,
          winners.length,
        ),
        {
          wagers,
          awarded,
          offset: 0,
        },
      )
  );

  if (losers.length > 0) {
    return allocate(
      losers,
      newWagers,
      newAwarded,
    );
  }

  return newAwarded;
}

function clean(awarded, wagered) {
  // Rounds everyone's winnings down to the
  // nearest dollar. It's a lot nice on the eyes
  // to look at whole numbers. :)
  const copy = {};

  Object.keys(wagered).forEach(
    (userId) => {
      copy[userId] = Math.floor(
        awarded[userId] || 0,
      );
    },
  );

  return copy;
}

function run(hands, wagers) {
  const results = orderHands(hands);
  const awarded = allocate(results, wagers);
  return clean(awarded, wagers);
}

module.exports = { run };
