const _ = require('lodash');
const { Card, ranks, suits } = require('./index');

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

describe('Engine.card', () => {
  it('models rank as a range from 2 to 14', () => {
    expect(_.min(ranks)).toBe(2);
    expect(_.max(ranks)).toBe(14);
    expect(ranks.length).toBe(13);
  });

  it('selects valid suit', () => {
    expect(suits).toContain(Card().suit);
  });

  it('selects valid rank', () => {
    expect(ranks).toContain(Card().rank);
  });

  function expectRandomAttribute(attr) {
    expectEventuallyWorks(() => {
      const a = Card();
      const b = Card();

      if (a[attr] === b[attr]) {
        throw new Error(`attribute, ${attr}, is equal`);
      }
    });
  }

  it('randomly selects suit', () => {
    expectRandomAttribute('suit');
  });

  it('randomly selects rank', () => {
    expectRandomAttribute('rank');
  });
});
