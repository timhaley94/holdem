const { Logger } = require('../../modules');
const { init, close, isConnected } = require('./index');

describe('Loaders.DB', () => {
  describe('.init()', () => {
    it('can establish connection', async () => {
      await expect(init()).resolves.toBeUndefined();
      expect(isConnected()).toBe(true);

      close();
    });

  //   it('logs on error', async () => {
  //     jest.mock('mongoose');
  //     const mongoose = require('mongoose');

  //     const errorSpy = jest.spyOn(Logger, 'error');
  //     mongoose.connect.mockRejectedValue('foo');

  //     try {
  //       await init();
  //     } catch(err) {}

  //     expect(errorSpy).toBeCalled();

  //     errorSpy.mockRestore();
  //     mongoose.mockReset();
  //   });
  });

  describe('.close()', () => {
    it('closes connection', async () => {
      await init();
      close();

      expect(isConnected()).toBe(false);
    });
  });
});
