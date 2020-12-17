const { Router } = require('express');
const { Game } = require('../../../domain');
const Views = require('../../views');
const Route = require('../route');

const router = Router();

router.get('/:id', Route.handler(
  (req) => Game.retrieve(req.params),
  Views.Game,
));

router.post('/:id/moves', Route.private, Route.handler(
  (req) => Game.makeMove({
    id: req.params.id,
    userId: req.user.data.id,
    ...req.body,
  }),
  Views.NoOp,
));

module.exports = { router };
