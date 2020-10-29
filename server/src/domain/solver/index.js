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

function run(hands) {
  const sorted = hands.sort(
    (a, b) => sort(a.hand, b.hand),
  );

  const chunked = Utils.chunkIf(
    sorted,
    (a, b) => sort(a.hand, b.hand) === 0,
  );

  return chunked;
}

module.exports = { run };
