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

    });

    it('deals multiple cards', () => {

    });

    it('deals unique cards', () => {
      let deck = Deck.create();
      let { card: card1, deck: deck1 } = Deck.deal(deck);
      let { card: card2 } = Deck.deal(deck1);

      expect(card1).not.toEqual(card2);
    });

    it('errors on empty deck', () => {
      expect(
        () => Deck.deal([]),
      ).toThrow();
    });
  });
});
