function middleware(err, req, res, next) {
  const { status, message } = err;
  res.status(status || 500);
  res.json({ message: message || 'Internal Server Error' });
  next();
}

class BadRequest extends Error {
  constructor({ message }) {
    super();
    this.message = message;
    this.status = 400;
  }
}

module.exports = {
  middleware,
  BadRequest,
};
