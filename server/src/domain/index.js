const DB = require('../modules/cache');
const Game = require('./game');

module.exports = {
  init: DB.init,
  Game,
};
