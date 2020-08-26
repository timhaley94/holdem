const express = require('express');
const cors = require('cors');
const Modules = require('../../modules');
const Users = require('./users');
const Games = require('./games');

const api = express();

// Middleware
api.use(Modules.Monitoring.handlers.requestHandler);
api.use(cors());
api.use(express.json());

// Routes
api.get('/ping', (req, res) => res.sendStatus(200));
api.use('/users', Users.router);
api.use('/games', Games.router);

// Error Middleware
api.use(Modules.Monitoring.handlers.errorHandler);
api.use((err, req, res, next) => {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof BaseError) {
    status = err.status;
    message = err.message;
  }

  res.status(status);
  res.json({ message });

  next();
});

module.exports = api;
