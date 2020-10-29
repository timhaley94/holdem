const _ = require('lodash');
const { Errors } = require('../../modules');
const Card = require('../card');

const schema = [Card.schema];

function create() {
  return _.shuffle(Card.all());
}

function deal(deck, count = 1, cards = []) {
  if (count === 0) {
    return {
      cards,
      deck,
    };
  }

  const [card, ...nextDeck] = deck;

  if (!card) {
    throw new Errors.Fatal('Deck depleted');
  }

  return deal(
    nextDeck,
    count - 1,
    [
      ...cards,
      card,
    ],
  );
}

module.exports = {
  create,
  deal,
  schema,
};
