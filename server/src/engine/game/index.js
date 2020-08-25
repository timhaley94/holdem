const Bank = require("../bank");

let get;
let set;

function init(db) {
  get = db.get;
  set = db.set;
}

function getter() {
  return get;
}

function setter() {
  return set;
}

function create(userIds) {
  return {
    id: uuid(),
    lastUpdated: new Date(),
    round: Round.create(userIds),
    previousRounds: [],
  };
}

function endGame(game, round) {
  return {
    ...game,
    winner: Bank.getWinner(round.bank),
    round: null,
    previousRounds: [
      ...game.previousRounds,
      round,
    ],
  };
}

function startNextRound(game, round) {
  return {
    ...game,
    round: Round.from(round),
    previousRounds: [
      ...game.previousRounds,
      round,
    ],
  };
}

async function move({ id, ...rest }) {
  let game = await get(id);
  const round = Round.move(game.round, ...rest);

  if (!round) {
    return null;
  }

  if (Round.isFinal(round)) {
    // The game is over
    game = endGame(game);
  } else if (Round.isOver(round)) {
    // The round, but not game, is over
    game = startNextRound(game);
  } else {
    // Something changed
    game.round = round;
  }

  await set(game);
  return game;
}

module.exports = {
  init,
  getter,
  setter,
  create,
  move,
};