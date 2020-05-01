const { Server } = require('http');
const API = require('./api');
const Socket = require('./socket');
const config = require('./config');

const server = Server(API);
Socket(server);
server.listen(config.port);
