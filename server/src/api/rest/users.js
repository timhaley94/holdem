const { Router } = require('express');
const { Errors } = require('../../modules');
const { User } = require('../../domain');
const Views = require('../views');
const Route = require('./route');

const router = Router();

router.post('/', Route.handler(
  async (req) => {
    const user = await User.create(req.body);
    return Views.User(user);
  },
));

router.post('/auth', Route.handler(
  (req) => User.auth(req.body),
));

router.patch('/:id', Route.private, Route.handler(
  async (req) => {
    if (req.params.id !== req.user.data.id) {
      throw new Errors.Unathorized('Cannot update another user.');
    }

    const { id } = req.user.data;

    await User.update({ ...req.body, id });
    const user = await User.retrieve({ id });

    return Views.User(user);
  },
));

module.exports = { router };
