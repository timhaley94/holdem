const { connect, disconnect } = require('mongoose');
const config = require('../../config');

let isConnected = false;

async function init() {
  if (!isConnected) {
    await connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
