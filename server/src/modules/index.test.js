const Modules = require('./index');

describe('Modules', () => {
  describe('.init()', () => {
    it('resolves', () => {
      return expect(Modules.init()).resolves.toBe(undefined);
    });
  });
  
  it('exports modules', () => {
    [
      'Auth',
      'Cache',
      'Errors',
      'Monitoring',
      'Validator',
    ].forEach(
      method => {
        expect(Modules).toHaveProperty(method);
      }
    );
  });
});
