const Joi = require('@hapi/joi');
const Errors = require('../errors');

const wrap = ({
  schemas,
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
            ? schemas[field].required()
            : schemas[field]
        ),
      }),
      {},
    ),
  );

  return (data = {}) => {
    const { error, value } = schema.validate(data);

    if (error) {
      throw new Errors.BadRequest(error.message);
    }

    return fn(value);
  };
};

module.exports = { wrap };
