const Domain = require('../../../domain');

describe('API.Views.Game', () => {
  beforeAll(Domain.init);
  afterAll(Domain.close);

  describe('.fields', () => {
    it('applies allow list', () => {

    });
  });

  describe('.permissions', () => {
    it('only shows pocket cards for user', () => {

    });

    it('shows no pocket cards if anonymous', () => {

    });
  });
});
