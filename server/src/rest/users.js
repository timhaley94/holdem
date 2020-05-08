const { Router } = require('express');
const { Errors, Users } = require('../models');
const Route = require('./route');

const router = Router();

router.post('/', Route.handler(
  (req) => Users.create(req.body),
));

router.post('/auth', Route.handler(
  (req) => Users.auth(req.body),
));

router.patch('/:id', Route.private, Route.handler(
  (req) => {
    console.log('here');
    console.log(req.params.id);
    console.log(req.user.data.id);
    if (req.params.id !== req.user.data.id) {
      throw new Errors.Unathorized('Cannot update another user.');
    }

    return Users.update({
      ...req.body,
      id: req.user.data.id,
    });
  },
));

module.exports = { router };
