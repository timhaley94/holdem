const Loaders = require('./index');

describe('Loaders', () => {
  describe('.init()', () => {
    it('resolves', () => (
      expect(Loaders.init()).resolves.toBe(undefined)
    ));
  });

  it('exports loaders', () => {
    ['DB', 'Cache', 'Locks'].forEach(
      (method) => {
        expect(Loaders).toHaveProperty(method);
      },
    );
  });
});
