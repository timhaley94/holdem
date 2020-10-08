const _ = require('lodash');
const { Schema } = require('mongoose');
const Card = require('./index');

describe('Domain.Card', () => {
  const ace = { suit: 'H', rank: 14 };
  const two = { suit: 'H', rank: 2 };

  describe('.all()', () => {
    it('provides 52 unique cards', () => {
      const cards = Card.all();
      expect(_.uniq(cards).length).toEqual(52);
    });
  });

  const random = () => _.sample(Card.all());

  describe('.schema', () => {
    it('is a mongoose schema', () => {
      expect(Card.schema).toBeInstanceOf(Schema);
    });
  });

  describe('.suit()', () => {
    expect(
      Card.SUITS,
    ).toContain(
      random().suit,
    );
  });

  describe('.rank()', () => {
    expect(
      Card.RANKS,
    ).toContain(
      random().rank,
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
        Card.sort(two, { suit: 'D', rank: 2 }),
      ).toEqual(0);
    });
  });

  describe('isAce()', () => {
    it('returns true for ace', () => {
      expect(
        Card.isAce(ace),
      ).toBe(true);
    });

    it('returns false for two', () => {
      expect(
        Card.isAce(two),
      ).toBe(false);
    });
  });
});
