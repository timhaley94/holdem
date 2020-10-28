const Modules = require('../modules');
const Game = require('./game');
const Room = require('./room');
const User = require('./user');

async function init() {
  await Modules.init();
}

module.exports = {
  init,
  Game,
  Room,
  User,
};
