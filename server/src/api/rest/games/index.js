const { Router } = require('express');
const { Games } = require('../../../domain');
const Route = require('../route');

const router = Router();

router.get('/', Route.handler(
  () => Games.list(),
));

router.get('/:id', Route.handler(
  (req) => Games.retrieve(req.params),
));

router.post('/', Route.handler(
  (req) => Games.create(req.body),
));

module.exports = { router };
