const redis = require('redis');
const pify = require('pify');
const Errors = require('../errors');

function die(err) {
  // We've encountered an unrecoverable error
  throw new Errors.FatalError(err);
}

let client;

function init() {
  let readyResolve;
  const ready = new Promise((resolve) => {
    readyResolve = resolve;
  });

  client = redis.createClient();
  client.on('ready', readyResolve);
  client.on('error', die);
  client.on('end', die);

  return ready;
}

function wrap(method, ) {
  return async () => {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      throw new Errors.DBError();
    }
  };
}

function getClient(namespace) {

}

module.exports = {
  init,
  getClient,
};
