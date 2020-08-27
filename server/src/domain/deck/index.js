const _ = require('lodash');
const { Errors } = require('../../modules');
const Card = require('../card');

function create() {
  return _.shuffle(Card.all());
}

function deal([card, ...deck]) {
  if (!card) {
    throw new Errors.Fatal('Deck depleted');
  }

  return { card, deck };
}

module.exports = {
  create,
  deal,
};
