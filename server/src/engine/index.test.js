const DB = require('./db');
const Game = require('./game');
const Engine = require('./index');

describe('Engine', () => {
  describe('.init()', () => {
    it('references Engine.db.init', () => {
      expect(Engine.init).toBe(DB.init);
    });
  });

  describe('.Game', () => {
    it('references Engine.game', () => {
      expect(Engine.Game).toBe(Game);
    });
  });
});
