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
    const { data } = jwt.verify(token, config.auth.privateKey);
    return data;
  } catch (err) {
    throw new Errors.Unauthorized('Invalid token');
  }
}

module.exports = {
  sign,
  verify,
};
