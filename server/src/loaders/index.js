const Cache = require('./cache');
const DB = require('./db');
const Locks = require('./locks');

async function init() {
  await Promise.all([
    DB.init(),
    Cache.init(),
  ]);
}

async function close() {
  await Promise.all([
    DB.close(),
    Cache.close(),
  ]);
}

module.exports = {
  init,
  close,
  Cache,
  DB,
  Locks,
};
