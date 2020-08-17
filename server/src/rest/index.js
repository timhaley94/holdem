const express = require('express');
const cors = require('cors');
const Errors = require('./errors');
const Users = require('./users');
const Games = require('./games');

const api = express();

// Middleware
api.use(cors());
api.use(express.json());

// Routes
api.get('/ping', (req, res) => res.sendStatus(200));
api.use('/users', Users.router);
api.use('/games', Games.router);

// Error Middleware
api.use(Errors.middleware);

module.exports = api;
