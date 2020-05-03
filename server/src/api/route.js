const Auth = require('./auth');

const handler = (fn) => (
  async (req, res) => {
    const data = await fn(req, res);
    res.status(200);
    res.json(data);
  }
);

module.exports = {
  handler,
  private: Auth.middleware,
};
