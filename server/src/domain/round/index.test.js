const { Types } = require('mongoose');
const config = require('../../config');
const { init, close } = require('../../loaders');
const { Errors } = require('../../modules');
const Stage = require('../stage');
const Round = require('./index');

describe('Domain.round', () => {
  beforeAll(init);
  afterAll(close);

  const players = [
    {
      userId: Types.ObjectId(),
      bankroll: 200,
    },
    {
      userId: Types.ObjectId(),
      bankroll: 300,
    },
    {
      userId: Types.ObjectId(),
      bankroll: 200,
    },
    {
      userId: Types.ObjectId(),
      bankroll: 150,
    },
  ];

  describe('.create()', () => {
    it('starts at pre-flop stage', () => {
      const round = Round.create({ players });
      expect(round.stage).toEqual(Stage.first());
    });

    it('respects players bankroll', () => {
      const round = Round.create({ players });
      round.players.forEach(
        (player) => {
          const match = players.find(
            (p) => p.userId === player.userId,
          );

          expect(player.userId).toEqual(match.userId);
          expect(player.purse.bankroll).toEqual(match.bankroll);
        },
      );
    });

    it('under the gun is the current player', () => {
      const round = Round.create({ players });
      expect(
        round.currentPlayer,
      ).toEqual(players[2].userId);
    });

    // it('small blind is the current player in a two player game', () => {
    //   const round = Round.create({
    //     players: players.slice(0, 2),
    //   });

    //   expect(round.stage).toEqual(Stage.PRE_FLOP);
    //   expect(
    //     round.currentPlayer,
    //   ).toEqual(players[0].userId);
    // });

    it('automatically bets blinds', () => {
      const round = Round.create({ players });

      expect(
        round.players[0].purse.wagered,
      ).toEqual(config.game.smallBlind);

      expect(
        round.players[1].purse.wagered,
      ).toEqual(config.game.bigBlind);
    });

    it('maintains player order without lastRound', () => {
      const round = Round.create({ players });
      round.players.forEach(
        (player, i) => {
          expect(player.userId).toEqual(players[i].userId);
        },
      );
    });

    it('takes player order from last round', () => {
      const lastRound = Round.create({ players });
      const round = Round.create({ players, lastRound });
      const expected = [...players.slice(1), players[0]];
      round.players.forEach(
        (player, i) => {
          expect(player.userId).toEqual(expected[i].userId);
        },
      );
    });

    it('uses last round, even if players dropped out', () => {
      const lastRound = Round.create({ players });

      const round = Round.create({
        players: [
          players[0],
          players[2],
          players[3],
        ],
        lastRound,
      });

      const expected = [
        players[2],
        players[3],
        players[0],
      ];

      round.players.forEach(
        (player, i) => {
          expect(player.userId).toEqual(expected[i].userId);
        },
      );
    });

    it('throws if players and last round are inconsistent', () => {
      const lastRound = Round.create({ players });
      const nextPlayers = [
        {
          userId: Types.ObjectId(),
          bankroll: 200,
        },
        {
          userId: Types.ObjectId(),
          bankroll: 300,
        },
      ];

      expect(() => {
        Round.create({
          players: nextPlayers,
          lastRound,
        });
      }).toThrow(Errors.Fatal);
    });

    it('throws if less than two players are passed', () => {
      const lastRound = Round.create({ players });

      expect(() => {
        Round.create({
          players: [players[0]],
          lastRound,
        });
      }).toThrow(Errors.Fatal);
    });
  });

  describe('betting', () => {
    describe('ante', () => {
      it('small blind can call big blind', () => {

      });

      it('small blind can fold', () => {

      });

      it('small blind can raise', () => {

      });

      it('throws if small blind checks', () => {

      });

      it('under the gun can call big blind', () => {

      });

      it('under the gun can fold', () => {

      });

      it('under the gun can raise', () => {

      });

      it('does not advance until all have called', () => {

      });

      it('big blind gets a chance to raise', () => {

      });
    });

    describe('pre-flop', () => {
      it('big blind is current player', () => {

      });

      it('big blind can check', () => {

      });
    });

    describe('.bet()', () => {
      // const currentPlayer = players[0].userId;
      // const nextPlayer = players[1].userId;

      // it('throws on missing fields', () => {
      //   const round = Round.create({ players });
      //   expect(() => {
      //     Round.bet({ round })
      //   }).toThrow();
      // });

      // it('throws if round is complete', () => {
      //   const round = Round.create({ players });
      //   round.isComplete = true;

      //   expect(() => {
      //     Round.bet({
      //       round,
      //       userId: currentPlayer,
      //       amount: 0,
      //     });
      //   }).toThrow();
      // });

      // it('throws if userId is not current player', () => {
      //   const round = Round.create({ players });

      //   expect(() => {
      //     Round.bet({
      //       round,
      //       userId: nextPlayer,
      //       amount: 0,
      //     });
      //   }).toThrow();
      // });

      // it('throws if bet amount is under current bet', () => {
      //   let round = Round.create({ players });
      //   round = Round.bet({
      //     round,
      //     userId: currentPlayer,
      //     amount: 10,
      //   });

      //   expect(() => {
      //     Round.bet({
      //       round,
      //       userId: nextPlayer,
      //       amount: 5,
      //     });
      //   }).toThrow();
      // });

      // it('allows for check', () => {
      //   let round = Round.create({ players });
      //   round = Round.bet({
      //     round,
      //     userId: currentPlayer,
      //     amount: 0,
      //   });

      //   expect(round.currentPlayer).toEqual(nextPlayer);
      //   expect(round.players[0].purse.wagered).toEqual(0);
      // });

      // it('allows for raise', () => {
      //   let round = Round.create({ players });
      //   round = Round.bet({
      //     round,
      //     userId: currentPlayer,
      //     amount: 10,
      //   });

      //   expect(round.currentPlayer).toEqual(nextPlayer);
      //   expect(round.players[0].purse.wagered).toEqual(10);
      // });

      // it('allows for call of raise', () => {
      //   let round = Round.create({ players });

      //   round = Round.bet({
      //     round,
      //     userId: currentPlayer,
      //     amount: 10,
      //   });

      //   round = Round.bet({
      //     round,
      //     userId: nextPlayer,
      //     amount: 10,
      //   });

      //   expect(round.players[1].purse.wagered).toEqual(10);
      // });

      // it('advances stage', () => {
      //   let round = Round.create({ players });

      //   round = Round.bet({
      //     round,
      //     userId: currentPlayer,
      //     amount: 10,
      //   });

      //   round = Round.bet({
      //     round,
      //     userId: nextPlayer,
      //     amount: 10,
      //   });

      //   expect(round.currentPlayer).toEqual(currentPlayer);
      //   expect(round.stage).toEqual()
      // });

      // it('does not advance stage on last player raise', () => {

      // });

      // it('does not allow a player to raise twice a round', () => {

      // });
    });

    describe('.allIn()', () => {
      it('wagers entire bankroll', () => {

      });

      it('does not mark player as folded', () => {

      });

      it('advances current player', () => {

      });

      it('can be used as partial call', () => {

      });

      it('can advance stage', () => {

      });

      it('can end round', () => {

      });

      it('will never become current player again', () => {

      });

      it('cannot bet or fold after all in', () => {

      });
    });

    describe('.fold()', () => {
      it('marks player as folded', () => {

      });

      it('advances current player', () => {

      });

      it('can advance stage', () => {

      });

      it('will never become current player again', () => {

      });

      it('can end round', () => {

      });

      it('maintains wagered amount', () => {

      });
    });
  });

  describe('.winnings()', () => {

  });

  describe('.isFinished()', () => {
    it('returns true once round ends', () => {

    });

    it('returns false otherwise', () => {

    });
  });
});
