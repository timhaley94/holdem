const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Logger, Errors } = require('../../modules');
const Route = require('./route');
const { middleware: errorMiddleware } = require('./errors');
const Users = require('./users');
const Rooms = require('./rooms');

const api = express();

// Middleware
api.use(morgan('tiny', { stream: Logger.stream }));
api.use(cors());
api.use(express.json());

// Routes
api.get('/ping', (req, res) => res.sendStatus(200));
api.use('/users', Users.router);
api.use('/rooms', Rooms.router);

api.use(Route.handler(() => {
  throw new Errors.NotFound('Resource does not exist.');
}));

// Error Middleware
api.use(errorMiddleware);

module.exports = api;
