const Hand = require('./index');

describe('Domain.Hand', () => {
  const communityCards = ['H2', 'D3'];

  const hands = [
    {
      type: 'ROYAL_FLUSH',
      cards: ['H14', 'H13', 'H12', 'H11', 'H10'],
    },
    {
      type: 'STRAIGHT_FLUSH',
      cards: ['H10', 'H9', 'H8', 'H7', 'H6'],
    },
    {
      type: 'FOUR_OF_A_KIND',
      cards: ['H14', 'D14', 'C14', 'S14', 'H10'],
    },
    {
      type: 'FULL_HOUSE',
      cards: ['H14', 'D14', 'C14', 'H13', 'D13'],
    },
    {
      type: 'FLUSH',
      cards: ['H14', 'H10', 'H5', 'H7', 'H11'],
    },
    {
      type: 'STRAIGHT',
      cards: ['H10', 'D9', 'C8', 'S7', 'H6'],
    },
    {
      type: 'THREE_OF_A_KIND',
      cards: ['H14', 'D14', 'C14', 'H5', 'D7'],
    },
    {
      type: 'TWO_PAIR',
      cards: ['H14', 'D14', 'H13', 'D13', 'H12'],
    },
    {
      type: 'PAIR',
      cards: ['H14', 'D14', 'H4', 'D5', 'S9'],
    },
    {
      type: 'HIGH_CARD',
      cards: ['H14', 'C10', 'H4', 'D5', 'S9'],
    },
  ];

  describe('.create()', () => {
    function expectHand(expectedType, pocketCards) {
      const { type, match } = Hand.create([
        ...pocketCards,
        ...communityCards,
      ])

      expect(type).toBe(expectedType);
      expect(match.length).toBe(5);
      expect(match).toEqual(expect.arrayContaining(pocketCards));
      expect(pocketCards).toEqual(expect.arrayContaining(match));
    }

    hands.forEach(
      ({ type, cards }) => {
        it(`correctly creates hand, ${type}`, () => {
          expectHand(type, cards);
        });
      },
    );
  });
  
  describe('.solve()', () => {
    function expectOrder(worse, better) {
      expect(
        Hand.solve({
          communityCards,
          pocketCards: {
            worse,
            better,
          }
        }).map(hand => hand.userId)
      ).toEqual(['better', 'worse']);
    }

    function test(hands) {
      if (hands.length > 1) {
        const [hand, ...rest] = hands;

        rest.forEach(
          worse => {
            it(`sorts ${hand.type} above ${worse.type}`, () => {
              expectOrder(worse.cards, hand.cards);
            });
          },
        );

        test(rest);
      }
    }

    test(hands);

    it('utilizes communityCards', () => {

    });

    it('handles true ties', () => {

    });

    describe('kickers', () => {
      
    });
  });
});
