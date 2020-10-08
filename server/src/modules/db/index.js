const { connect } = require('mongoose');
const config = require('../../config');

let db;

async function init() {
  if (!db) {
    db = await connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  return db;
}

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  init,
  close,
};
