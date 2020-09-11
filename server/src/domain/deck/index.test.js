const { Retries } = require('../../modules');
const Deck = require('./index');

describe('Domain.Deck', () => {
  describe('.create()', () => {
    it('randomly shuffles', () => {
      expect(
        () => {
          if (Deck.create()[0] === Deck.create()[0]) {
            throw new Error('Equal cards');
          }
        },
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
      let deck = Deck.create();

      let {
        cards: [card1, ...r1],
        deck: deck1,
      } = Deck.deal(deck);

      let {
        cards: [card2, ...r2],
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
