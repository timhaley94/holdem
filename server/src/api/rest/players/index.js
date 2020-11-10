const { Router } = require('express');
const { Room } = require('../../../domain');
const { Errors } = require('../../../modules');
const Route = require('../route');

const router = Router();

router.use(Route.private);

router.post('/', Route.handler(
  (req) => {
    const id = req.roomId;
    const userId = req.user.data.id;

    return Room.addPlayer({ id, userId });
  },
));

router
  .route('/:id')
  .all((req, res, next) => {
    if (req.params.id !== req.user.data.id) {
      throw new Errors.Unathorized('Cannot edit a player other than yourself.');
    }

    next();
  })
  .patch(Route.handler(
    (req) => {
      const id = req.roomId;
      const userId = req.user.data.id;

      return Room.setPlayerReady({
        id,
        userId,
        ...req.body,
      });
    },
  ))
  .delete(Route.handler(
    (req) => {
      const id = req.roomId;
      const userId = req.user.data.id;

      return Room.removePlayer({ id, userId });
    },
  ));

module.exports = { router };
