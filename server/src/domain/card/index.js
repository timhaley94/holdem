const _ = require('lodash');

const SUITS = ['H', 'C', 'D', 'S'];
const RANKS = _.range(2, 15);

const ALL = _.flatten(
  SUITS.map(
    (s) => RANKS.map(
      (r) => `${s}${r}`,
    ),
  ),
);

const schema = String;

function all() {
  return ALL;
}

function suit(card) {
  return card.slice(0, 1);
}

function rank(card) {
  return parseInt(card.slice(1), 10);
}

function sort(a, b) {
  return rank(b) - rank(a);
}

function isAce(card) {
  return rank(card) === 14;
}

module.exports = {
  SUITS,
  RANKS,
  schema,
  all,
  suit,
  rank,
  sort,
  isAce,
};
