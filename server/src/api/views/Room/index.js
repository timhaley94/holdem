const Renderer = require('../Renderer');

const Room = Renderer.wrap({
  fields: [
    'name',
    'isPrivate',
    'gameId',
    'players',
  ],
});

module.exports = Room;
