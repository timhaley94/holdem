const Card = require('../card');
const Stage = require('../stage');

const counts = {
  [Stage.FLOP]: 3,
  [Stage.TURN]: 1,
  [Stage.RIVER]: 1,
};

function dealCount(stage) {
  return counts[stage] || 0;
}

function create() {
  return {
    cards: [],
    stage: Stage.first(),
  };
}

function deal({ stage, cards }) {
  const next = {};

  next.stage = Stage.next(stage);
  next.cards = [
    ...cards,
    ...Array(
      dealCount(next.stage),
    ).map(Card.create),
  ];

  return next;
}

module.exports = {
  create,
  deal,
};
