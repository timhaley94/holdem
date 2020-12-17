const { connect, disconnect } = require('mongoose');
const config = require('../../config');
const { Logger } = require('../../modules');

let isConnected = false;

async function init() {
  if (!isConnected) {
    Logger.info('Connecting to mongo');

    try {
      await connect(config.mongo.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config.mongo.username,
        pass: config.mongo.password,
        autoIndex: true,
        dbName: config.mongo.dbName,
      });
    } catch (error) {
      Logger.error('Failed to connect to mongo', { error });
      throw error;
    }

    isConnected = true;
  }
}

function close() {
  if (isConnected) {
    disconnect();
    isConnected = false;
  }
}

module.exports = {
  init,
  close,
  isConnected: () => isConnected,
};
