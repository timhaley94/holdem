const { createClient } = require('redis');
const { Errors, Logger } = require('../../modules');
const config = require('../../config');

Logger.info('Connecting to redis', {
  url: config.redis.url,
});

const client = createClient(config.redis.url);

let isReady = false;

let readyResolve;
const ready = new Promise((resolve) => {
  readyResolve = resolve;
});

client.on('ready', () => {
  if (!isReady) {
    Logger.info('Redis connection established');

    isReady = true;
    readyResolve();
  }
});

client.on('error', (error) => {
  Logger.error('Redis error encountered', { error });
});

client.on('end', () => {
  Logger.error('Lost connection to redis');
  throw new Errors.Fatal('Lost connection to redis!');
});

client.on('warning', (...args) => {
  console.warn('Redis warning:', ...args);
});

async function init() {
  await ready;
}

function close() {
  return new Promise((resolve) => {
    client.quit(resolve);
  });
}

module.exports = { init, close, client };
