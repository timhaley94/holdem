// const API = require('./api');

// async function main() {
//   await API.init();
//   API.listen();
// }

// main();

const express = require('express');
const config = require('./config');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ping', (req, res) => {
  res.sendStatus(200);
});

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}.`);
});
