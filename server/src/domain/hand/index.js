const _ = require('lodash');
const Errors = require('../../modules/errors');
const Utils = require('../../utils');
const Card = require('../card');

// Group cards according to an attribute (e.g. rank, suit)
function groupAttr(cards, attr) {
  return (
    Object
      .values(
        _.groupBy(cards, (card) => Card[attr](card))
      )
      .sort((a, b) => b.length - a.length)
  );
}

// Compare two sets of cards, elementwise, until you find
// a pair of elements that aren't equivalent.
function compareCards(a, b, indexes = _.range(0, 5)) {
  if (indexes.length === 0) {
    return 0;
  }

  const [i, ...rest] = indexes;
  return Card.sort(a[i], b[i]) || sortCards(a, b, Rest);
}

function bestCards(cards, count = 5) {
  return (
    _.flatten(cards)
      .sort(Card.sort)
      .slice(0, count)
  );
}

function pairType(...shape) {
  return {
    pairShape: [4],
    tieIndexes: [0, 4],
    evaluate: ({ groupedRanks }) => {
      if (!Utils.hasShape(groupedRanks, shape)) {
        return null;
      }

      const pairedCards = _.flatten(
        groupedRanks.slice(0, shape.length)
      );

      const kickers = bestCards(
        groupedRanks.slice(shape.length),
        5 - pairedCards.length
      );

      return [...pairedCards, ...kickers];
    },
  };
}

function evaluateStraight(cards) {
  const chunked = Utils.chunkIf(
    cards.sort(Card.sort),
    (a, b) => {
      const diff = Card.rank(a) - Card.rank(b);
      return diff === 1;
    },
  );

  const match = chunked.find(chunk => chunk.length >= 5);

  if (!match) {
    return null;
  }
  
  return match.slice(0, 5);
}

function evaluateStraightFlush(groupedSuits) {
  if (!Utils.hasShape(groupedSuits, [5])) {
    return null;
  }

  const match = evaluateStraight(groupedSuits[0]);

  if (!match) {
    return null;
  }

  return bestCards(match, 5);
}

const TYPES = [
  {
    name: 'ROYAL_FLUSH',
    evaluate: ({ groupedSuits }) => {
      const match = evaluateStraightFlush(groupedSuits);

      if (!match || !Card.isAce(match[0])) {
        return null;
      }

      return match;
    },
  },
  {
    name: 'STRAIGHT_FLUSH',
    tieIndexes: [0],
    evaluate: ({ groupedSuits }) => (
      evaluateStraightFlush(groupedSuits)
    ),
  },
  {
    name: 'FOUR_OF_A_KIND',
    ...pairType(4),
  },
  {
    name: 'FULL_HOUSE',
    ...pairType(3, 2),
  },
  {
    name: 'FLUSH',
    tieIndexes: _.range(0, 5),
    evaluate: ({ groupedSuits }) => {
      if (!Utils.hasShape(groupedSuits, [5])) {
        return null;
      }
  
      return bestCards(groupedSuits[0]);
    },
  },
  {
    name: 'STRAIGHT',
    tieIndexes: [0],
    evaluate: ({ cards }) => evaluateStraight(cards),
  },
  {
    name: 'THREE_OF_A_KIND',
    ...pairType(3),
  },
  {
    name: 'TWO_PAIR',
    ...pairType(2, 2),
  },
  {
    name: 'PAIR',
    ...pairType(2),
  },
  {
    name: 'HIGH_CARD',
    tieIndexes: _.range(0, 5),
    evaluate: ({ cards }) => bestCards(cards),
  },
];

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
    cards,
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
        match,
      };
    },
  );
}

function sort(a, b) {
  const aRank = typeRank(a.type);
  const bRank = typeRank(b.type);

  if (aRank !== bRank) {
    // If a is better, value will be negative,
    // if b i better, value will be positive.
    return aRank - bRank;
  }

  const { tieIndexes } = TYPES.findIndex(
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

  return chunked;

  return Utils.deepMap(
    chunked,
    ({ userId }) => userId,
  );
}

module.exports = {
  TYPES,
  create,
  solve,
};
