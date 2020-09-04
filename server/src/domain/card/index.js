const _ = require('lodash');
const SUITS = ['H', 'C', 'D', 'S'];
const RANKS = _.range(2, 15);

const ALL = SUITS.map(
  (suit) => RANKS.map(
    (rank) => `${suit}${rank}`,
  ),
).reduce(
  (acc, val) => [
    ...acc,
    ...val,
  ],
);

function all() {
  return ALL;
}

function suit(card) {
  return card[0];
}

function rank(card) {
  return parseInt(card.slice(1), 10)
}

function sort(a, b) {
  return rank(b) - rank(a);
}

function isAce(card) {
  return rank(card) === 14;
}

module.exports = {
  all,
  suit,
  rank,
  sort,
  isAce,
  SUITS,
  RANKS,
};
