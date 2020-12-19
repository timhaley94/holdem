const { Errors } = require('../../modules');
const Hand = require('../hand');
const Solver = require('./index');

describe('Domain.Solver', () => {
  describe('.run()', () => {
    const communityCards = ['H3', 'S2'];

    const fullHouse = () => Hand.create([
      'H7',
      'D7',
      'S7',
      'H5',
      'D5',
      ...communityCards,
    ]);

    const twoPair = () => Hand.create([
      'H7',
      'D7',
      'H5',
      'D5',
      'H4',
      ...communityCards,
    ]);

    const pair = () => Hand.create([
      'H7',
      'D7',
      'H5',
      'D10',
      'H4',
      ...communityCards,
    ]);

    function expectSolution(hands, wagers, expectation) {
      const solution = Solver.run(hands, wagers);
      Object.entries(expectation).forEach(
        ([user, value]) => {
          expect(solution[user]).toEqual(value);
        },
      );
    }

    describe('basic functionality', () => {
      const wagers = {
        charlie: 100,
        mac: 100,
        dennis: 100,
      };

      it('solves basic problem', () => {
        expectSolution(
          {
            charlie: fullHouse(),
            mac: twoPair(),
            dennis: pair(),
          },
          wagers,
          {
            charlie: 300,
            mac: 0,
            dennis: 0,
          },
        );
      });

      it('throws on invalid hand', () => {
        expect(() => {
          Solver.run(
            [
              fullHouse(),
              { type: 'five-of-a-kind' },
            ],
            wagers,
          );
        }).toThrowError(Errors.Fatal);
      });

      it('handles single hand', () => {
        expectSolution(
          {
            charlie: fullHouse(),
          },
          wagers,
          {
            charlie: 300,
            mac: 0,
            dennis: 0,
          },
        );
      });

      it('handles empty hand', () => {
        expectSolution(
          {
            charlie: Hand.create([]),
          },
          wagers,
          {
            charlie: 300,
            mac: 0,
            dennis: 0,
          },
        );
      });
    });

    describe('true ties', () => {
      const wagers = {
        charlie: 100,
        mac: 100,
        dennis: 100,
      };

      it('handles first place tie', () => {
        expectSolution(
          {
            charlie: fullHouse(),
            mac: fullHouse(),
            dennis: pair(),
          },
          wagers,
          {
            charlie: 150,
            mac: 150,
            dennis: 0,
          },
        );
      });

      it('handles second place tie', () => {
        expectSolution(
          {
            charlie: fullHouse(),
            mac: twoPair(),
            dennis: twoPair(),
          },
          wagers,
          {
            charlie: 300,
            mac: 0,
            dennis: 0,
          },
        );
      });
    });

    describe('kickers', () => {

    });

    describe('side pots', () => {
      it('handles all-in winning', () => {
        expectSolution(
          {
            charlie: fullHouse(),
            mac: twoPair(),
            dennis: pair(),
          },
          {
            charlie: 50,
            mac: 100,
            dennis: 100,
          },
          {
            charlie: 150,
            mac: 100,
            dennis: 0,
          },
        );
      });

      it('handles all-in losing', () => {
        expectSolution(
          {
            charlie: pair(),
            mac: fullHouse(),
            dennis: twoPair(),
          },
          {
            charlie: 50,
            mac: 100,
            dennis: 100,
          },
          {
            charlie: 0,
            mac: 250,
            dennis: 0,
          },
        );
      });

      it('handles all-in losing with split pot', () => {
        expectSolution(
          {
            charlie: pair(),
            mac: twoPair(),
            dennis: twoPair(),
          },
          {
            charlie: 50,
            mac: 100,
            dennis: 100,
          },
          {
            charlie: 0,
            mac: 125,
            dennis: 125,
          },
        );
      });

      it('handles a three way tie', () => {
        expectSolution(
          {
            charlie: fullHouse(),
            mac: fullHouse(),
            dennis: fullHouse(),
            dee: twoPair(),
          },
          {
            charlie: 50,
            mac: 100,
            dennis: 25,
            dee: 20,
          },
          {
            charlie: 56,
            mac: 106,
            dennis: 31,
            dee: 0,
          },
        );
      });

      it('handles an absurd example', () => {
        expectSolution(
          {
            charlie: fullHouse(),
            mac: fullHouse(),
            dennis: fullHouse(),
            dee: twoPair(),
            frank: twoPair(),
            cricket: pair(),
          },
          {
            charlie: 50,
            mac: 100,
            dennis: 25,
            dee: 20,
            frank: 200,
            cricket: 125,
          },
          {
            charlie: 98,
            mac: 248,
            dennis: 48,
            dee: 0,
            frank: 125,
            cricket: 0,
          },
        );
      });
    });
  });
});
