module.exports = {
  port: 8080,
  auth: {
    privateKey: 'developmentkey',
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
