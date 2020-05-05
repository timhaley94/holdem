const { authorize } = require('socketio-jwt');
const config = require('../config');

const middleware = authorize({
  secret: config.auth.privateKey,
  handshake: true,
});

module.exports = { middleware };
