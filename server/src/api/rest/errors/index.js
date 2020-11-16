const { Errors } = require('../../../modules');

const defaultStatus = 500;
const defaultMessage = 'Internal Server Error';

function middleware(err, req, res) {
  let status = defaultStatus;
  let message = defaultMessage;

  if (err instanceof Errors.BaseError) {
    status = err.status;
    message = err.message;
  }

  res.status(status);
  res.json({ message });
}

module.exports = {
  middleware,
  defaultStatus,
  defaultMessage,
};
