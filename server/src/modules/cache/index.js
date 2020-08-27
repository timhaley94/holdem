const redis = require('redis');
const pify = require('pify');
const Errors = require('../errors');
const config = require('../../config');

function die(err) {
  // We've encountered an unrecoverable error
  throw new Errors.Fatal(`Redis error: ${err}`);
}

let readyResolve;
const ready = new Promise((resolve) => {
  readyResolve = resolve;
});

let client;

if (config.redis.url) {
  client = redis.createClient(config.redis.url);
} else {
  client = redis.createClient(
    config.redis.port,
    config.redis.host,
  );
}

client.on('ready', readyResolve);
client.on('error', die);
client.on('end', die);

function init() {
  return ready;
}

function wrap(fn) {
  const promisified = pify(fn);
  return async (...args) => {
    try {
      const result = await promisified(...args);
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
  const get = wrap(client.get);
  const set = wrap(client.set);

  return {
    get: (id) => get(getKey(id)),
    set: (obj) => set(getKey(obj.id), obj),
  };
}

module.exports = {
  init,
  getClient,
};
