const Auth = require('./auth');
const DB = require('./db');
const Errors = require('./errors');
const Listener = require('./listener');
const Renderer = require('./renderer');
const Validator = require('./validator');

async function init() {
  await DB.init();
}

module.exports = {
  init,
  Auth,
  DB,
  Errors,
  Listener,
  Renderer,
  Validator,
};
