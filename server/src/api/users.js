const { Router } = require('express');
const { Users } = require('../models');
const Route = require('./route');

const router = Router();

router.post('/', Route.handler(
  (req) => Users.create(req.body),
));

router.post('/auth', Route.handler(
  (req) => Users.auth(req.body),
));

module.exports = router;
