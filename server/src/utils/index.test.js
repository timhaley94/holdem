const Utils = require('./index');

describe('Utils', () => {
  it('exports modules', () => {
    [
      'chunkIf',
      'deepMap',
      'hasShape',
      'mapFind',
      'sleep',
    ].forEach(
      (method) => {
        expect(Utils).toHaveProperty(method);
      },
    );
  });
});
