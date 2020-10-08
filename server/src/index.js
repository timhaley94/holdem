const API = require('./api');

async function main() {
  await API.init();
  API.listen();
}

main();
