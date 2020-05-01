const { Router } = require('express');
const { BadRequest } = require('../errors');
const {
  AuthError,
  create,
  auth,
} = require('./model');

const router = Router();

const wrap = handler => (req, res) => {
  try {
    const data = handler(req, res);

    res.status(200);
    res.json(data);
  } catch (err) {
    if (err instanceof AuthError) {
      throw new BadRequest({
        message: err.message,
      });
    }

    throw err;
  }
}

router.post('/', wrap(
  (req, res) => {
    const id = create(req.body);
    const token = auth({ id, ...req.body });
    return { id, token };
  },
));

router.post('/auth', wrap(
  (req, res) => {
    const token = auth(req.body);
    return { token };
  },
));

module.exports = router;
