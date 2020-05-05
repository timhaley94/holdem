const { Server } = require('http');
const Rest = require('../rest');
const Socket = require('../socket');

const api = Server(Rest);
Socket(api);

module.exports = api;
