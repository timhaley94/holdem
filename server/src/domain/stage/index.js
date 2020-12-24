const PRE_FLOP = 'PRE_FLOP';
const FLOP = 'FLOP';
const TURN = 'TURN';
const RIVER = 'RIVER';

const stages = [
  PRE_FLOP,
  FLOP,
  TURN,
  RIVER,
];

const schema = String;

function first() {
  return stages[0];
}

function next(stage) {
  const index = stages.findIndex((s) => s === stage);

  if (index < 0) {
    throw new Error('Invalid stage');
  }

  if (index === stages.length - 1) {
    return null;
  }

  return stages[index + 1];
}

module.exports = {
  PRE_FLOP,
  FLOP,
  TURN,
  RIVER,
  stages,
  first,
  next,
  schema,
};
