const morgan = require('morgan');
const { Logger } = require('../../modules');

const wrap = (middleware) => (socket, next) => middleware(
  socket.request,
  {},
  next,
);

module.exports = wrap(
  morgan('tiny', { stream: Logger.stream }),
);
