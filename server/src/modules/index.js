const Auth = require('./auth');
const Cache = require('./cache');
const Errors = require('./errors');
const Monitoring = require('./monitoring');
const Validator = require('./validator');

async function init() {
  Monitoring.init();
  await Cache.init();
}

module.exports = {
  init,
  Auth,
  Cache,
  Errors,
  Monitoring,
  Validator,
};