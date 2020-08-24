const _ = require('lodash');

const suits = ['H', 'C', 'D', 'S'];
const ranks = _.range(2, 15);

function create() {
  return {
    id: uuid(),
    suit: _.sample(suits),
    rank: _.sample(ranks),
  };
}

module.exports = {
  create,
  suits,
  ranks,
};
