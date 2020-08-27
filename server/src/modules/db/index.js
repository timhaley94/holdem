const dynamoose = require('dynamoose');
const config = require('../../config');

function init() {
  dynamoose.logger.providers.set(console);

  if (config.isDevelopment) {
    dynamoose.aws.ddb.local(config.dynamo.url);
  }
}

function Schema() {
  
}

module.exports = { init };