const { Types } = require('mongoose');
const User = require('./index');
const { Auth, Errors, DB } = require('../../modules');

describe('Domain.Users', () => {
  beforeAll(DB.init);
  afterAll(DB.close);

  const data = {
    secret: 'foobarbazbuq1000',
    name: 'Jim Halpert',
    avatarId: '1',
  };

  describe('.retrieve()', () => {
    it('throws on no result', async () => {
      expect.assertions(1);

      try {
        await User.retrieve({
          id: Types.ObjectId().toHexString(),
        });
      } catch (e) {
        expect(e instanceof Errors.NotFound).toBeTruthy();
      }
    });
  });

  describe('.create()', () => {
    it('requires secret', async () => {
      expect.assertions(1);

      try {
        await User.create({});
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('can create with required fields', async () => {
      const user = await User.create({
        secret: data.secret,
      });

      expect(user.id).toBeTruthy();
      expect(typeof user.id).toEqual('string');
      expect(user.secret).toEqual(data.secret);
    });

    it('can create with optional fields', async () => {
      const user = await User.create(data);

      expect(user.id).toBeTruthy();
      expect(typeof user.id).toEqual('string');
      expect(user.name).toEqual(data.name);
      expect(user.avatarId).toEqual(data.avatarId);
    });

    it('throws on bad data', async () => {
      expect.assertions(1);

      try {
        await User.create({
          secret: ['foo', 'bar'],
          name: 459,
          avatarId: false,
        });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('persists to database', async () => {
      const { id } = await User.create(data);
      const user = await User.retrieve({ id });

      expect(user.id).toEqual(id);

      Object.entries(data).forEach(
        ([key, value]) => {
          expect(value).toEqual(user[key]);
        },
      );
    });
  });

  describe('.auth', () => {
    it('throws if secret is wrong', async () => {
      expect.assertions(1);

      const user = await User.create(data);

      try {
        await User.auth({
          id: user.id,
          secret: 'wrongsecret123',
        });
      } catch (e) {
        expect(e instanceof Errors.Unauthorized).toBeTruthy();
      }
    });

    it('returns token if secret is correct', async () => {
      expect.assertions(1);

      const user = await User.create(data);
      const token = await User.auth({
        id: user.id,
        secret: data.secret,
      });

      const { id } = Auth.verify(token);
      expect(id).toEqual(user.id);
    });
  });

  describe('.update()', () => {
    const updateData = {
      name: 'Pam Beasley',
      avatarId: '2',
    };

    it('throws on bad data', async () => {
      expect.assertions(1);

      const user = await User.create(data);

      try {
        await User.update({
          id: user.id,
          name: [1, 2, 3],
          avatarId: false,
        });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('hanldes and persist valid data', async () => {
      let user = await User.create(data);

      await User.update({
        id: user.id,
        ...updateData,
      });

      user = await User.retrieve({ id: user.id });

      Object.entries(updateData).forEach(
        ([key, value]) => {
          expect(value).toEqual(user[key]);
        },
      );
    });

    it('fires listener on update', async () => {
      const { id } = await User.create(data);

      const cb = jest.fn();
      User.listener.subscribe(id, cb);

      await User.update({
        id,
        ...updateData,
      });

      expect(cb).toBeCalled();
    });
  });
});
