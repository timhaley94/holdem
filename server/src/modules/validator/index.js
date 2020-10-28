const Joi = require('@hapi/joi');
const Errors = require('../errors');

const wrap = ({
  validators,
  required,
  optional,
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

  return (data = {}, ...args) => {
    const { error, value } = schema.validate(data);

    if (error) {
      throw new Errors.BadRequest(error.message);
    }

    return fn(value, ...args);
  };
};

module.exports = { wrap };
