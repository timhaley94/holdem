const TYPES = [
  {
    name: 'ROYAL_FLUSH',
    evaluate: cards => {},
    breakTie: () => 0,
  },
  {
    name: 'STRAIGHT_FLUSH',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'FOUR_OF_A_KIND',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'FULL_HOUSE',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'FLUSH',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'STRAIGHT',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'THREE_OF_A_KIND',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'TWO_PAIR',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
  {
    name: 'PAIR',
    evaluate: cards => {},
    breakTie: (a, b) => {

    },
  },
];

const typeNames = TYPES.map(({ name }) => name);

function buildMap(attr) {
  return TYPES.reduce(
    (acc, { name, ...rest }) => ({
      ...acc,
      [name]: rest[attr],
    }),
    {},
  );
}

const evaluators = buildMap('evaluate');
const tieBreakers = buildMap('breakTie');

function create(cards) {
  return {
    cards,
    typeName,
  };
}

function sort(a, b) {

}

module.exports = {
  TYPES,
  evaluate,
  sort,
};