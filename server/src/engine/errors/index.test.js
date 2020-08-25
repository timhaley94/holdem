const Errors = require('./index');

describe('Engine.errors', () => {
  function expectPreservesError(error) {
    const childErr = new Error('child');
    const e = new error(childErr);

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
        new Errors.RequestError(msg).message
      ).toEqual(msg);
    });
  });
});
