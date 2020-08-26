const API = require('./api');
const Domain = require('./domain');
const Modules = require('./modules');

async function main() {
  await Modules.init();
  Domain.init();
  API.listen();
}

main();
