const Modules = require('./index');

describe('Modules', () => {
  describe('.init()', () => {
    it('resolves', () => (
      expect(Modules.init()).resolves.toBe(undefined)
    ));
  });

  it('exports modules', () => {
    ['DB'].forEach(
      (method) => {
        expect(Modules).toHaveProperty(method);
      },
    );
  });
});
