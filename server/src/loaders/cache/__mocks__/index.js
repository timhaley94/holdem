const { createClient } = require('redis-mock');

const client = createClient();

let isReady = false;

let readyResolve;
const ready = new Promise((resolve) => {
  readyResolve = resolve;
});

client.on('ready', () => {
  if (!isReady) {
    isReady = true;
    readyResolve();
  }
});

async function init() {
  await ready;
}

module.exports = { init, client };
