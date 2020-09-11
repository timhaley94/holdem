const DB = require('../modules/cache');
const Game = require('./game');
const Room = require('./room');

module.exports = {
  init: DB.init,
  Game,
  Games: Room,
};
