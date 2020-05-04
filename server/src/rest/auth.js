const makeMiddleware = require('express-jwt');
const config = require('../config');

const middleware = makeMiddleware({
  secret: config.auth.privateKey,
});

module.exports = { middleware };
