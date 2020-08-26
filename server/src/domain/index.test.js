const DB = require('../modules/cache');
const Game = require('./game');
const Domain = require('./index');

describe('Domain', () => {
  describe('.init()', () => {
    it('references Domain.db.init', () => {
      expect(Domain.init).toBe(DB.init);
    });
  });

  describe('.Game', () => {
    it('references Domain.game', () => {
      expect(Domain.Game).toBe(Game);
    });
  });
});
