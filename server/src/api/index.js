const { Server } = require('http');
const Rest = require('../rest');
const Socket = require('../socket');
const config = require('../config');

const api = Server(Rest);
Socket(api);

function listen() {
  api.listen(config.port);
}

module.exports = { listen };
