const { Server } = require('http');
const config = require('../config');
const Rest = require('./rest');
const Socket = require('./socket');

const api = Server(Rest);
Socket(api);

function listen() {
  api.listen(config.port);
}

module.exports = {
  api,
  listen,
};
