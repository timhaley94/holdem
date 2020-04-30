const express = require('express');
const cors = require('cors');
const Users = require('../users');
const Errors = require('../errors');

const api = express();
const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Routes
router.get('/ping', (req, res) => res.sendStatus(200));
router.use('/users', Users.router);

// Error Middleware
router.use(Errors.middleware);

api.use('/api', router);
module.exports = api;
