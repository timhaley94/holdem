const { Logger } = require('../modules');
const Cache = require('./cache');
const DB = require('./db');
const Locks = require('./locks');

async function init() {
  Logger.info('Initializing loaders');

  try {
    await Promise.all([
      DB.init(),
      Cache.init(),
    ]);
  } catch (error) {
    Logger.error('Fail to initialize loaders', { error });
    throw error;
  }
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
