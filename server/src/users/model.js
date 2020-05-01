const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('../config');

const key = config.auth.privateKey;
const users = {};

class AuthError extends Error {
  constructor(...args) {
    super(...args);
    this.status = 400;
  }
}

function create({ secret }) {
  const id = uuid();
  users[id] = { id, secret };

  return id;
}

function auth({ id, secret }) {
  if (!id) {
    throw new AuthError('Id required');
  }

  if (!users[id]) {
    users[id] = { id, secret };
  }

  if (users[id].secret !== secret) {
    throw new AuthError('Invalid secret');
  }

  return jwt.sign({ data: { id } }, key);
}

function verify({ token }) {
  try {
    jwt.verify(token, key);
  } catch(err) {
    throw new AuthError('Invalid token');
  }
}

module.exports = {
  AuthError,
  create,
  auth,
  verify,
};
