const Engine = require('../engine');
const config = require('./config');
const api = require('./api');

Engine.init().then(
  () => {
    api.listen(config.port);
  },
);

