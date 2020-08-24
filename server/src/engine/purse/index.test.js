const Purse = require('./purse');

describe('Engine.purse', () => {
  describe('.create()', () => {
    it('can handle bankroll', () => {
      expect(
        Purse.create(500).bankroll
      ).toEqual(500);
    });

    it('can use default bankroll', () => {
      expect(
        Purse.create().bankroll
      ).toEqual(
        Purse.DEFAULT_BANKROLL
      );
    });
  });
  
  describe('.bet()', () => {
    it('errors on negative value', () => {

    });

    it('ignores zero bet', () => {

    });

    it('handles normal bet', () => {

    });
    
    it('handles all in bet', () => {

    });
  });
  
  describe('.allIn()', () => {
    
  });

  describe('.resolve()', () => {

  });

  describe('.isAllIn', () => {
    it('returns true if all in', () => {
      const p = Purse.allIn(
        Purse.create()
      );

      expect(
        Purse.isAllIn(p)
      ).toEqual(true);
    });

    it('returns false if not all in', () => {
      const p = Purse.bet(
        Purse.create(),
        50,
      );

      expect(
        Purse.isAllIn(p)
      ).toEqual(false);
    });

    it('returns false if bankroll is zero', () => {
      const p = Purse.create();
      p.bankroll = 0;

      expect(
        Purse.isAllIn(p)
      ).toEqual(false);
    });
  });

  describe('.isBankrupt()', () => {
    it('returns true if bankroll is zero', () => {
      const p = Purse.create();
      p.bankroll = 0;

      expect(
        Purse.isBankrupt(p)
      ).toEqual(true);
    });

    it('returns false if bankroll is nonzero', () => {
      expect(
        Purse.isBankrupt(Purse.create())
      ).toEqual(false);
    });
  });
});
