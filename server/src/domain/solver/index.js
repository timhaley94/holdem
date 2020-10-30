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

  const { tieIndexes } = Hand.TYPES.findIndex(
    (type) => type.name === a.type,
  );

  if (!tieIndexes) {
    return 0;
  }

  return compareCards(
    a.match,
    b.match,
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
  );

  const chunked = Utils.chunkIf(
    sorted,
    ([, a], [, b]) => sort(a, b) === 0,
  );

  return Utils.deepMap(
    chunked,
    ([userId]) => userId,
  );
}

function run(hands, wagers) {
  const results = orderHands(hands);
  const wagersCopy = { ...wagers };

  const { awarded } = results.reduce(
    (acc, userId) => {
      const wagered = wagersCopy[userId];

      if (wagered <= acc.highest) {
        return acc;
      }

      const diff = wagered - acc.highest;
      const losers = (
        Object
          .entries(wagersCopy)
          .filter(
            ([id, wager]) => (
              id !== userId
                && wager > acc.highest
            ),
          )
          .length
      );

      return {
        ...acc,
        highest: wagered,
        awarded: {
          ...acc.awarded,
          [userId]: diff * losers,
        },
      };
    },
    {
      highest: 0,
      awarded: {},
    },
  );

  return awarded;
}

module.exports = { run };
