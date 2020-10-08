const Deck = require('./index');

const retries = (fn) => {
  const wrapped = (n = 10) => {
    try {
      return fn();
    } catch (e) {
      if (n <= 0) {
        throw e;
      }

      return wrapped(fn, n - 1);
    }
  };

  return wrapped;
};

describe('Domain.Deck', () => {
  describe('.create()', () => {
    it('randomly shuffles', () => {
      expect(
        retries(() => {
          const card1 = Deck.create()[0];
          const card2 = Deck.create()[0];

          if (card1 === card2) {
            throw new Error('Equal cards');
          }
        }),
      ).not.toThrow();
    });
  });

  describe('.deal()', () => {
    it('defaults to dealing one card', () => {
      const deck = Deck.create();
      const { cards } = Deck.deal(deck);

      expect(cards.length).toBe(1);
    });

    it('deals multiple cards', () => {
      const deck = Deck.create();
      const { cards } = Deck.deal(deck, 4);

      expect(cards.length).toBe(4);
    });

    it('deals unique cards', () => {
      const deck = Deck.create();

      const {
        cards: [card1],
        deck: deck1,
      } = Deck.deal(deck);

      const {
        cards: [card2],
      } = Deck.deal(deck1);

      expect(card1).not.toEqual(card2);
    });

    it('errors on empty deck', () => {
      const deck1 = Deck.create();
      const { deck: deck2 } = Deck.deal(deck1, 52);

      expect(
        () => Deck.deal(deck2),
      ).toThrow();
    });
  });
});
