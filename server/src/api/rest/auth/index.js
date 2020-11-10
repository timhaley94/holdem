const makeMiddleware = require('express-jwt');
const { Errors } = require('../../../modules');
const config = require('../../../config');

const base = makeMiddleware({
  secret: config.auth.privateKey,
  algorithms: ['HS256'],
});

function middleware(req, res, next) {
  base(req, res, (err) => {
    if (err && err.name === 'UnauthorizedError') {
      const e = new Errors.Unauthorized(err.message);
      next(e);
    } else {
      next();
    }
  });
}

module.exports = { middleware };
