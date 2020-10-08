const { Renderer } = require('../../modules');

const User = Renderer.wrap({
  fields: ['name', 'avatarId'],
});

const Room = (room) => room;

module.exports = { User, Room };
