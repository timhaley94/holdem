const jwt = require('jsonwebtoken');
const config = require('../../config');
const Errors = require('../errors');

function sign(data) {
  return jwt.sign(
    { data },
    config.auth.privateKey,
  );
}

function verify({ token }) {
  try {
    return jwt.verify(token, config.auth.privateKey);
  } catch (err) {
    throw new Errors.Unauthorized('Invalid token');
  }
}

module.exports = {
  sign,
  verify,
};
