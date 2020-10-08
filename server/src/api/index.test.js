const request = require('supertest');
const API = require('./index');

describe('API', () => {
  beforeAll(async () => {
    await API.init();
  });

  it('pings successfully', () => (
    request(API.getServer())
      .get('/ping')
      .expect(200)
  ));
});
