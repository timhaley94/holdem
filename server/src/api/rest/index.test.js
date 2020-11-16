
const Domain = require('../../domain');
const { testApp } = require('./testHelpers');
const app = require('./index');

describe('API.Rest', () => {
  beforeAll(Domain.init);
  afterAll(Domain.close);

  const request = testApp(app);

  it('404s on nonsense route', async () => {
    await request
      .get('/foo/bar/baz')
      .send({ avatarId: '1' })
      .expect(404);
  });

  describe('error middleware', () => {
    const secret = 'pwd123456789';

    const create = async () => {
      const { _id } = await Domain.User.create({ secret });
      const id = _id.toString();
      const { token } = await Domain.User.auth({ id, secret });
      return { id, token };
    };

    const init = async () => ({
      bob: await create(),
      alice: await create(),
    });

    it('correctly sends error status', async () => {
      const { bob, alice } = await init();
      await request
        .patch(`/users/${bob.id}`)
        .set('Authorization', `Bearer ${alice.token}`)
        .send({ avatarId: '1' })
        .expect(401);
    });
  });
});
