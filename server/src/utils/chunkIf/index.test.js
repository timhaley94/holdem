const chunkIf = require('.');

describe('Utils.chunkIf', () => {
  it('groups elements that pass test', () => {
    expect(
      chunkIf(
        [1, 2, 2, 1, 3, 4, 4, 4, 4, 2],
        (a, b) => (a ** 2) === (b ** 2),
      ),
    ).toEqual(
      [1, [2, 2], 1, 3, [4, 4, 4, 4], 2],
    );
  });

  it('handles empty array', () => {
    expect([]).toEqual([]);
  });
});
