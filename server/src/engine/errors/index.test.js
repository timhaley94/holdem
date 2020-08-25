const Errors = require('./index');

describe('Engine.errors', () => {
  function expectPreservesError(TestError) {
    const childErr = new Error('child');
    const e = new TestError(childErr);

    expect(e.err).toBe(childErr);
  }

  describe('DBError', () => {
    it('preserves child error', () => {
      expectPreservesError(Errors.DBError);
    });
  });

  describe('FatalError', () => {
    it('preserves child error', () => {
      expectPreservesError(Errors.FatalError);
    });
  });

  describe('RequestError', () => {
    it('preserves message', () => {
      const msg = 'Hi';
      expect(
        new Errors.RequestError(msg).message,
      ).toEqual(msg);
    });
  });
});
