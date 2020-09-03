const Errors = require('../../modules/errors');
const Utils = require('../../utils');

function groupAttr(cards, attr) {
  return (
    Object
      .values(_.groupBy(cards, (card) => card[attr]))
      .sort((a, b) => b.length - a.length)
  );
}

const TYPES = [
  {
    name: 'ROYAL_FLUSH',
    evaluate: (cards) => {},
    breakTie: () => 0,
  },
  {
    name: 'STRAIGHT_FLUSH',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'FOUR_OF_A_KIND',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'FULL_HOUSE',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'FLUSH',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'STRAIGHT',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'THREE_OF_A_KIND',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'TWO_PAIR',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'PAIR',
    evaluate: (cards) => {},
    breakTie: (a, b) => {

    },
  },
];

const typeNames = TYPES.map(({ name }) => name);
const tieBreakers = TYPES.reduce(
  (acc, { name, ...rest }) => ({
    ...acc,
    [name]: rest[attr],
  }),
  {},
);

function typeRank(name) {
  const index = TYPES.findIndex(
    (type) => type.name === name,
  );

  if (index < 0) {
    throw new Errors.Fatal('Hand type is invalid');
  }

  return index;
}

function create(cards) {
  const cardData = {
    groupedRanks: groupAttr(cards, 'rank'),
    groupedSuits: groupAttr(cards, 'suit'),
  };

  return Utils.mapFind(
    TYPES,
    ({ name, evaluate }) => {
      const match = evaluate(cardData);

      if (!match) {
        return null;
      }

      return {
        type: name,
        ...match,
      };
    },
  );
}

function sort(a, b) {
  const aRank = typeRank(a.type);
  const bRank = typeRank(b.type);

  if (aRank === bRank) {
    return tieBreakers[a.type](a, b);
  }

  // If a is better, value will be negative,
  // if b i better, value will be positive.
  return aRank - bRank;
}

function solve({
  pocketCards,
  communityCards,
}) {
  const sorted = (
    Object
      .entries(pocketCards)
      .map(
        ([userId, cards]) => ({
          userId,
          hand: create([
            ...cards,
            ...communityCards,
          ]),
        }),
      )
      .sort(
        (a, b) => sort(a.hand, b.hand),
      )
  );

  const chunked = Utils.chunkIf(
    sorted,
    (a, b) => sort(a.hand, b.hand) === 0,
  );

  return Utils.deepMap(
    chunked,
    ({ userId }) => userId,
  );
}

module.exports = {
  TYPES,
  solve,
};
