const redis = require('redis');
const pify = require('pify');
const Errors = require('../errors');

function die(err) {
  // We've encountered an unrecoverable error
  throw new Errors.Fatal(`Redis error: ${err}`);
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
      throw new Errors.Fatal(err);
    }
  };
}

function getClient(namespace) {
  if (!client) {
    throw new Errors.Fatal('Redis not ready');
  }

  if (!namespace) {
    throw new Errors.Fatal('namespace is required');
  }

  const getKey = (id) => `${namespace}-${id}`;

  return {
    get: wrap(
      (id) => client.get(getKey(id))
    ),
    set: wrap(
      (obj) => client.set(
        obj.id,
        obj,
      ),
    ),
  };
}

module.exports = {
  init,
  getClient,
};
