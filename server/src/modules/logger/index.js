const {
  createLogger,
  format,
  transports,
} = require('winston');

// Make sure JSON.stringify picks ups these properties
const errorFormat = format((value) => {
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
});

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        errorFormat(),
        format.simple(),
      ),
    }),
  ],
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
