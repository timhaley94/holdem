module.exports = {
  port: 8080,
  auth: {
    privateKey: 'developmentkey',
  },
  redis: {
    host: (
      process.env.NODE_ENV === 'production'
        ? 'poker-app-cache-replication-group.fojvth.ng.0001.use2.cache.amazonaws.com'
        : 'redis'
    ),
    port: 6379,
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
