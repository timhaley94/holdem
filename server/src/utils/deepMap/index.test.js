const deepMap = require(".");

describe('Utils.deepMap', () => {
  it('maps while maintaining structure', () => {
    expect(
      deepMap(
        [
          2,
          [3, 4, 5],
          [[6]],
          7,
        ],
        x => x ** 2,
      )
    ).toEqual(
      [
        4,
        [9, 16, 25],
        [[36]],
        49,
      ]
    )
  });
});
