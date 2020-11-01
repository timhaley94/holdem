const Loaders = require('../loaders');
const Game = require('./game');
const Room = require('./room');
const User = require('./user');

async function init() {
  await Loaders.init();
}

module.exports = {
  init,
  Game,
  Room,
  User,
};
