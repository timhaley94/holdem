const request = require('supertest');
const { api } = require('./index');

describe('API', () => {
  it('pings successfully', () => (
    request(api)
      .get('/ping')
      .expect(200)
  ));
});
