const { v4: uuid } = require('uuid');
const Utils = require('../../../utils');
const { Errors } = require('../../../modules');
const {
  redis: {
    ttl,
    retryCount,
    retryDelay,
  },
} = require('../../../config');

const locks = {};
const lockName = (model, id) => `lock-${model}-${id}`;

async function take(model, id) {
  const key = lockName(model, id);
  const value = uuid();

  const get = async (n = retryCount) => {
    if (locks[key]) {
      await Utils.sleep(retryDelay);

      if (n <= 1) {
        throw new Errors.Fatal(
          `Could not get lock for ${model}, ${id}.`,
        );
      }

      return get(n - 1);
    }

    locks[key] = value;
    return value;
  };

  await get();

  const timeout = setTimeout(
    () => {
      delete locks[key];
      throw new Errors.Fatal('Lock held too long.');
    },
    ttl,
  );

  return () => {
    clearTimeout(timeout);
    delete locks[key];
  };
}

module.exports = { take };
