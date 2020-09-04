const _ = require('lodash');
const Card = require('./index');


function expectEventuallyWorks(fn) {
  expect(() => retries(fn)).not.toThrow();
}

const { suits, ranks } = Card;

describe('Domain.Card', () => {
  const ace = 'H14';
  const two = 'H2';

  describe('.all()', () => {
    it('provides 52 unique cards', () => {
      const cards = Card.all();
      expect(_.uniq(cards).length).toEqual(52);
    });
  });

  const random = () =>_.sample(Card.all())

  describe('.suit()', () => {
    expect(
      Card.SUITS,
    ).toContain(
      Card.suit(random())
    );
  });
  
  describe('.rank()', () => {
    expect(
      Card.RANKS,
    ).toContain(
      Card.rank(random())
    );
  });

  describe('.sort()', () => {
    it('returns 0 if a and be have same rank', () => {
      expect(
        Card.sort(two, two),
      ).toEqual(0);
    });

    it('returns < 0 if a is better than b', () => {
      expect(
        Card.sort(ace, two),
      ).toBeLessThan(0);
    });

    it('returns > 0 if b is better than a', () => {
      expect(
        Card.sort(two, ace),
      ).toBeGreaterThan(0);
    });

    it('ignores suit', () => {
      expect(
        Card.sort(two, 'D2'),
      ).toEqual(0);
    });
  });

  describe('isAce()', () => {
    it('returns true for ace', () => {
      expect(
        Card.isAce(ace)
      ).toBe(true);
    });

    it('returns false for two', () => {
      expect(
        Card.isAce(two)
      ).toBe(false);
    });
  });
});
