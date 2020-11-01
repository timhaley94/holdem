const { createClient } = require('redis');
const { Errors } = require('../../modules');
const config = require('../../config');

const client = createClient(config.redis.url);

let isReady = false;

let readyResolve;
const ready = new Promise((resolve) => {
  readyResolve = resolve;
});

client.on('ready', () => {
  if (!isReady) {
    console.info('Redis connection established.');

    isReady = true;
    readyResolve();
  }
});

client.on('error', (error) => {
  console.error(error);
});

client.on('end', () => {
  throw new Errors.Fatal('Lost connection to redis!');
});

client.on('warning', (...args) => {
  console.warn('Redis warning:', ...args);
});

async function init() {
  await ready;
}

module.exports = { init, client };
