const CommunityCards = require('./index');
const Stage = require('../stage');

describe('Engine.communityCards', () => {
  describe('.create()', () => {
    it('starts stage at ante', () => {
      expect(
        CommunityCards.create().stage
      ).toEqual(Stage.ANTE);
    });

    it('supplies empty cards array', () => {
      const { cards } = CommunityCards.create();

      expect(Array.isArray(cards)).toBeTruthy();
      expect(cards.length).toEqual(0);
    });
  });
  
  describe('.deal()', () => {
    it('does not mutate object', () => {
      const obj = CommunityCards.create();

      expect(
        CommunityCards.deal(obj)
      ).not.toBe(obj);
    });

    it('advances stage', () => {
      const curr = CommunityCards.create();
      const next = CommunityCards.deal(curr);

      expect(next.stage).toEqual(
        Stage.next(curr.stage)
      );
    });

    it('deals no cards preflop', () => {
      const cc = CommunityCards.deal(
        CommunityCards.create()
      );
  
      expect(
        cc.cards.length
      ).toEqual(0);
    });

    it('deals cards postflop', () => {
      let curr = CommunityCards.create();
      let next = null;

      Array(3).forEach(
        () => {
          next = CommunityCards.deal(curr);

          expect(
            next.cards.length
          ).toBeGreaterThan(
            curr.cards.length
          );

          curr = next;
        }
      );
    });
  });
})
