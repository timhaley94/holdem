const mapFind = require('./index');

describe('Utils.mapFind', () => {
  it('returns the first mapped value', () => {
    expect(
      mapFind(
        [
          { value: 3 },
          { value: 4 },
          { value: 6 },
        ],
        ({ value }) => value % 2 === 0 ? value : null,
      )
    ).toEqual(4)
  });

  it('returns null if no value matches', () => {
    expect(
      mapFind(
        [
          { value: 3 },
          { value: 1 },
          { value: 5 },
        ],
        ({ value }) => value % 2 === 0 ? value : null,
      )
    ).toBe(null);
  });
});
