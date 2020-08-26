const Joi = require('@hapi/joi');
const { v4: uuid } = require('uuid');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');
const Listener = require('../listener');
const Handler = require('../../modules/validator');

const users = {};
const listener = Listener.create();

const schemas = {
  id: (
    Joi
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(1)
      .max(36)
  ),
  secret: (
    Joi
      .string()
      .alphanum()
      .min(10)
      .max(36)
  ),
  metadata: Joi.object(),
};

const assertId = (id) => {
  if (!users[id]) {
    throw new Errors.NotFound('User does not exist');
  }
};

const retrieve = Handler.wrap({
  schemas,
  required: ['id'],
  fn: async ({ id }) => {
    assertId(id);
    const { metadata } = users[id];
    return { id, metadata };
  },
});

const create = Handler.wrap({
  schemas,
  required: ['secret'],
  optional: ['metadata'],
  fn: async ({ secret, metadata }) => {
    const id = uuid();

    users[id] = {
      id,
      secret,
      metadata: metadata || null,
    };

    return retrieve({ id });
  },
});

const auth = Handler.wrap({
  schemas,
  required: ['id', 'secret'],
  fn: async ({ id, secret }) => {
    if (!users[id]) {
      users[id] = { id, secret };
    }

    if (users[id].secret !== secret) {
      throw new Errors.Unauthorized('Invalid secret');
    }

    return {
      token: Auth.sign({ id }),
    };
  },
});

const update = Handler.wrap({
  schemas,
  required: ['id', 'metadata'],
  fn: async ({ id, metadata }) => {
    assertId(id);
    users[id].metadata = metadata;
    listener.emit(id);
    return retrieve({ id });
  },
});

module.exports = {
  schemas,
  retrieve,
  create,
  auth,
  update,
  listener,
};
