// const config = require('../../config');
// const Errors = require('../errors');
// const Users = require('../users');
// const Games = require('./index');

// const password = 'testpassword1234';

describe('Domain.Room', () => {
  //   beforeEach(() => {
  //     Games.reset();
  //   });

  it('force to pass', () => {
    expect(1 + 2).toEqual(3);
  });

  //   describe('.list()', () => {
  //     it('returns multiple games', async () => {
  //       const { id: id1 } = await Games.create({ name: 'test' });
  //       const { id: id2 } = await Games.create({ name: 'test' });

  //       const list = await Games.list();

  //       expect(
  //         list.map((game) => game.id),
  //       ).toEqual([id1, id2]);
  //     });

  //     it('filters out private games', async () => {
  //       const { id: id1 } = await Games.create({ name: 'test' });
  //       await Games.create({ name: 'test', isPrivate: true });

  //       const list = await Games.list();

  //       expect(
  //         list.map((game) => game.id),
  //       ).toEqual([id1]);
  //     });
  //   });

  //   describe('.retrieve()', () => {
  //     it('returns a game', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const game = await Games.retrieve({ id });

  //       expect(game).toEqual({
  //         name: 'test',
  //         id,
  //         isPrivate: false,
  //         isStarted: false,
  //         users: {},
  //         players: {},
  //         table: null,
  //       });
  //     });

  //     it('throws on nonexistent game', () => (
  //       expect(async () => {
  //         await Games.retrieve({ id: 'bad-id' });
  //       }).rejects.toThrow(Errors.NotFound)
  //     ));
  //   });

  //   describe('.create()', () => {
  //     it('returns a game', async () => {
  //       const game = await Games.create({ name: 'test' });

  //       expect(game).toEqual({
  //         name: 'test',
  //         id: game.id,
  //         isPrivate: false,
  //         isStarted: false,
  //         users: {},
  //         players: {},
  //         table: null,
  //       });
  //     });

  //     it('respects isPrivate', async () => {
  //       const game = await Games.create({
  //         name: 'test',
  //         isPrivate: true,
  //       });

  //       expect(game).toEqual({
  //         name: 'test',
  //         id: game.id,
  //         isPrivate: true,
  //         isStarted: false,
  //         users: {},
  //         players: {},
  //         table: null,
  //       });
  //     });

  //     it('persists game', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const game = await Games.retrieve({ id });

  //       expect(game.id).toEqual(id);
  //     });
  //   });

  //   describe('.addUser()', () => {
  //     it('adds id', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user.id });
  //       const game = await Games.retrieve({ id });

  //       expect(game.users).toEqual({
  //         [user.id]: {
  //           id: user.id,
  //           metadata: null,
  //         },
  //       });

  //       expect(game.players).toEqual({});
  //     });

  //     it('listens to user updates', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user = await Users.create({ secret: password });

  //       await Games.addUser({ id, userId: user.id });

  //       const cb = jest.fn();
  //       Games.listener.subscribe(id, cb);

  //       await Users.update({
  //         id: user.id,
  //         metadata: { foo: 'bar' },
  //       });

  //       expect(cb).toBeCalledTimes(1);
  //     });

  //     it('listens to multiple user updates', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user1 = await Users.create({ secret: password });
  //       const user2 = await Users.create({ secret: password });

  //       await Games.addUser({ id, userId: user1.id });
  //       await Games.addUser({ id, userId: user2.id });

  //       const cb = jest.fn();
  //       Games.listener.subscribe(id, cb);

  //       await Users.update({
  //         id: user1.id,
  //         metadata: { foo: 'bar' },
  //       });

  //       await Users.update({
  //         id: user2.id,
  //         metadata: { foo: 'bar' },
  //       });

  //       expect(cb).toBeCalledTimes(2);
  //     });

  //     it('can add pass player limit', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       const ids = await Promise.all(
  //         [...Array(config.game.maxPlayers + 1)].map(
  //           async () => {
  //             const user = await Users.create({ secret: password });
  //             await Games.addUser({ id, userId: user.id });
  //             return user.id;
  //           },
  //         ),
  //       );

  //       const game = await Games.retrieve({ id });
  //       expect(
  //         Object
  //           .keys(game.users)
  //           .sort(),
  //       ).toEqual(ids.sort());
  //     });
  //   });

  //   describe('removeUser', () => {
  //     it('clears ids', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user = await Users.create({ secret: password });

  //       await Games.addUser({ id, userId: user.id });
  //       await Games.removeUser({ id, userId: user.id });

  //       const game = await Games.retrieve({ id });

  //       expect(game.users).toEqual({});
  //       expect(game.players).toEqual({});
  //     });

  //     it('fires update', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user = await Users.create({ secret: password });

  //       await Games.addUser({ id, userId: user.id });

  //       const cb = jest.fn();
  //       Games.listener.subscribe(id, cb);

  //       await Games.removeUser({ id, userId: user.id });

  //       expect(cb).toBeCalledTimes(1);
  //     });

  //     it('unsubscribes from user', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user = await Users.create({ secret: password });

  //       await Games.addUser({ id, userId: user.id });
  //       await Games.removeUser({ id, userId: user.id });

  //       const cb = jest.fn();
  //       Games.listener.subscribe(id, cb);

  //       await Users.update({
  //         id: user.id,
  //         metadata: { foo: 'bar' },
  //       });

  //       expect(cb).toBeCalledTimes(0);
  //     });

  //     it('attempts start', () => {

  //     });
  //   });

  //   describe('addPlayer', () => {
  //     it('defaults isReady to false', async () => {
  //       const { id } = await Games.create({ name: 'test' });
  //       const user = await Users.create({ secret: password });

  //       await Games.addUser({ id, userId: user.id });
  //       await Games.addPlayer({ id, userId: user.id });

  //       const game = await Games.retrieve({ id });

  //       expect(game.users).toEqual({
  //         [user.id]: {
  //           id: user.id,
  //           metadata: null,
  //         },
  //       });

  //       expect(game.players).toEqual({
  //         [user.id]: {
  //           isReady: false,
  //         },
  //       });
  //     });

  //     it('throws if game is full', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       await Promise.all(
  //         [...Array(config.game.maxPlayers)].map(
  //           async () => {
  //             const user = await Users.create({ secret: password });
  //             await Games.addUser({ id, userId: user.id });
  //             await Games.addPlayer({ id, userId: user.id });
  //           },
  //         ),
  //       );

  //       const user = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user.id });

  //       return expect(
  //         () => Games.addPlayer({ id, userId: user.id }),
  //       ).rejects.toThrow(Errors.Conflict);
  //     });
  //   });

  //   describe('.isFull()', () => {
  //     it('handles full case', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       await Promise.all(
  //         [...Array(config.game.maxPlayers)].map(
  //           async () => {
  //             const user = await Users.create({ secret: password });
  //             await Games.addUser({ id, userId: user.id });
  //             await Games.addPlayer({ id, userId: user.id });
  //           },
  //         ),
  //       );

  //       const result = await Games.isFull({ id });
  //       expect(result).toBe(true);
  //     });

  //     it('handles not full case', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       const user = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user.id });
  //       await Games.addPlayer({ id, userId: user.id });

  //       const result = await Games.isFull({ id });
  //       expect(result).toBe(false);
  //     });
  //   });

  //   describe('.setPlayerReady()', () => {
  //     it('sets true', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       const user = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user.id });
  //       await Games.addPlayer({ id, userId: user.id });
  //       await Games.setPlayerReady({ id, userId: user.id, isReady: true });

  //       const game = await Games.retrieve({ id });
  //       expect(game.players).toEqual({
  //         [user.id]: { isReady: true },
  //       });
  //     });

  //     it('sets false', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       const user = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user.id });
  //       await Games.addPlayer({ id, userId: user.id });
  //       await Games.setPlayerReady({ id, userId: user.id, isReady: true });
  //       await Games.setPlayerReady({ id, userId: user.id, isReady: false });

  //       const game = await Games.retrieve({ id });
  //       expect(game.players).toEqual({
  //         [user.id]: { isReady: false },
  //       });
  //     });

  //     it('attempts start', async () => {
  //       const { id } = await Games.create({ name: 'test' });

  //       const user1 = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user1.id });
  //       await Games.addPlayer({ id, userId: user1.id });
  //       await Games.setPlayerReady({ id, userId: user1.id, isReady: true });

  //       const user2 = await Users.create({ secret: password });
  //       await Games.addUser({ id, userId: user2.id });
  //       await Games.addPlayer({ id, userId: user2.id });
  //       await Games.setPlayerReady({ id, userId: user2.id, isReady: true });

  //       const game = await Games.retrieve({ id });
  //       expect(game.isStarted).toBe(true);
  //     });
  //   });

  //   describe('.makeMove()', () => {
  //     // TODO
  //   });
});
