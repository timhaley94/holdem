const Loaders = require('../loaders');
const Game = require('./game');
const Room = require('./room');
const User = require('./user');

async function init() {
  await Loaders.init();
}

async function close() {
  await Loaders.close();
}

module.exports = {
  init,
  close,
  Game,
  Room,
  User,
};
