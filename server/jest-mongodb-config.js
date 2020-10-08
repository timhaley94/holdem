module.exports = {
  mongodbMemoryServerOptions: {
    debug: true,
    binary: {
      version: '4.4.1',
      skipMD5: true
    },
    instance: {
      dbName: 'holdem'
    },
    autoStart: false
  }
};
