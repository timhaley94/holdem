const Auth = require('../auth');
const Errors = require('../errors');
const Users = require('./index');

describe('Models.Users', () => {
  const password = 'testpassword1234';

  const r = (id) => Users.retrieve({ id });

  const c = (metadata) => {
    const data = { secret: password };

    if (metadata) {
      data.metadata = metadata;
    }

    return Users.create(data);
  };

  const a = (id, secret) => Users.auth({
    id,
    secret: secret || password,
  });

  const u = (id, metadata) => Users.update({ id, metadata });

  describe('.retrieve()', () => {
    it('returns user', async () => {
      const { id } = await c();
      const user = await r(id);

      expect(typeof user.id).toBe('string');
      expect(user.metadata).toBe(null);
    });

    it('throws for nonexistent user', () => (
      expect(async () => {
        await r('bad-id');
      }).rejects.toThrow(Errors.NotFound)
    ));
  });

  describe('.create()', () => {
    it('returns user', async () => {
      const user = await c();

      expect(typeof user.id).toBe('string');
      expect(user.metadata).toBe(null);
    });

    it('persists user', async () => {
      const user = await c();
      expect(await r(user.id)).toEqual(user);
    });

    it('generates unique ids', async () => {
      const user1 = await c();
      const user2 = await c();

      expect(user1).not.toBe(user2);
    });

    it('handles metadata', async () => {
      const metadata = { foo: 'bar' };
      const user = await c(metadata);
      expect(user.metadata).toEqual(metadata);
    });

    it('handles no metadata', async () => {
      const user = await c();
      expect(user.metadata).toBe(null);
    });
  });

  describe('.auth()', () => {
    it('handles mismatched secrets', async () => {
      const { id } = await c();

      return expect(async () => {
        await a(id, 'wrongsecret');
      }).rejects.toThrow(Errors.Unauthorized);
    });

    it('returns token', async () => {
      const { id } = await c();
      const { token } = await a(id);

      expect(() => {
        Auth.verify({ token });
      }).not.toThrow();
    });
  });

  describe('.update()', () => {
    const metadata = { foo: 'bar' };

    it('returns user', async () => {
      const { id } = await c();
      const user = await u(id, metadata);

      expect(user.id).toBe(id);
      expect(user.metadata).toEqual(metadata);
    });

    it('throws for nonexistent user', () => (
      expect(async () => {
        await u('bad-id', metadata);
      }).rejects.toThrow(Errors.NotFound)
    ));

    it('persists changes', async () => {
      const { id } = await c();
      await u(id, metadata);
      const user = await r(id);

      expect(user.metadata).toEqual(metadata);
    });

    it('emits an update', async () => {
      const cb = jest.fn();
      const { id } = await c();

      Users.listener.subscribe(id, cb);

      await u(id, metadata);
      expect(cb).toBeCalledTimes(1);
    });
  });
});
