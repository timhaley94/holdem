const MAX_PLAYERS = 9;
const MIN_PLAYERS = 2;

const games = {};

function get(id) {
  const game = games[id] || null;

  if (!game) {
    throw new Error(`Game with id, ${id}, does not exist.`);
  }

  return game;
}

function _new({ id, playerId, emit }) {
  // const game = {
  //   id,
  //   emit,
  //   users: [playerId],
  //   isStarted: false
  // };
  //
  // game.canStart = () => game.users.length >= MIN_PLAYERS;
  // game.isFull = () => game.users.length >= MAX_PLAYERS;
  //
  // game.emitPlayerAdded = () => game.emit('player_added', {
  //   isStarted: false,
  //   canStart: game.canStart(),
  // });
  //
  // game.emitPlayerRemoved = () => game.emit('player_removed', {
  //
  // });
  //
  // games[id] = game;
  // game.emitPlayerAdded();
}

function addPlayer({ id, playerId }) {
  // const game = get(id);
  //
  // if (game.isFull()) {
  //   throw new Error('Game is already full.');
  // }
  //
  // game.users.push(playerId);
  // game.emitPlayerAdded();
}

function removePlayer() {

}

function start() {

}

function makeMove() {

}

module.exports = {
  new: _new,
  addPlayer,
  removePlayer,
  start,
  makeMove
};
