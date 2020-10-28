const { Router } = require('express');
const { Room } = require('../../domain');
const { router: PlayersRouter } = require('./players');
const Route = require('./route');

const router = Router();

router.get('/', Route.handler(
  () => Room.list(),
));

router.get('/:id', Route.handler(
  (req) => Room.retrieve(req.params),
));

router.post('/', Route.handler(
  (req) => Room.create(req.body),
));

router.use('/:id/players', (req, res, next) => {
  req.roomId = req.params.id;
  next();
}, PlayersRouter);

module.exports = { router };
