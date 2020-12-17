const Logger = require('./index');

describe('Modules.Logger', () => {
  it('methods are defined', () => {
    [
      'debug',
      'info',
      'warn',
      'error',
    ].forEach((method) => {
      expect(Logger[method]).toBeTruthy();
    });
  });
  
  describe('.errorFormat()', () => {
    it('preserves stack and message', async () => {
      const output = Logger.errorFormat({
        error: new Error('bar'),
      });

      expect(output.error.message).toBeTruthy();
      expect(output.error.stack).toBeTruthy();
    });
  });

  describe('.stream', () => {
    it('.write() calls .info()', () => {
      const spy = jest.spyOn(Logger.logger, 'info');

      Logger.stream.write('foo');
      expect(spy.mock.calls[0][0]).toEqual('foo');

      spy.mockRestore();
    });
  });
});
