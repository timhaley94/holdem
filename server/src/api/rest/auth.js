const makeMiddleware = require('express-jwt');
const config = require('../config');

const middleware = makeMiddleware({
  secret: config.auth.privateKey,
  algorithms: ['HS256'],
});

module.exports = { middleware };
