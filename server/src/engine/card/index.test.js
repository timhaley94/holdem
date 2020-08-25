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

describe('Engine.card', () => {
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
