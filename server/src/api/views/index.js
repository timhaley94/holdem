const { Renderer } = require('../../modules');

const User = Renderer.wrap({
  fields: ['name', 'avatarId'],
});

const Room = (room) => room;
const Game = (game) => game;

module.exports = { User, Room, Game };
