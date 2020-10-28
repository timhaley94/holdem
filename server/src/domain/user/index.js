const Joi = require('@hapi/joi');
const {
  Schema,
  Types,
  model,
} = require('mongoose');
const {
  Auth,
  Errors,
  Validator,
  Listener,
} = require('../../modules');

const schema = new Schema({
  name: String,
  secret: String,
  avatarId: String,
});

let User;

try {
  User = model('User');
} catch (_err) {
  User = model('User', schema);
}

const listener = Listener.create();

const validators = {
  id: (
    Joi
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(1)
      .max(36)
  ),
  name: Joi.string().max(36),
  secret: (
    Joi
      .string()
      .alphanum()
      .min(10)
      .max(36)
  ),
  avatarId: (
    Joi
      .string()
      .alphanum()
      .max(36)
  ),
  token: Joi.object(),
};

const exists = Validator.wrap({
  validators,
  required: ['id'],
  fn: async ({ id }) => {
    const result = await User.exists({ _id: id });

    if (!result) {
      throw new Errors.NotFound(
        `No user exists with id, ${id}.`,
      );
    }
  },
});

const retrieve = Validator.wrap({
  validators,
  required: ['id'],
  fn: async ({ id }, projection) => {
    const args = [Types.ObjectId(id)];

    if (projection) {
      args.push(projection);
    }

    const user = await User.findById(...args).exec();

    if (user) {
      return user;
    }

    throw new Errors.NotFound(`No user exists with id, ${id}.`);
  },
});

const create = Validator.wrap({
  validators,
  required: ['secret'],
  optional: ['name', 'avatarId'],
  fn: async (data) => {
    try {
      const user = await User.create(data);
      listener.emit(user._id.str);
      return user;
    } catch (e) {
      throw new Errors.Fatal('Failed to create user.');
    }
  },
});

const auth = Validator.wrap({
  validators,
  required: ['id', 'secret'],
  fn: async ({ id, secret }) => {
    const user = await retrieve(
      { id },
      { secret: 1 },
    );

    if (user.secret !== secret) {
      throw new Errors.Unauthorized('Invalid secret');
    }

    return {
      token: Auth.sign({ id }),
    };
  },
});

const update = Validator.wrap({
  validators,
  required: ['id'],
  optional: ['name', 'avatarId'],
  fn: async ({ id, ...data }) => {
    try {
      await User.updateOne(
        { _id: Types.ObjectId(id) },
        { $set: data },
      ).exec();
    } catch (_e) {
      throw new Errors.Fatal(
        `Failed to update user, ${id}.`,
      );
    }

    listener.emit(id);
  },
});

module.exports = {
  exists,
  retrieve,
  create,
  auth,
  update,
  listener,
};
