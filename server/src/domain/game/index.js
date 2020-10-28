const { DB, Listener } = require('../../modules');

async function init() {
  await DB.init();
}

const listener = Listener.create();

const retrieve = () => {};

const create = () => {};

const makeMove = () => {};

module.exports = {
  init,
  retrieve,
  create,
  makeMove,
  listener,
};
