const Stage = require('./index');

describe('Domain.Stage', () => {
  describe('.first()', () => {
    it('returns ante', () => {
      expect(Stage.first()).toEqual(Stage.ANTE);
    });
  });

  describe('.next()', () => {
    it('errors on invalid stage', () => {
      expect(() => {
        Stage.next('invalid stage');
      }).toThrow();
    });

    it('returns next stage', () => {
      expect(Stage.next(Stage.ANTE)).toEqual(Stage.PRE_FLOP);
    });

    it('returns null on final stage', () => {
      expect(Stage.next(Stage.RIVER)).toBe(null);
    });
  });
});
