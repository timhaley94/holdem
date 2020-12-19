const Renderer = require('../renderer');

const Room = Renderer.wrap({
  fields: [
    'name',
    'isPrivate',
    'gameId',
    'players',
  ],
});

module.exports = Room;
