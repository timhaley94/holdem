class DBError extends Error {
  constructor(err) {
    super('Unable to interact with DB');
    this.name = 'DBError';
    this.err = err;
  }
}

class FatalError extends Error {
  constructor(err) {
    super('Engine crashing');
    this.name = 'FatalError';
    this.err = err;
  }
}

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RequestError';
  }
}

module.exports = {
  DBError,
  FatalError,
  RequestError,
};
