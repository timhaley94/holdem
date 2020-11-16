const Errors = require('../../../modules/errors');
const {
  middleware,
  defaultMessage,
  defaultStatus,
} = require('./index');

describe('API.Rest.Errors', () => {
  describe('middleware', () => {
    const test = (e, status, message) => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      middleware(
        e,
        null,
        res,
      );

      expect(res.status.mock.calls[0][0]).toEqual(status);
      expect(res.json.mock.calls[0][0].message).toEqual(message);
    };

    it('handles custom errors', () => {
      const msg = 'Custom message';
      test(
        new Errors.Unauthorized(msg),
        401,
        msg,
      );
    });

    it('defaults on all others', () => {
      test(
        new Error('Random exception'),
        defaultStatus,
        defaultMessage,
      );
    });
  });
});
