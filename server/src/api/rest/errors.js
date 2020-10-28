const { Errors } = require('../../modules');

function middleware(err, req, res, next) {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof Errors.BaseError) {
    status = err.status;
    message = err.message;
  }

  res.status(status);
  res.json({ message });

  next();
}

module.exports = { middleware };
