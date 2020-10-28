const { Server } = require('http');
const config = require('../config');
const Domain = require('../domain');
const Rest = require('./rest');
const Socket = require('./socket');

let api;

async function init() {
  // Initialize business logic layer.
  await Domain.init();

  api = Server(Rest);
  Socket(api);
}

function listen() {
  console.info(`Listening on port, ${config.port}!`);
  api.listen(config.port);
}

function getServer() {
  return api;
}

module.exports = {
  init,
  listen,
  getServer,
};
