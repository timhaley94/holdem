const { authorize } = require('socketio-jwt');
const morgan = require('morgan');
const { Logger } = require('../../../modules');
const config = require('../../../config');

// This method turns express middleware into socket middleware.
const wrap = (middleware) => (socket, next) => middleware(
  socket.request,
  {},
  next,
);

const Auth = authorize({
  secret: config.auth.privateKey,
  handshake: true,
});

const Logging = wrap(
  morgan('tiny', { stream: Logger.stream }),
);

module.exports = { Auth, Logging };
