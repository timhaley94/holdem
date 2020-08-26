module.exports = {
  port: 8080,
  auth: {
    privateKey: 'developmentkey',
  },
  sentry: {
    url: (
      process.env.NODE_ENV === 'development'
        ? null
        : 'https://409a1cd26da541f78ba2d829362b574f@o439099.ingest.sentry.io/5405304'
    ),
  },
  redis: {
    host: (
      process.env.NODE_ENV === 'development'
        ? 'redis'
        : 'poker-app-cache-replication-group.fojvth.ng.0001.use2.cache.amazonaws.com'
    ),
    port: 6379,
  },
  socket: {
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  engine: {
    defaultBankroll: 50,
  },
  game: {
    maxPlayers: 9,
    minPlayers: 2,
    cleanupTimeout: 100000,
  },
};
