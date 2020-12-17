
const Domain = require('../../../domain');
const { testRouter } = require('../testHelpers');
const { router } = require('./index');

describe('API.Rest.Users', () => {
  beforeAll(Domain.init);
  afterAll(Domain.close);

  const request = testRouter(router);
  const secret = 'pwd123456789';
  const avatarId = '1';

  const create = async () => {
    const { _id } = await Domain.User.create({ secret });
    const id = _id.toString();
    const { token } = await Domain.User.auth({ id, secret });
    return { id, token };
  };

  describe('POST /', () => {
    it('can create a user', async () => {
      const { body: { id } } = await (
        request
          .post('/')
          .send({ secret })
          .expect(200)
      );

      await Domain.User.exists({
        id: id.toString(),
      });
    });
  });

  describe('POST /auth', () => {
    it('returns a token', async () => {
      const { id } = await create();

      const { body: { token } } = await (
        request
          .post('/auth')
          .send({ id, secret })
          .expect(200)
      );

      expect(token).toBeTruthy();
    });
  });

  describe('PATCH /:id', () => {
    const init = async () => ({
      bob: await create(),
      alice: await create(),
    });

    it('401 if you try to update a different user', async () => {
      const { bob, alice } = await init();
      await request
        .patch(`/${bob.id}`)
        .set('Authorization', `Bearer ${alice.token}`)
        .send({ avatarId })
        .expect(401);
    });

    it('401 if you do not have a token', async () => {
      const { bob } = await init();
      await request
        .patch(`/${bob.id}`)
        .send({ avatarId })
        .expect(401);
    });

    it('allows update', async () => {
      const { bob } = await init();
      await request
        .patch(`/${bob.id}`)
        .set('Authorization', `Bearer ${bob.token}`)
        .send({ avatarId })
        .expect(200);

      const updated = await Domain.User.retrieve({ id: bob.id });
      expect(updated.avatarId).toEqual(avatarId);
    });
  });
});
