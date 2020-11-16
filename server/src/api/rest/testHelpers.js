const express = require('express');
const request = require('supertest');
const Errors = require('./errors');

function testApp(app) {
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

function testRouter(router) {
  const app = express();

  app.use(express.json());
  app.use(router);
  app.use(Errors.middleware);

  return testApp(app);
}

module.exports = { testApp, testRouter };
