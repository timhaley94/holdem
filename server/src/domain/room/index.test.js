const { Types: { ObjectId } } = require('mongoose');
const {
  hasEqualIds,
  expectThrows,
  expectEqualIds,
} = require('../../testHelpers');
const config = require('../../config');
const { Errors } = require('../../modules');
const { init, close } = require('..');
const User = require('../user');
const Room = require('./index');

describe('Domain.Room', () => {
  const name = 'test room';
  const secret = 'testsecrettestsecret';

  beforeAll(init);
  afterAll(close);

  describe('.create()', () => {
    it('requires name', async () => {
      await expectThrows(
        () => Room.create(),
        Errors.BadRequest,
      );
    });

    it('handles isPrivate', async () => {
      const room = await Room.create({ name, isPrivate: true });
      expect(room.isPrivate).toBe(true);
    });

    it('throws on bad data', async () => {
      expect.assertions(1);

      try {
        await Room.create({
          name: ['foo', 'bar'],
          isPrivate: 12,
        });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBe(true);
      }
    });

    it('emits on success', async () => {
      const fn = jest.fn();
      Room.listener.listen(fn);
      const room = await Room.create({ name });
      expect(fn).toBeCalledWith(room._id.toString());
    });
  });

  describe('.list()', () => {
    const test = async (args, expectations) => {
      const publicRoom = await Room.create({ name, isPrivate: false });
      const privateRoom = await Room.create({ name, isPrivate: true });
      const result = await Room.list(args);

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
      const room = await Room.create({ name });
      const result = await Room.exists({ id: room._id.toString() });
      expect(result).toBe(true);
    });

    it('throws otherwise', async () => {
      await expectThrows(
        () => Room.exists({ id: ObjectId().toString() }),
        Errors.NotFound,
      );
    });
  });

  describe('.retrieve()', () => {
    it('returns room if it exists', async () => {
      const room = await Room.create({ name });
      const result = await Room.retrieve({ id: room._id.toString() });
      expectEqualIds(result, room);
    });

    it('throws otherwise', async () => {
      await expectThrows(
        () => Room.exists({ id: ObjectId().toString() }),
        Errors.NotFound,
      );
    });

    it('handles projection', async () => {
      const room = await Room.create({ name });
      const result = await Room.retrieve(
        { id: room._id.toString() },
        { _id: 1, isPrivate: 1 },
      );

      expect(
        Object.keys(result.toObject()),
      ).toEqual(['_id', 'isPrivate']);
    });
  });

  async function expectRequiresValidArgs(method, data = {}) {
    const room = await Room.create({ name });
    const user = await User.create({ secret });

    await expectThrows(
      () => Room[method]({
        id: room._id.toString(),
        userId: ObjectId().toString(),
        ...data,
      }),
      Errors.NotFound,
    );

    await expectThrows(
      () => Room[method]({
        id: ObjectId().toString(),
        userId: user._id.toString(),
        ...data,
      }),
      Errors.NotFound,
    );
  }

  async function expectPlayerInRoom({ id, userId }) {
    const room = await Room.retrieve({ id: id.toString() });
    expect(
      room.players.find((player) => player.userId.toString() === userId.toString()),
    ).toBeTruthy();
  }

  describe('.addPlayer()', () => {
    it('throws if room or user does not exist', async () => {
      await expectRequiresValidArgs('addPlayer');
    });

    it('can add player', async () => {
      const { _id: id } = await Room.create({ name });

      const user = await User.create({ secret });
      await Room.addPlayer({
        id: id.toString(),
        userId: user._id.toString(),
      });

      await expectPlayerInRoom({ id, userId: user._id });
    });

    it('throws if room is full', async () => {
      const room = await Room.create({ name });

      const addPlayer = async (n = 1) => {
        const user = await User.create({ secret });
        await Room.addPlayer({
          id: room._id.toString(),
          userId: user._id.toString(),
        });

        if (n > 1) {
          await addPlayer(n - 1);
        }
      };

      await addPlayer(config.game.maxPlayers);
      await expectThrows(addPlayer, Errors.Conflict);
    });

    it('does not emit if player already in the room', async () => {
      const { _id: id } = await Room.create({ name });

      const user = await User.create({ secret });

      await Room.addPlayer({
        id: id.toString(),
        userId: user._id.toString(),
      });

      const fn = jest.fn();
      Room.listener.listen(fn);

      await Room.addPlayer({
        id: id.toString(),
        userId: user._id.toString(),
      });

      await expectPlayerInRoom({ id, userId: user._id });
      expect(fn).not.toBeCalled();
    });
  });

  describe('.removePlayer()', () => {
    it('throws if room or user does not exist', async () => {
      await expectRequiresValidArgs('removePlayer');
    });

    async function expectPlayerNotInRoom({ id, userId }) {
      const room = await Room.retrieve({ id: id.toString() });
      expect(
        room.players.every(
          (player) => player.userId.toString() !== userId.toString(),
        ),
      ).toBeTruthy();
    }

    it('removes player from room', async () => {
      const mac = await User.create({ secret });
      const charlie = await User.create({ secret });
      const { _id: id } = await Room.create({ name });

      await Room.addPlayer({
        id: id.toString(),
        userId: mac._id.toString(),
      });

      await Room.addPlayer({
        id: id.toString(),
        userId: charlie._id.toString(),
      });

      await Room.removePlayer({
        id: id.toString(),
        userId: mac._id.toString(),
      });

      await expectPlayerNotInRoom({ id, userId: mac._id });
    });

    it('removes redundant copy of player from room', async () => {
      const mac = await User.create({ secret });
      const charlie = await User.create({ secret });
      const { _id: id } = await Room.create({ name });

      await Room.addPlayer({
        id: id.toString(),
        userId: mac._id.toString(),
      });

      await Room.addPlayer({
        id: id.toString(),
        userId: charlie._id.toString(),
      });

      await Room.removePlayer({
        id: id.toString(),
        userId: mac._id.toString(),
      });

      const room = await Room.retrieve({ id: id.toString() });
      room.players.push({
        userId: mac._id,
        isReady: false,
      });

      await room.save();

      await Room.removePlayer({
        id: id.toString(),
        userId: mac._id.toString(),
      });

      await expectPlayerNotInRoom({ id, userId: mac._id });
    });

    it('starts game if valid', async () => {
      const charlie = await User.create({ secret });
      const mac = await User.create({ secret });
      const dennis = await User.create({ secret });

      const { _id: id } = await Room.create({ name });

      await Room.addPlayer({
        id: id.toString(),
        userId: charlie._id.toString(),
      });

      await Room.addPlayer({
        id: id.toString(),
        userId: mac._id.toString(),
      });

      await Room.addPlayer({
        id: id.toString(),
        userId: dennis._id.toString(),
      });

      await Room.setPlayerReady({
        id: id.toString(),
        userId: charlie._id.toString(),
        isReady: true,
      });

      await Room.setPlayerReady({
        id: id.toString(),
        userId: mac._id.toString(),
        isReady: true,
      });

      await Room.removePlayer({
        id: id.toString(),
        userId: dennis._id.toString(),
      });

      const room = await Room.retrieve({
        id: id.toString(),
      });

      expect(room.isStarted).toBe(true);
    });

    it('deletes game if empty', async () => {
      const user = await User.create({ secret });
      const { _id: id } = await Room.create({ name });

      await Room.addPlayer({
        id: id.toString(),
        userId: user._id.toString(),
      });

      await Room.removePlayer({
        id: id.toString(),
        userId: user._id.toString(),
      });

      await expectThrows(
        () => Room.exists({ id: id.toString() }),
        Errors.NotFound,
      );
    });
  });

  describe('.setPlayerReady()', () => {
    it('throws if room or user does not exist', async () => {
      await expectRequiresValidArgs(
        'setPlayerReady',
        { isReady: true },
      );
    });

    it('can set player to ready', () => {

    });

    it('can set player to unready', () => {

    });

    it('marks redundant copies of player ready', () => {

    });

    it('starts game if valid', () => {

    });
  });
});
