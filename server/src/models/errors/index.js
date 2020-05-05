const types = {
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Conflict: 409,
};

class HTTPError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

const error = (status) => (
  class extends HTTPError {
    constructor(...args) {
      super(...args);
      this.status = status;
    }
  }
);

const errors = Object.entries(types).reduce(
  (acc, [name, status]) => ({
    ...acc,
    [name]: error(status),
  }),
  {},
);

module.exports = {
  ...errors,
  HTTPError,
};
