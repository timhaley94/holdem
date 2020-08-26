const jwt = require('jsonwebtoken');
const config = require('../../../config');

const handler = (fn) => (
  async (req, res) => {
    const data = await fn(req, res);
    res.status(200);
    res.json(data);
  }
);

const private = makeMiddleware({
  secret: config.auth.privateKey,
  algorithms: ['HS256'],
});

module.exports = {
  handler,
  private,
};
