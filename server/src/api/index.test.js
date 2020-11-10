const request = require('supertest');
const API = require('./index');

describe('API', () => {
  beforeAll(API.init);
  afterAll(API.close);

  it('pings successfully', () => (
    request(API.getServer())
      .get('/ping')
      .expect(200)
  ));
});
