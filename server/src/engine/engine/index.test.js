const Game = require('../game');
const Engine = require('./index');

describe('Engine.engine', () => {
  describe('.init()', () => {

  });

  describe('.Game', () => {
    it('is reference to Engine.game module', () => {
      expect(Engine.Game).toBe(Game);
    });
  });
});
