const _ = require('lodash');
const { Schema } = require('mongoose');

const SUITS = ['H', 'C', 'D', 'S'];
const RANKS = _.range(2, 15);

const ALL = SUITS.map(
  (suit) => RANKS.map(
    (rank) => ({
      suit,
      rank,
    }),
  ),
).reduce(
  (acc, val) => [
    ...acc,
    ...val,
  ],
);

const schema = new Schema({
  rank: Number,
  suit: String,
});

function all() {
  return ALL;
}

function sort(a, b) {
  return b.rank - a.rank;
}

function isAce(card) {
  return card.rank === 14;
}

module.exports = {
  SUITS,
  RANKS,
  schema,
  all,
  sort,
  isAce,
};
