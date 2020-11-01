const Redlock = require('redlock');
const { client } = require('../cache');
const { Errors } = require('../../modules');
const config = require('../../config');

const {
  ttl,
  driftFactor,
  retryCount,
  retryDelay,
  retryJitter,
} = config.redis;

const redlock = new Redlock(
  [client],
  {
    driftFactor,
    retryCount,
    retryDelay,
    retryJitter,
  },
);

redlock.on('clientError', (err) => {
  console.error('A redis error has occurred:', err);
});

function lockName(model, id) {
  return `lock-${model}-${id}`;
}

async function take(model, id) {
  const lock = await redlock.lock(
    lockName(model, id),
    ttl,
  );

  let isUnlocked = false;

  const unlock = async () => {
    isUnlocked = true;
    await lock.unlock();
  };

  setTimeout(() => {
    if (!isUnlocked) {
      throw new Errors.Fatal('Lock held too long.');
    }
  }, ttl);

  return unlock;
}

module.exports = { take };
