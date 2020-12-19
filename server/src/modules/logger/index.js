const {
  createLogger,
  format,
  transports,
} = require('winston');
const config = require('../../config');

// Make sure JSON.stringify picks ups these properties
const errorFormat = (value) => {
  if (value.error && value.error instanceof Error) {
    return {
      ...value,
      error: {
        ...value.error,
        message: value.error.message,
        stack: value.error.stack,
      },
    };
  }

  return value;
};

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format(errorFormat)(),
        format.simple(),
      ),
    }),
  ],
});

const stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = {
  logger,
  debug: (...args) => {
    if (config.isDevelopment()) {
      logger.debug(...args);
    }
  },
  info: (...args) => {
    if (config.isProduction() || config.isDevelopment()) {
      logger.info(...args);
    }
  },
  warn: (...args) => logger.warn(...args),
  error: (...args) => logger.error(...args),
  errorFormat,
  stream,
};
