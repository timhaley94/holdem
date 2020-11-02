const { init, close, isConnected } = require('./index');

describe('Loaders.DB', () => {
  describe('.init()', () => {
    it('can establish connection', async () => {
      await expect(init()).resolves.toBeUndefined();
      expect(isConnected()).toBe(true);

      close();
    });
  });

  describe('.close()', () => {
    it('closes connection', async () => {
      await init();
      close();

      expect(isConnected()).toBe(false);
    });
  });
});
