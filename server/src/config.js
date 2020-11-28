module.exports = {
  port: 8080,
  auth: {
    privateKey: 'developmentkey',
  },
  redis: {
    ttl: 1000,
    driftFactor: 0.01,
    retryCount: 2,
    retryDelay: 100,
    retryJitter: 100,
    url: (
      process.env.NODE_ENV === 'development'
        ? 'redis://redis:6379'
        : `redis://${process.env.REDIS_URL}`
    ),
  },
  mongo: {
    url: (
      process.env.NODE_ENV === 'development'
        ? 'mongodb://mongo/holdem'
        : process.env.MONGO_URL
    ),
    username: process.env.MONGO_USERNAME || null,
    password: process.env.MONGO_PASSWORD || null,
    dbName: 'holdem',
  },
  socket: {
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  game: {
    maxPlayers: 9,
    minPlayers: 2,
    cleanupTimeout: 100000,
    defaultBankroll: 300,
  },
};
