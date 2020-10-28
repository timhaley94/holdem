module.exports = {
  port: 8080,
  auth: {
    privateKey: 'developmentkey',
  },
  redis: {
    host: (
      process.env.NODE_ENV === 'development'
        ? 'redis'
        : 'poker-app-cache-replication-group.fojvth.ng.0001.use2.cache.amazonaws.com'
    ),
    port: 6379,
  },
  mongo: {
    url: (
      process.env.NODE_ENV === 'development'
        ? 'mongodb://mongo/holdem'
        : process.env.MONGO_URL
    ),
  },
  socket: {
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  game: {
    maxPlayers: 9,
    minPlayers: 2,
    cleanupTimeout: 100000,
  },
};
