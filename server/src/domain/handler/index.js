const Joi = require('@hapi/joi');
const { Errors } = require('../../modules');
const { Locks } = require('../../loaders');

function takeLock({ id }, name) {
  if (!name) {
    return null;
  }

  if (!id) {
    throw new Errors.Fatal(
      'Id is required to take a lock.',
    );
  }

  return Locks.take(name, id);
}

const wrap = ({
  validators,
  required,
  optional,
  lockModel,
  fn,
}) => {
  const requiredFields = (
    required
      ? required.map((field) => [field, true])
      : []
  );

  const optionalFields = (
    optional
      ? optional.map((field) => [field, false])
      : []
  );

  const fields = [
    ...requiredFields,
    ...optionalFields,
  ];

  const schema = Joi.object(
    fields.reduce(
      (acc, [field, isRequired]) => ({
        ...acc,
        [field]: (
          isRequired
            ? validators[field].required()
            : validators[field]
        ),
      }),
      {},
    ),
  );

  return async (data = {}, ...args) => {
    const { error, value } = schema.validate(data);

    if (error) {
      throw new Errors.BadRequest(error.message);
    }

    const unlock = await takeLock(data, lockModel);

    try {
      const result = await fn(value, ...args);
      return result;
    } finally {
      if (unlock) {
        await unlock();
      }
    }
  };
};

module.exports = { wrap };
