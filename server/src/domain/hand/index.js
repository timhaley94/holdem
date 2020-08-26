const Errors = require('../../modules/errors');

function groupAttr(cards, attr) {
  return (
    Object
      .values(_.groupBy(cards, (card) => card[attr]))
      .sort((a, b) => b.length - a.length)
  );
}

const TYPES = [
  {
    name: 'FIVE_OF_A_KIND',
    evaluate: ({ groupedRanks }) => {
      if (groupedRanks[0].length > 0) {
        return groupedRanks[0];
      }

      return null;
    },
    breakTie: () => 0,
  },
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
    throw new Errors.Fatal(
      'Hand type is invalid. Likely programming error.'
    );
  }

  return index;
}

function create(cards) {
  const cardData = {
    groupedRanks: groupAttr(cards, 'rank'),
    groupedSuits: groupAttr(cards, 'suit'),
  };

  return TYPES.find(
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
  communityCards: {
    cards: communityCards,
  },
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

  // The hands are sorted but we need to group ties
  const chunkReduce = sorted.reduce(
    (acc, val) => {
      if (!acc.last) {
        // It's the first iteration
        return {
          ...acc,
          last: val,
          chunk: [val.userId],
        };
      }

      if (sort(acc.last, val) === 0) {
        // The current hand ties the last hand, so extend chunk
        return {
          ...acc,
          last: val,
          chunk: [
            ...acc.chunk,
            val.userId,
          ],
        };
      }

      // The current hand is worse than the last hand, so complete chunk
      return {
        ...acc,
        result: [
          ...acc.result,
          (
            acc.chunk.length > 1
              ? acc.chunk
              : acc.chunk[0]
          ),
        ],
        last: val,
        chunk: [val.userId],
      };
    },
    {
      result: [],
      last: null,
      chunk: [],
    },
  );

  const chunked = [
    ...chunkReduce.result,
    (
      chunkReduce.chunk.length > 1
        ? chunkReduce.chunk
        : chunkReduce.chunk[0]
    ),
  ];

  return chunked;
}

module.exports = {
  TYPES,
  create,
  sort,
};
