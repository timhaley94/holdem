const { Server } = require('http');
const config = require('../config');
const Domain = require('../domain');
const { Logger } = require('../modules');
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
  Logger.info('Listening on port', {
    port: config.port,
  });

  api.listen(config.port);
}

function close() {
  api.close();
}

function getServer() {
  return api;
}

module.exports = {
  init,
  listen,
  close,
  getServer,
};
