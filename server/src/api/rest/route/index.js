const Auth = require('../auth');

const handler = (fn) => (
  async (req, res, next) => {
    try {
      const data = await fn(req, res);

      res.status(200);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = {
  handler,
  private: Auth.middleware,
};
