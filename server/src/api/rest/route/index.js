const Auth = require('../auth');

const handler = (fn, view) => (
  async (req, res, next) => {
    try {
      const result = await fn(req, res);
      const context = { userId: req.user?.data?.id };

      const data = (
        Array.isArray(result)
          ? result.map((obj) => view(obj, context))
          : view(result, context)
      );

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
