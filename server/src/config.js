const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  isDevelopment,
  port: 8080,
  auth: {
    privateKey: 'developmentkey',
  },
  sentry: {
    url: (
      isDevelopment
        ? null
        : 'https://409a1cd26da541f78ba2d829362b574f@o439099.ingest.sentry.io/5405304'
    ),
  },
  dynamo: {
    url: (
      isDevelopment
        ? 'http://dynamo:8000'
        : null
    )
  },
  redis: (
    isDevelopment
      ? {
        host: 'redis',
        port: 6379,
      }
      : {
        url: 'poker-app-cache-replication-group.fojvth.ng.0001.use2.cache.amazonaws.com',
      }
  ),
  socket: {
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  game: {
    maxPlayers: 9,
    minPlayers: 2,
    cleanupTimeout: 100000,
    defaultBankroll: 50,
  },
};
