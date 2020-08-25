const redis = require('redis');
const pify = require('pify');
const Errors = require('../errors');
const Game = require('../game');

function getKey(id) {
  return `game-${id}`;
}

function wrap(fn) {
  return async () => {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      throw new Errors.DBError();
    }
  };
}

function die(err) {
  // We've encountered an unrecoverable error
  throw new Errors.FatalError(err);
}

function init() {
  let readyResolve;
  const ready = new Promise(resolve => {
    readyResolve = resolve;
  });

  const client = redis.createClient();

  client.on('ready', readyResolve);
  client.on('error', die);
  client.on('end', die);

  const get = pify(client.get);
  const set = pify(client.set);

  Game.init({
    get: wrap(
      id => get(
        getKey(id),
      ),
    ),
    set: wrap(
      game => set(
        getKey(game.id),
        game,
      ),
    ),
  });

  return ready;
}

module.exports = {
  init,
  Game,
};