const { Types } = require('mongoose');
const config = require('../../config');
const { Errors } = require('../../modules');
const { init, close } = require('..');
const Round = require('../round');
const Game = require('./index');

describe('Domain.Game', () => {
  const badId = () => Types.ObjectId().toHexString();
  const userIds = [Types.ObjectId(), Types.ObjectId()];

  beforeAll(init);
  afterAll(close);

  describe('.retrieve()', () => {
    it('throws on missing id', async () => {
      expect.assertions(1);

      try {
        await Game.retrieve();
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('throws if no game with id exists', async () => {
      expect.assertions(1);

      try {
        await Game.retrieve({ id: badId() });
      } catch (e) {
        expect(e instanceof Errors.NotFound).toBeTruthy();
      }
    });

    it('returns game', async () => {
      const { _id } = await Game.create({ userIds });
      const id = _id.toHexString();

      const game = await Game.retrieve({ id });
      expect(game._id.toHexString()).toEqual(id);
    });

    it('can take a projection', async () => {
      const { _id } = await Game.create({ userIds });
      const game = await Game.retrieve(
        { id: _id.toHexString() },
        { players: 1 },
      );

      expect(
        Object.keys(game.toObject()),
      ).toEqual(['_id', 'players']);
    });
  });

  describe('.create()', () => {
    it('throws on missing userIds', async () => {
      expect.assertions(1);

      try {
        await Game.create();
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('add players', async () => {
      const game = await Game.create({ userIds });
      game.players.forEach((player, i) => {
        expect(player.userId).toEqual(userIds[i]);
        expect(player.removed).toEqual(false);
        expect(player.bankroll).toEqual(config.game.defaultBankroll);
      });
    });

    it('initializes round', async () => {
      const game = await Game.create({ userIds });
      expect(game.round).toBeTruthy();
    });

    it('emits on create', async () => {
      const cb = jest.fn();
      Game.listener.listen(cb);

      await Game.create({ userIds });
      expect(cb).toBeCalled();
    });
  });

  describe('.makeMove()', () => {
    it('throws if game does not exist', async () => {
      expect.assertions(1);

      try {
        await Game.makeMove({ id: badId });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('throws on illegal type', async () => {
      const { _id: id } = await Game.create({ userIds });
      expect.assertions(1);

      try {
        await Game.makeMove({
          id: id.toHexString(),
          type: 'CALL',
          userId: userIds[0],
          data: {},
        });
      } catch (e) {
        expect(e instanceof Errors.Fatal).toBeTruthy();
      }
    });

    it('type BET calls Round.bet', async () => {
      const { _id: id } = await Game.create({ userIds });
      const spy = jest.spyOn(Round, 'bet');

      await Game.makeMove({
        id: id.toHexString(),
        type: 'BET',
        userId: userIds[0],
        data: {
          amount: 100,
        },
      });

      expect(spy).toBeCalled();
      spy.mockRestore();
    });

    it('type ALL_IN calls Round.allIn', async () => {
      const { _id: id } = await Game.create({ userIds });
      const spy = jest.spyOn(Round, 'allIn');

      await Game.makeMove({
        id: id.toHexString(),
        type: 'ALL_IN',
        userId: userIds[0],
        data: {},
      });

      expect(spy).toBeCalled();
      spy.mockRestore();
    });

    it('type FOLD calls Round.fold', async () => {
      const { _id: id } = await Game.create({ userIds });
      const spy = jest.spyOn(Round, 'fold');

      await Game.makeMove({
        id: id.toHexString(),
        type: 'FOLD',
        userId: userIds[0],
        data: {},
      });

      expect(spy).toBeCalled();
      spy.mockRestore();
    });

    it('creates new round if necessary', async () => {
      const {
        _id: id,
        round: { _id: roundId },
      } = await Game.create({ userIds });

      await Game.makeMove({
        id: id.toHexString(),
        type: 'FOLD',
        userId: userIds[0],
        data: {},
      });

      const game = await Game.retrieve({
        id: id.toHexString(),
      });

      game.players.forEach((player) => {
        expect(player.bankroll).not.toEqual(
          config.game.defaultBankroll,
        );
      });

      expect(game.round._id).not.toEqual(roundId);
    });

    it('emits on success', async () => {
      const { _id: id } = await Game.create({ userIds });

      const cb = jest.fn();
      Game.listener.listen(cb);

      await Game.makeMove({
        id: id.toHexString(),
        type: 'BET',
        userId: userIds[0],
        data: {
          amount: 100,
        },
      });

      expect(cb).toBeCalledWith(id.toHexString());
    });
  });
});
