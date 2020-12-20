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

    describe('hand comparison', () => {
      const tests = {
        STRAIGHT_FLUSH: [
          ['H11', 'H10', 'H9', 'H8', 'H7'],
          ['C9', 'C8', 'C7', 'C6', 'C5'],
        ],
        FOUR_OF_A_KIND: [
          ['H9', 'D9', 'S9', 'C9', 'D3'],
          ['H8', 'D8', 'S8', 'C8', 'D3'],
        ],
        FULL_HOUSE: [
          ['H9', 'D9', 'S9', 'C4', 'D4'],
          ['H8', 'D8', 'S8', 'C4', 'D4'],
        ],
        FLUSH: [
          ['H11', 'H7', 'H6', 'H3', 'H2'],
          ['D11', 'D7', 'D5', 'D3', 'D2'],
        ],
        STRAIGHT: [
          ['H11', 'D10', 'H9', 'C8', 'D7'],
          ['H9', 'C8', 'D7', 'C6', 'D5'],
        ],
        THREE_OF_A_KIND: [
          ['H9', 'D9', 'S9', 'C4', 'D3'],
          ['H8', 'D8', 'S8', 'C4', 'D3'],
        ],
        TWO_PAIR: [
          ['H9', 'D9', 'S5', 'C5', 'D3'],
          ['H8', 'D8', 'S5', 'C5', 'D3'],
        ],
        PAIR: [
          ['H9', 'D9', 'S5', 'C4', 'D3'],
          ['H8', 'D8', 'S5', 'C4', 'D3'],
        ],
        HIGH_CARD: [
          ['H13', 'H8', 'S5', 'C4', 'D3'],
          ['H9', 'H8', 'S5', 'C4', 'D3'],
        ],
      };

      Object.entries(tests).forEach(([type, hands]) => {
        it(`can compare hands with type, ${type}`, () => {
          expectSolution(
            {
              charlie: Hand.create(hands[0]),
              mac: Hand.create(hands[1]),
            },
            {
              charlie: 100,
              mac: 100,
            },
            {
              charlie: 200,
              mac: 0,
            },
          );
        });
      });

      it('handles royal flushes', () => {
        expectSolution(
          {
            charlie: Hand.create(['H14', 'H13', 'H12', 'H11', 'H10']),
            mac: Hand.create(['D14', 'D13', 'D12', 'D11', 'D10']),
          },
          {
            charlie: 100,
            mac: 100,
          },
          {
            charlie: 100,
            mac: 100,
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
      const tests = {
        FOUR_OF_A_KIND: [
          ['H7', 'D7', 'S7', 'C7', 'H4'],
          ['H7', 'D7', 'S7', 'C7', 'H3'],
        ],
        THREE_OF_A_KIND: [
          ['H7', 'D7', 'S7', 'C2', 'H4'],
          ['H7', 'D7', 'S7', 'C2', 'H3'],
        ],
        TWO_PAIR: [
          ['H7', 'D7', 'S2', 'C2', 'H4'],
          ['H7', 'D7', 'S2', 'C2', 'H3'],
        ],
        PAIR: [
          ['H7', 'D7', 'S2', 'C3', 'H5'],
          ['H7', 'D7', 'S2', 'C3', 'H4'],
        ],
        HIGH_CARD: [
          ['H7', 'D6', 'S2', 'C3', 'H5'],
          ['H7', 'D6', 'S2', 'C3', 'H4'],
        ],
      };

      Object.entries(tests).forEach(
        ([type, hands]) => {
          it(`Can handle kickers with hand type, ${type}`, () => {
            expectSolution(
              {
                charlie: Hand.create(hands[0]),
                mac: Hand.create(hands[1]),
              },
              {
                charlie: 100,
                mac: 100,
              },
              {
                charlie: 200,
                mac: 0,
              },
            );
          });
        },
      );
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
