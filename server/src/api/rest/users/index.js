const { Router } = require('express');
const { Errors } = require('../../../modules');
const { User } = require('../../../domain');
const Views = require('../../views');
const Route = require('../route');

const router = Router();

router.post('/', Route.handler(
  (req) => User.create(req.body),
  Views.User,
));

router.post('/auth', Route.handler(
  (req) => User.auth(req.body),
  Views.User.Auth,
));

router.patch('/:id', Route.private, Route.handler(
  async (req) => {
    if (req.params.id !== req.user.data.id) {
      const e = new Errors.Unauthorized('Cannot update another user.');
      throw e;
    }

    const { id } = req.user.data;

    await User.update({ ...req.body, id });
    const user = await User.retrieve({ id });

    return Views.User(user, {
      userId: req.user.data.id,
    });
  },
  Views.User,
));

module.exports = { router };
