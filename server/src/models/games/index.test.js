const config = require('../../config');
const Errors = require('../errors');
const Users = require('../users');
const Games = require('./index');

const password = 'testpassword1234';

describe('Models.Games', () => {
  beforeEach(() => {
    Games.reset();
  });

  describe('.list()', () => {
    it('returns multiple games', async () => {
      const { id: id1 } = await Games.create({ name: 'test' });
      const { id: id2 } = await Games.create({ name: 'test' });

      const list = await Games.list();

      expect(
        list.map((game) => game.id),
      ).toEqual([id1, id2]);
    });

    it('filters out private games', async () => {
      const { id: id1 } = await Games.create({ name: 'test' });
      await Games.create({ name: 'test', isPrivate: true });

      const list = await Games.list();

      expect(
        list.map((game) => game.id),
      ).toEqual([id1]);
    });
  });

  describe('.retrieve()', () => {
    it('returns a game', async () => {
      const { id } = await Games.create({ name: 'test' });
      const game = await Games.retrieve({ id });

      expect(game).toEqual({
        name: 'test',
        id,
        isPrivate: false,
        isStarted: false,
        users: {},
        players: {},
        table: null,
      });
    });

    it('throws on nonexistent game', () => (
      expect(async () => {
        await Games.retrieve({ id: 'bad-id' });
      }).rejects.toThrow(Errors.NotFound)
    ));
  });

  describe('.create()', () => {
    it('returns a game', async () => {
      const game = await Games.create({ name: 'test' });

      expect(game).toEqual({
        name: 'test',
        id: game.id,
        isPrivate: false,
        isStarted: false,
        users: {},
        players: {},
        table: null,
      });
    });

    it('respects isPrivate', async () => {
      const game = await Games.create({
        name: 'test',
        isPrivate: true,
      });

      expect(game).toEqual({
        name: 'test',
        id: game.id,
        isPrivate: true,
        isStarted: false,
        users: {},
        players: {},
        table: null,
      });
    });

    it('persists game', async () => {
      const { id } = await Games.create({ name: 'test' });
      const game = await Games.retrieve({ id });

      expect(game.id).toEqual(id);
    });
  });

  describe('.addUser()', () => {
    it('adds id', async () => {
      const { id } = await Games.create({ name: 'test' });
      const user = await Users.create({ secret: password });
      await Games.addUser({ id, userId: user.id });
      const game = await Games.retrieve({ id });

      expect(game.users).toEqual({
        [user.id]: {
          id: user.id,
          metadata: null,
        },
      });

      expect(game.players).toEqual({});
    });

    it('listens to user updates', async () => {
      const { id } = await Games.create({ name: 'test' });
      const user = await Users.create({ secret: password });

      await Games.addUser({ id, userId: user.id });

      const cb = jest.fn();
      Games.listener.subscribe(id, cb);

      await Users.update({
        id: user.id,
        metadata: { foo: 'bar' },
      });

      expect(cb).toBeCalledTimes(1);
    });

    it('listens to multiple user updates', async () => {
      const { id } = await Games.create({ name: 'test' });
      const user1 = await Users.create({ secret: password });
      const user2 = await Users.create({ secret: password });

      await Games.addUser({ id, userId: user1.id });
      await Games.addUser({ id, userId: user2.id });

      const cb = jest.fn();
      Games.listener.subscribe(id, cb);

      await Users.update({
        id: user1.id,
        metadata: { foo: 'bar' },
      });

      await Users.update({
        id: user2.id,
        metadata: { foo: 'bar' },
      });

      expect(cb).toBeCalledTimes(2);
    });

    it('can add pass player limit', async () => {
      const { id } = await Games.create({ name: 'test' });

      const ids = await Promise.all(
        [...Array(config.game.maxPlayers + 1)].map(
          async () => {
            const user = await Users.create({ secret: password });
            await Games.addUser({ id, userId: user.id });
            return user.id;
          },
        ),
      );

      const game = await Games.retrieve({ id });
      expect(
        Object
          .keys(game.users)
          .sort(),
      ).toEqual(ids.sort());
    });
  });

  describe('removeUser', () => {
    it('clears ids', async () => {
      const { id } = await Games.create({ name: 'test' });
      const user = await Users.create({ secret: password });

      await Games.addUser({ id, userId: user.id });
      await Games.removeUser({ id, userId: user.id });

      const game = await Games.retrieve({ id });

      expect(game.users).toEqual({});
      expect(game.players).toEqual({});
    });

    it('fires update', async () => {
      const { id } = await Games.create({ name: 'test' });
      const user = await Users.create({ secret: password });

      await Games.addUser({ id, userId: user.id });

      const cb = jest.fn();
      Games.listener.subscribe(id, cb);

      await Games.removeUser({ id, userId: user.id });

      expect(cb).toBeCalledTimes(1);
    });

    it('unsubscribes from user', async () => {
      const { id } = await Games.create({ name: 'test' });
      const user = await Users.create({ secret: password });

      await Games.addUser({ id, userId: user.id });
      await Games.removeUser({ id, userId: user.id });

      const cb = jest.fn();
      Games.listener.subscribe(id, cb);

      await Users.update({
        id: user.id,
        metadata: { foo: 'bar' },
      });

      expect(cb).toBeCalledTimes(0);
    });

    it('attempts start', () => {

    });
  });

  describe('addPlayer', () => {
    it('listens to user updates', () => {

    });

    it('throws if game is full', () => {

    });

    it('defaults isReady to false', () => {

    });
  });

  describe('.isFull()', () => {
    it('handles full case', () => {

    });

    it('handles not full case', () => {

    });
  });

  describe('.setPlayerReady()', () => {
    it('sets true', () => {

    });

    it('sets false', () => {

    });

    it('attempts start', () => {

    });
  });

  describe('.makeMove()', () => {

  });
});
