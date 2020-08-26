const _ = require('lodash');
const Card = require('./index');

function retries(fn, n = 5) {
  try {
    fn();
  } catch (e) {
    if (n > 0) {
      retries(fn, n - 1);
    } else {
      throw e;
    }
  }
}

function expectEventuallyWorks(fn) {
  expect(() => retries(fn)).not.toThrow();
}

const { suits, ranks } = Card;

describe('Domain.Card', () => {
  describe('.creat()', () => {
    it('models rank as a range from 2 to 14', () => {
      expect(_.min(ranks)).toBe(2);
      expect(_.max(ranks)).toBe(14);
      expect(ranks.length).toBe(13);
    });
  
    it('selects valid suit', () => {
      expect(suits).toContain(Card.create().suit);
    });
  
    it('selects valid rank', () => {
      expect(ranks).toContain(Card.create().rank);
    });
  
    function expectRandomAttribute(attr) {
      expectEventuallyWorks(() => {
        const a = Card.create();
        const b = Card.create();
  
        if (a[attr] === b[attr]) {
          throw new Error(`attribute, ${attr}, is equal`);
        }
      });
    }
  
    it('randomly assigns id', () => {
      expectRandomAttribute('id');
    });
  
    it('randomly selects suit', () => {
      expectRandomAttribute('suit');
    });
  
    it('randomly selects rank', () => {
      expectRandomAttribute('rank');
    });
  });

  describe('.sort()', () => {
    const ace = Card.create();
    ace.rank = 14;

    const two = Card.create();
    two.rank = 2;
    two.suit = Card.SUITS[0];

    it('returns 0 if a and be have same rank', () => {
      expect(
        Card.sort(two, { ...two })
      ).toEqual(0);
    });

    it('returns < 0 if a is better than b', () => {
      expect(
        Card.sort(ace, two)
      ).toBeLessThan(0);
    });

    it('returns > 0 if b is better than a', () => {
      expect(
        Card.sort(two, ace)
      ).toBeGreaterThan(0);
    });

    it('ignores suit', () => {
      expect(
        Card.sort(two, { ...two, suit: Card.SUITS[1] })
      ).toEqual(0);
    });
  });
});
