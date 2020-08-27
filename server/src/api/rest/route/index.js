const makeMiddleware = require('express-jwt');
const config = require('../../../config');

const handler = (fn) => (
  async (req, res) => {
    const data = await fn(req, res);
    res.status(200);
    res.json(data);
  }
);

module.exports = {
  handler,
  private: makeMiddleware({
    secret: config.auth.privateKey,
    algorithms: ['HS256'],
  }),
};
