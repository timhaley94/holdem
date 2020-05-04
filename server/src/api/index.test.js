const request = require('supertest');
const api = require('./index');

describe('API', () => {
  it('pings successfully', () => (
    request(api)
      .get('/api/ping')
      .expect(200)
  ));
});
