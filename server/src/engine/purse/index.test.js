const Purse = require('./index');

describe('Engine.purse', () => {
  describe('.create()', () => {
    it('can handle bankroll arg', () => {
      const bankroll = Purse.DEFAULT_BANKROLL * 2;

      expect(
        Purse.create(bankroll).bankroll
      ).toEqual(bankroll);
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
      expect(
        () => {
          Purse.bet(
            Purse.create(),
            -1,
          );
        },
      ).toThrow();
    });

    it('ignores zero bet', () => {
      expect(
        Purse.bet(Purse.create(), 0).wagered
      ).toEqual(0);
    });

    it('handles normal bet', () => {
      expect(
        Purse.bet(
          Purse.create(),
          1,
        ).wagered,
      ).toEqual(1);
    });

    it('ignores zero bet after normal bet', () => {
      expect(
        Purse.bet(
          Purse.bet(
            Purse.create(),
            1,
          ),
          0,
        ).wagered,
      ).toEqual(1);
    });
    
    it('handles all in bet', () => {
      expect(
        Purse.bet(
          Purse.create(),
          Purse.DEFAULT_BANKROLL + 1,
        ).wagered,
      ).toEqual(Purse.DEFAULT_BANKROLL);
    });
  });
  
  describe('.allIn()', () => {
    it('handles all in call', () => {
      expect(
        Purse.allIn(
          Purse.create()
        ).wagered,
      ).toEqual(Purse.DEFAULT_BANKROLL);
    });

    it('handles second call', () => {
      expect(
        Purse.allIn(
          Purse.allIn(
            Purse.create()
          )
        ).wagered,
      ).toEqual(Purse.DEFAULT_BANKROLL);
    });

    it('handles all in call after normal bet', () => {
      expect(
        Purse.allIn(
          Purse.bet(
            Purse.create(),
            1
          )
        ).wagered,
      ).toEqual(Purse.DEFAULT_BANKROLL);
    });
  });

  describe('.resolve()', () => {
    it('handles 0 wager', () => {
      expect(
        Purse.resolve(
          Purse.create(),
          0,
        ).bankroll
      ).toEqual(Purse.DEFAULT_BANKROLL);
    });

    it('handles lost wager', () => {
      expect(
        Purse.resolve(
          Purse.bet(
            Purse.create(),
            1
          ),
          0,
        ).bankroll
      ).toEqual(Purse.DEFAULT_BANKROLL - 1);
    });

    it('handles winnings', () => {
      expect(
        Purse.resolve(
          Purse.bet(
            Purse.create(),
            1
          ),
          2,
        ).bankroll
      ).toEqual(Purse.DEFAULT_BANKROLL + 1);
    });

    it('handles all in', () => {
      expect(
        Purse.resolve(
          Purse.allIn(
            Purse.create(),
          ),
          0,
        ).bankroll
      ).toEqual(0);
    });
  });

  describe('.isAllIn()', () => {
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
        1,
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
