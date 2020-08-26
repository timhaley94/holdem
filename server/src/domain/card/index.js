const _ = require('lodash');
const { v4: uuid } = require('uuid');

const SUITS = ['H', 'C', 'D', 'S'];
const RANKS = _.range(2, 15);

function create() {
  return {
    id: uuid(),
    suit: _.sample(suits),
    rank: _.sample(ranks),
  };
}

function sort(a, b) {
  return a.rank - b.rank;
}

module.exports = {
  create,
  sort,
  SUITS,
  RANKS,
};
