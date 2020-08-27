const Modules = require('./index');

describe('Modules', () => {
  describe('.init()', () => {
    it('resolves', () => {
      return expect().resolves;
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
        expect(Modules).toContain(method);
      }
    );
  });
});
