const hasShape = require('./index');

describe('Utils.hasShape', () => {
  it('returns false if array is too short', () => {
    expect(
      hasShape([1], [2, 3]),
    ).not.toBeTruthy();
  });

  it('returns false if shape is not respected', () => {
    expect(
      hasShape(
        [[1, 2], [3, 4]],
        [2, 3],
      ),
    ).not.toBeTruthy();
  });

  it('returns true if shape is respected', () => {
    expect(
      hasShape(
        [[1, 2], [3, 4, 5]],
        [2, 3],
      ),
    ).toBeTruthy();
  });

  it('returns true if array element is bigger than shape', () => {
    expect(
      hasShape(
        [[1, 2], [3, 4, 5, 6]],
        [2, 3],
      ),
    ).toBeTruthy();
  });
});
