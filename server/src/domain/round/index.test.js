const { init, close } = require('../../loaders');
// const Stage = require('../stage');
// const Round = require('./index');

describe('Domain.round', () => {
  beforeAll(init);
  afterAll(close);

  // const players = [
  //   {
  //     userId: 1,
  //     bankroll: 200,
  //   },
  //   {
  //     userId: 2,
  //     bankroll: 300,
  //   },
  // ];

  describe('.create()', () => {
    // it('starts at ante stage', () => {
    //   const round = Round.create({ players });
    //   expect(round.stage).toEqual(Stage.first());
    // });

    // it('respects players bankroll', () => {
    //   const round = Round.create({ players });
    //   round.players.forEach(
    //     (player) => {
    //       const match = players.find(
    //         (p) => p.userId === player.userId
    //       );

    //       expect(player.userId).toEqual(match.userId);
    //       expect(player.purse.bankroll).toEqual(match.bankroll);
    //     },
    //   );
    // });

    // it('maintains player order without lastRound', () => {
    //   const round = Round.create({ players });
    //   round.players.forEach(
    //     (player, i) => {
    //       expect(player.userId).toEqual(players[i].userId);
    //     },
    //   );
    // });

    // it('automatically bets blinds', () => {

    // });

    // it('sets current player to small blind', () => {
    //   const round = Round.create({ players });
    //   expect(round.currentPlayer).toEqual(
    //     players[0].userId,
    //   );
    // });

    // it('takes player order form last round', () => {
    //   const lastRound = Round.create({ players });
    //   const round = Round.create({ players, lastRound });
    //   expect(round.currentPlayer).toEqual(
    //     players[1].userId,
    //   );
    // });
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
