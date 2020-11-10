const { Types } = require('mongoose');
const User = require('./index');
const { Auth, Errors } = require('../../modules');
const { init, close } = require('../../loaders');

describe('Domain.Users', () => {
  beforeAll(init);
  afterAll(close);

  const data = {
    secret: 'foobarbazbuq1000',
    name: 'Jim Halpert',
    avatarId: '1',
  };

  describe('.exists()', () => {
    it('does not throw if user exists', async () => {
      const { _id } = await User.create({
        secret: data.secret,
      });

      await User.exists({ id: _id.toString() });
    });

    it('throws if user does not exist', async () => {
      expect.assertions(1);

      try {
        await User.exists({
          id: Types.ObjectId().toHexString(),
        });
      } catch (e) {
        expect(e instanceof Errors.NotFound).toBeTruthy();
      }
    });
  });

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

      const id = user._id.toString();

      expect(id).toBeTruthy();
      expect(typeof id).toEqual('string');
      expect(user.secret).toEqual(data.secret);
    });

    it('can create with optional fields', async () => {
      const user = await User.create(data);

      const id = user._id.toString();

      expect(id).toBeTruthy();
      expect(typeof id).toEqual('string');
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
      const { _id } = await User.create(data);
      const id = _id.toString();

      const user = await User.retrieve({ id });

      expect(id).toEqual(id);

      Object.entries(data).forEach(
        ([key, value]) => {
          expect(value).toEqual(user[key]);
        },
      );
    });

    it('throws on db error', async () => {
      const spy = jest.spyOn(User.model, 'create');

      spy.mockImplementation(() => {
        throw new Error();
      });

      expect.assertions(1);

      try {
        await User.create(data);
      } catch (e) {
        expect(e instanceof Errors.Fatal).toBeTruthy();
      }

      spy.mockRestore();
    });
  });

  describe('.auth()', () => {
    it('throws if secret is wrong', async () => {
      expect.assertions(1);

      const user = await User.create(data);

      try {
        await User.auth({
          id: user._id.toString(),
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
        id: user._id.toString(),
        secret: data.secret,
      });

      const { id } = Auth.verify(token);
      expect(id).toEqual(user._id.toString());
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
          id: user._id.toString(),
          name: [1, 2, 3],
          avatarId: false,
        });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('hanldes and persist valid data', async () => {
      let user = await User.create(data);
      const id = user._id.toString();

      await User.update({
        id,
        ...updateData,
      });

      user = await User.retrieve({ id });

      Object.entries(updateData).forEach(
        ([key, value]) => {
          expect(value).toEqual(user[key]);
        },
      );
    });

    it('fires listener on update', async () => {
      const user = await User.create(data);
      const id = user._id.toString();

      const cb = jest.fn();
      User.listener.subscribe(id, cb);

      await User.update({
        id,
        ...updateData,
      });

      expect(cb).toBeCalled();
    });

    it('throws on db error', async () => {
      const spy = jest.spyOn(User.model, 'updateOne');

      spy.mockImplementation(() => {
        throw new Error();
      });

      expect.assertions(1);

      const user = await User.create(data);
      const id = user._id.toString();

      try {
        await User.update({
          id,
          ...updateData,
        });
      } catch (e) {
        expect(e instanceof Errors.Fatal).toBeTruthy();
      }

      spy.mockRestore();
    });
  });
});
