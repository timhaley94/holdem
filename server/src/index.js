const Domain = require('../domain');
const config = require('./config');
const api = require('./api');

Domain.init().then(
  () => {
    api.listen(config.port);
  },
);

