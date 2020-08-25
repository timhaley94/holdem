const DB = require('./db');
const Game = require('./game');

module.exports = {
  init: DB.init,
  Game,
};
