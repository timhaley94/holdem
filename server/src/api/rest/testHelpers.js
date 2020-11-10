const express = require('express');
const request = require('supertest');
const Errors = require('./errors');

function testRouter(router) {
  const app = express();

  app.use(express.json());
  app.use(router);
  app.use(Errors.middleware);

  return [
    'get',
    'post',
    'patch',
    'put',
    'delete',
  ].reduce(
    (acc, method) => ({
      ...acc,
      [method]: (...args) => request(app)[method](...args),
    }),
    {},
  );
}

module.exports = { testRouter };
