const Utils = require('./index');

describe('Utils', () => {
  it('exports modules', () => {
    [
      'chunkIf',
      'deepMap',
      'hasShape',
      'mapFind',
    ].forEach(
      method => {
        expect(Utils).toHaveProperty(method);
      }
    );
  });
});
