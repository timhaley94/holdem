const Stage = require('./index');

describe('Domain.Stage', () => {
  describe('.first()', () => {
    it('returns pre-flop', () => {
      expect(Stage.first()).toEqual(Stage.PRE_FLOP);
    });
  });

  describe('.next()', () => {
    it('errors on invalid stage', () => {
      expect(() => {
        Stage.next('invalid stage');
      }).toThrow();
    });

    it('returns next stage', () => {
      expect(Stage.next(Stage.PRE_FLOP)).toEqual(Stage.FLOP);
    });

    it('returns null on final stage', () => {
      expect(Stage.next(Stage.RIVER)).toBe(null);
    });
  });
});
