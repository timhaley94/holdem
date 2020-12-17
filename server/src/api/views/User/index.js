const Renderer = require('../Renderer');

const Auth = Renderer.wrap({
  fields: ['token'],
});

const User = Renderer.wrap({
  fields: ['name', 'avatarId'],
});

User.Auth = Auth;

module.exports = User;
