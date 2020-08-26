const Sentry = require("@sentry/node");
const config = require('../config');

function init() {
  if (config.sentry.url) {
    Sentry.init({
      dsn: config.sentry.url,
      environment: process.env.NODE_ENV,
    });
  }
}

module.exports = {
  init,
  middleware: {
    requestHandler: Sentry.Handlers.requestHandler,
    errorHandler: Sentry.Handlers.errorHandler,
  },
  info: console.info,
  warn: console.warn,
  error: console.error,
};