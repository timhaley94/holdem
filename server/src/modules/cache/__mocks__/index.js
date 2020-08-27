const redis = require('redis-mock');

const client = redis.createClient();

function init() {
  return Promise.resolve();
}

function getClient() {
  return client;
}

module.exports = {
  init,
  getClient,
};
