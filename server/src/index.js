const API = require('./api');
const { Logger } = require('./modules');

process
  .on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at Promise', {
      reason, 
      promise,
    });
  })
  .on('uncaughtException', error => {
    Logger.error('Uncaught Exception thrown', { error });
    process.exit(1);
  });

async function main() {
  await API.init();
  API.listen();
}

main();
