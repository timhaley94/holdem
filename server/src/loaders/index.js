const Cache = require('./cache');
const DB = require('./db');
const Locks = require('./locks');

async function init() {
  await Promise.all([
    DB.init(),
    Cache.init(),
  ]);
}

module.exports = {
  init,
  Cache,
  DB,
  Locks,
};
