const { Types: { ObjectId } } = require('mongoose');
const {
  hasEqualIds,
  expectThrows,
  expectEqualIds,
} = require('../../testHelpers');
const Errors = require('../../modules/errors');
const { init, close } = require('..');
const {
  exists,
  list,
  retrieve,
  create,
  // addPlayer,
  // removePlayer,
  // setPlayerReady,
  // listener,
} = require('./index');

describe('Domain.Room', () => {
  const name = 'test room';

  beforeAll(init);
  afterAll(close);

  describe('.create()', () => {
    it('requires name', async () => {
      await expectThrows(
        () => create(),
        Errors.BadRequest,
      );
    });

    it('handles isPrivate', () => {

    });

    it('throws on bad data', () => {

    });

    it('emits on success', () => {

    });
  });

  describe('.list()', () => {
    const test = async (args, expectations) => {
      const publicRoom = await create({ name, isPrivate: false });
      const privateRoom = await create({ name, isPrivate: true });
      const result = await list(args);

      expect(
        result.some((r) => hasEqualIds(publicRoom, r)),
      ).toEqual(expectations.public);

      expect(
        result.some((r) => hasEqualIds(privateRoom, r)),
      ).toEqual(expectations.private);
    };

    it('return all rooms by default', async () => {
      await test(
        {},
        {
          public: true,
          private: true,
        },
      );
    });

    it('isPrivate = true', async () => {
      await test(
        {
          isPrivate: true,
        },
        {
          public: false,
          private: true,
        },
      );
    });

    it('isPrivate = false', async () => {
      await test(
        {
          isPrivate: false,
        },
        {
          public: true,
          private: false,
        },
      );
    });
  });

  describe('.exists()', () => {
    it('does not throw if the room exists', async () => {
      const room = await create({ name });
      const result = await exists({ id: room._id.toString() });
      expect(result).toBe(true);
    });

    it('throws otherwise', async () => {
      await expectThrows(
        () => exists({ id: ObjectId().toString() }),
        Errors.NotFound,
      );
    });
  });

  describe('.retrieve()', () => {
    it('returns room if it exists', async () => {
      const room = await create({ name });
      const result = await retrieve({ id: room._id.toString() });
      expectEqualIds(result, room);
    });

    it('throws otherwise', async () => {
      await expectThrows(
        () => exists({ id: ObjectId().toString() }),
        Errors.NotFound,
      );
    });
  });

  describe('.addPlayer()', () => {
    it('throws if player or room do not exist', () => {

    });

    it('throws if room is full', () => {

    });

    it('handles player not in the room', () => {

    });

    it('handles player already in the room', () => {

    });

    it('acquires and waits on lock', () => {

    });
  });

  describe('.removePlayer()', () => {
    it('throws if player or room do not exist', () => {

    });

    it('removes player from room', () => {

    });

    it('removes redundant copy of player from room', () => {

    });

    it('starts game if valid', () => {

    });

    it('deletes game if empty', () => {

    });
  });

  describe('.setPlayerReady()', () => {
    it('throws if player or room do not exist', () => {

    });

    it('can set player to ready', () => {

    });

    it('can set player to unready', () => {

    });

    it('marks redudant copies of player ready', () => {

    });

    it('starts game if valid', () => {

    });
  });
});
