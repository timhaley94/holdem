const { authorize } = require('socketio-jwt');
const config = require('../config');

module.exports = authorize({
  secret: config.auth.privateKey,
  handshake: true,
});
